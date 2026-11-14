import { z } from "zod";

const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalValue = z.preprocess(
  blankToUndefined,
  z.string().trim().min(1).optional(),
);
const optionalUrl = z.preprocess(
  blankToUndefined,
  z.url().optional(),
);

const RuntimeEnvironmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEON_AUTH_BASE_URL: optionalUrl,
  NEON_AUTH_COOKIE_SECRET: optionalValue,
  DATABASE_URL: optionalValue,
  RESEND_API_KEY: optionalValue,
  RESEND_FROM_EMAIL: optionalValue,
  TEAM_EMAIL: optionalValue,
  RESEND_WEBHOOK_SECRET: optionalValue,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalValue,
  TURNSTILE_SECRET_KEY: optionalValue,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalValue,
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
});

export function validateRuntimeEnvironment() {
  const parsed = RuntimeEnvironmentSchema.safeParse(process.env);
  if (!parsed.success) {
    const invalidKeys = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");
    throw new Error(`Invalid environment configuration: ${invalidKeys}`);
  }

  const { NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET } = parsed.data;
  if (
    NEON_AUTH_BASE_URL &&
    (!NEON_AUTH_COOKIE_SECRET || NEON_AUTH_COOKIE_SECRET.length < 32)
  ) {
    throw new Error(
      "NEON_AUTH_BASE_URL requires a NEON_AUTH_COOKIE_SECRET of at least 32 characters.",
    );
  }
}
