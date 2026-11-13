import { createNeonAuth } from "@neon/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim() ?? "";
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET?.trim() ?? "";

const FALLBACK_SECRET = "neon-auth-not-configured-placeholder-secret";
const FALLBACK_BASE_URL = "http://127.0.0.1:9";

export const isAuthConfigured = baseUrl.length > 0 && cookieSecret.length >= 32;

export const auth = createNeonAuth({
  baseUrl: isAuthConfigured ? baseUrl : FALLBACK_BASE_URL,
  cookies: {
    secret: cookieSecret.length >= 32 ? cookieSecret : FALLBACK_SECRET,
    sameSite: "lax",
  },
  logLevel: "warn",
});
