import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL?.trim() ||
  "Visa Expeditor <hello@mail.visaexpeditor.com>";

export const TEAM_EMAIL = process.env.TEAM_EMAIL?.trim() ?? "";

function senderDomain() {
  const match = FROM_EMAIL.match(/@([^>\s]+)/);
  return match?.[1]?.toLowerCase();
}

/**
 * Resend only delivers to arbitrary recipients from a verified sending domain.
 * When the domain is not verified (for example, onboarding@resend.dev), the
 * applicant confirmation cannot be sent, but the request must still succeed.
 */
export async function isSenderDomainVerified() {
  if (!resend) return false;
  const domain = senderDomain();
  if (!domain) return false;

  try {
    const { data, error } = await resend.domains.list();
    if (error || !data) return false;
    return data.data.some(
      (item) => item.name.toLowerCase() === domain && item.status === "verified",
    );
  } catch {
    return false;
  }
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailArgs) {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY is not set; skipping email send.");
    return { error: new Error("Email is not configured.") };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    return { error: error ?? null };
  } catch (error) {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
}
