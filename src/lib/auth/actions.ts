"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { after } from "next/server";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/isAdmin";
import { escapeHtml, sendEmail } from "@/lib/resend";
import { SITE_URL } from "@/lib/seo";
import { verifyTurnstile } from "@/lib/turnstile";

export type AuthActionState = { error?: string } | undefined;

type ProviderError = {
  message?: string;
  code?: string;
  status?: number;
} | null;

function normalizeAuthError(error: ProviderError) {
  if (!error) return "generic";

  const message = error.message?.toLowerCase() ?? "";

  if (message.includes("invalid") && message.includes("password")) {
    return "invalidCredentials";
  }
  if (message.includes("already") || message.includes("exist")) {
    return "emailInUse";
  }
  if (message.includes("verif")) {
    return "verifyEmail";
  }
  if (error.status === 429) {
    return "tooManyAttempts";
  }
  if (error.status === 502 || message.includes("authentication server")) {
    return "authUnavailable";
  }

  return "generic";
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

async function sendWelcomeEmail({
  to,
  name,
  locale,
}: {
  to: string;
  name: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "auth.email" });
  const safeName = escapeHtml(name);

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#161b22">
      <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#b8925a;margin:0 0 16px">Visa Expeditor</p>
      <h1 style="font-size:24px;line-height:1.25;margin:0 0 16px;color:#0f2444">${t("heading", { name: safeName })}</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">${t("body")}</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 24px">${t("next")}</p>
      <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#0f2444;color:#f5f6f4;text-decoration:none;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600">${t("cta")}</a>
      <p style="font-size:12px;line-height:1.6;color:#667085;margin:28px 0 0">${t("footer")}</p>
    </div>
  `;

  const text = [t("heading", { name }), "", t("body"), "", t("next"), "", t("footer")].join(
    "\n",
  );

  const { error } = await sendEmail({
    to,
    subject: t("subject"),
    html,
    text,
  });

  if (error) {
    console.warn("[auth] Welcome email failed:", error.message);
  }
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  if (!email || !password) return { error: "missingFields" };

  if (!(await verifyTurnstile(turnstileToken, await clientIp()))) {
    return { error: "turnstile" };
  }

  const { error } = await auth.signIn.email({ email, password });
  if (error) return { error: normalizeAuthError(error) };

  const locale = await getLocale();
  const { data: session } = await auth.getSession();
  if (isAdminEmail(session?.user?.email ?? email)) redirect(`/${locale}/admin`);
  redirect(`/${locale}/dashboard`);
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");

  if (!email || !password) return { error: "missingFields" };
  if (password.length < 8) return { error: "passwordTooShort" };

  if (!(await verifyTurnstile(turnstileToken, await clientIp()))) {
    return { error: "turnstile" };
  }

  const displayName = name || email.split("@")[0];
  const { error } = await auth.signUp.email({
    email,
    password,
    name: displayName,
  });

  if (error) return { error: normalizeAuthError(error) };

  const locale = await getLocale();
  after(() => sendWelcomeEmail({ to: email, name: displayName, locale }));

  const { data: session } = await auth.getSession();
  if (session?.user) {
    if (isAdminEmail(session.user.email ?? email)) redirect(`/${locale}/admin`);
    redirect(`/${locale}/dashboard`);
  }

  redirect(`/${locale}/sign-in?registered=1`);
}

export async function signOutAction() {
  const locale = await getLocale();
  await auth.signOut();
  redirect(`/${locale}`);
}
