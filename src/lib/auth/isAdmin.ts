/**
 * Administrator access control.
 *
 * The account owner (visaexpeditor00@gmail.com) is auto-recognised as an
 * administrator when the ADMIN_EMAILS environment variable contains their
 * email. Set ADMIN_EMAILS in .env.local and in the Vercel production env.
 * Multiple addresses are supported as a comma-separated list.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/**
 * Convenience guard used by server components / route handlers.
 * Returns the admin email when the current session user is an admin.
 */
export async function getAdminSessionEmail(): Promise<{
  email: string | null;
  isAdmin: boolean;
}> {
  const { auth } = await import("@/lib/auth/server");
  const { data: session } = await auth.getSession();
  const email = session?.user?.email ?? null;
  return { email, isAdmin: isAdminEmail(email) };
}