"use server";

import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { escapeHtml, sendEmail, TEAM_EMAIL } from "@/lib/resend";
import { isSubmissionRateLimited } from "@/lib/rate-limit";
import { isTurnstileConfigured, verifyTurnstile } from "@/lib/turnstile";

export type ContactState =
  | { status: "success" }
  | { status: "error"; error: string }
  | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function clientIp() {
  const headerStore = await headers();

  return (
    headerStore.get("cf-connecting-ip") ??
    headerStore.get("x-real-ip") ??
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    undefined
  );
}

export async function submitContact(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "general").trim();
  const message = String(formData.get("message") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  if (website) return { status: "error", error: "spam" };
  if (!name || !email || !message) return { status: "error", error: "missingFields" };
  if (!EMAIL_PATTERN.test(email)) return { status: "error", error: "invalidEmail" };
  if (message.length > 5000) return { status: "error", error: "messageTooLong" };

  const ip = await clientIp();
  try {
    if (await isSubmissionRateLimited(ip, "contact")) {
      return { status: "error", error: "rateLimited" };
    }
  } catch {
    console.error("[contact] Rate limiting is unavailable.");
    return { status: "error", error: "rateLimitUnavailable" };
  }

  if (process.env.NODE_ENV === "production" && !isTurnstileConfigured()) {
    return { status: "error", error: "turnstileNotConfigured" };
  }

  if (!(await verifyTurnstile(turnstileToken, ip, "contact"))) {
    return { status: "error", error: "turnstile" };
  }

  if (!TEAM_EMAIL) {
    console.warn("[contact] TEAM_EMAIL is not set; cannot deliver lead.");
    return { status: "error", error: "emailNotConfigured" };
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "contact" });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeTopic = escapeHtml(topic);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#161b22">
      <h1 style="font-size:20px;margin:0 0 20px;color:#0f2444">${t("email.heading")}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#667085">Name</td><td style="padding:6px 0">${safeName}</td></tr>
        <tr><td style="padding:6px 0;color:#667085">Email</td><td style="padding:6px 0">${safeEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#667085">Topic</td><td style="padding:6px 0">${safeTopic}</td></tr>
      </table>
      <p style="margin:20px 0 8px;color:#667085;font-size:13px">${t("email.messageLabel")}</p>
      <div style="border-left:3px solid #b8925a;padding:4px 0 4px 14px;font-size:14px;line-height:1.7">${safeMessage}</div>
    </div>
  `;

  const text = [
    `${t("email.heading")}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    "",
    message,
  ].join("\n");

  const { error } = await sendEmail({
    to: TEAM_EMAIL,
    subject: t("email.subject", { name }),
    html,
    text,
    replyTo: email,
  });

  if (error) {
    console.error("[contact] Failed to send lead.");
    return { status: "error", error: "sendFailed" };
  }

  return { status: "success" };
}
