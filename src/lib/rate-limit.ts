import { createHash } from "node:crypto";

const CONTACT_LIMIT = 5;
const WINDOW_SECONDS = 60 * 60;

type UpstashResult = {
  result?: unknown;
  error?: string;
};

export async function isSubmissionRateLimited(
  ip: string | undefined,
  scope: "contact" | "application",
) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    if (process.env.NODE_ENV !== "production") return false;
    throw new Error("Submission rate limiting is not configured.");
  }

  if (!ip) {
    if (process.env.NODE_ENV !== "production") return false;
    throw new Error("A client IP is unavailable for submission rate limiting.");
  }

  const ipHash = createHash("sha256").update(ip).digest("hex");
  const script =
    "local count = redis.call('INCR', KEYS[1]); " +
    "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; " +
    "return count";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      script,
      "1",
      `visa-expeditor:${scope}:${ipHash}`,
      String(WINDOW_SECONDS),
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Submission rate limit service returned ${response.status}.`);
  }

  const result = (await response.json()) as UpstashResult;
  if (result.error || typeof result.result !== "number") {
    throw new Error("Submission rate limit service returned an invalid response.");
  }

  return result.result > CONTACT_LIMIT;
}
