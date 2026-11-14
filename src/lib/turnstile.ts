const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResponse = {
  success?: boolean;
  action?: string;
  "error-codes"?: string[];
};

export function isTurnstileConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim(),
  );
}

export async function verifyTurnstile(
  token: string | null,
  remoteIp?: string,
  expectedAction?: string,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!isTurnstileConfigured() || !secret) {
    return process.env.NODE_ENV !== "production";
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
    });

    if (!response.ok) return false;

    const result = (await response.json()) as TurnstileResponse;
    return (
      result.success === true &&
      (!expectedAction || result.action === expectedAction)
    );
  } catch {
    return false;
  }
}
