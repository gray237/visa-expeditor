import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();

  if (!resend || !secret) {
    return Response.json({ error: "Resend webhook is not configured." }, { status: 503 });
  }

  const payload = await request.text();

  let event;

  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? request.headers.get("webhook-id") ?? "",
        timestamp:
          request.headers.get("svix-timestamp") ??
          request.headers.get("webhook-timestamp") ??
          "",
        signature:
          request.headers.get("svix-signature") ??
          request.headers.get("webhook-signature") ??
          "",
      },
      webhookSecret: secret,
    });
  } catch {
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  switch (event.type) {
    case "email.received":
      console.info("[resend] Inbound email received", {
        emailId: event.data.email_id,
        from: event.data.from,
        to: event.data.to,
        subject: event.data.subject,
      });
      break;
    case "inbox.email.received":
      console.info("[resend] Inbox email received", {
        emailId: event.data.email_id,
      });
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
