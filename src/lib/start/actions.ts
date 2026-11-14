"use server";

import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { escapeHtml, resend, sendEmail, TEAM_EMAIL } from "@/lib/resend";
import { isSubmissionRateLimited } from "@/lib/rate-limit";
import { isTurnstileConfigured, verifyTurnstile } from "@/lib/turnstile";
import { applicationSchema } from "@/lib/start/schema";

export type ApplicationState = { status: "error"; error: string } | undefined;

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function clientIp() {
  const headerStore = await headers();
  return (
    headerStore.get("cf-connecting-ip") ??
    headerStore.get("x-real-ip") ??
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined
  );
}

export async function submitApplication(
  _previousState: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  if (formText(formData, "website")) return { status: "error", error: "spam" };

  const parsed = applicationSchema.safeParse({
    service: formText(formData, "service"),
    purpose: formText(formData, "purpose"),
    passport: formText(formData, "passport").toUpperCase(),
    destination: formText(formData, "destination").toUpperCase(),
    name: formText(formData, "name"),
    email: formText(formData, "email"),
    phone: formText(formData, "phone"),
    travelStart: formText(formData, "travelStart"),
    travelEnd: formText(formData, "travelEnd"),
    message: formText(formData, "message"),
    privacyConsent: formData.get("privacyConsent") === "on",
  });

  if (!parsed.success) return { status: "error", error: "invalidInput" };

  const turnstileToken = formText(formData, "cf-turnstile-response");
  if (process.env.NODE_ENV === "production" && !isTurnstileConfigured()) {
    return { status: "error", error: "turnstileNotConfigured" };
  }

  const ip = await clientIp();
  try {
    if (await isSubmissionRateLimited(ip, "application")) {
      return { status: "error", error: "rateLimited" };
    }
  } catch {
    console.error("[start] Rate limiting is unavailable.");
    return { status: "error", error: "rateLimitUnavailable" };
  }

  if (!(await verifyTurnstile(turnstileToken, ip, "application"))) {
    return { status: "error", error: "turnstile" };
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return { status: "error", error: "databaseNotConfigured" };
  if (!resend || !TEAM_EMAIL) return { status: "error", error: "emailNotConfigured" };

  const application = parsed.data;
  try {
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO visa_applications (
        service, purpose, passport_country, destination, full_name, email, phone,
        travel_start, travel_end, message
      ) VALUES (
        ${application.service}, ${application.purpose}, ${application.passport},
        ${application.destination}, ${application.name}, ${application.email},
        ${application.phone || null}, ${application.travelStart}, ${application.travelEnd},
        ${application.message || null}
      )
    `;
  } catch {
    console.error("[start] Application insert failed.");
    return { status: "error", error: "databaseUnavailable" };
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "start" });
  const safeName = escapeHtml(application.name);
  const safeEmail = escapeHtml(application.email);
  const safePhone = escapeHtml(application.phone || t("email.notProvided"));
  const safeMessage = escapeHtml(application.message || t("email.notProvided")).replaceAll(
    "\n",
    "<br />",
  );
  const service = t(`services.${application.service}`);
  const purpose = t(`purposes.${application.purpose}`);
  const details = [
    `${t("email.name")}: ${application.name}`,
    `${t("email.email")}: ${application.email}`,
    `${t("email.phone")}: ${application.phone || t("email.notProvided")}`,
    `${t("email.service")}: ${service}`,
    `${t("email.purpose")}: ${purpose}`,
    `${t("email.passport")}: ${application.passport}`,
    `${t("email.destination")}: ${application.destination}`,
    `${t("email.travelDates")}: ${application.travelStart ?? t("email.notProvided")} – ${application.travelEnd ?? t("email.notProvided")}`,
    `${t("email.message")}: ${application.message || t("email.notProvided")}`,
  ].join("\n");
  const teamHtml = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#161b22">
      <h1 style="font-size:20px;margin:0 0 20px;color:#0f2444">${t("email.teamHeading")}</h1>
      <p>${t("email.name")}: ${safeName}</p>
      <p>${t("email.email")}: ${safeEmail}</p>
      <p>${t("email.phone")}: ${safePhone}</p>
      <p>${t("email.service")}: ${escapeHtml(service)}</p>
      <p>${t("email.purpose")}: ${escapeHtml(purpose)}</p>
      <p>${t("email.passport")}: ${application.passport}</p>
      <p>${t("email.destination")}: ${application.destination}</p>
      <p>${t("email.travelDates")}: ${application.travelStart ?? t("email.notProvided")} – ${application.travelEnd ?? t("email.notProvided")}</p>
      <p>${t("email.message")}: ${safeMessage}</p>
    </div>
  `;

  const [teamResult, applicantResult] = await Promise.all([
    sendEmail({
      to: TEAM_EMAIL,
      subject: t("email.teamSubject"),
      html: teamHtml,
      text: `${t("email.teamHeading")}\n${details}`,
      replyTo: application.email,
    }),
    sendEmail({
      to: application.email,
      subject: t("email.applicantSubject"),
      html: `<p>${t("email.applicantBody")}</p>`,
      text: t("email.applicantBody"),
      replyTo: TEAM_EMAIL,
    }),
  ]);

  if (teamResult.error || applicantResult.error) {
    console.error("[start] Application email notification failed.");
    return { status: "error", error: "storedEmailFailed" };
  }

  redirect(`/${locale}/start/confirmation`);
}
