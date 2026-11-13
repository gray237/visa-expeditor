import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL?.trim() ||
  "Visa Expeditor <hello@mail.visaexpeditor.com>";

export const TEAM_EMAIL = process.env.TEAM_EMAIL?.trim() ?? "";

export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID?.trim() ?? "";

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
