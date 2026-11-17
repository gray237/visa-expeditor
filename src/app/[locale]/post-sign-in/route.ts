import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/isAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const { data: session } = await auth.getSession();
  const email = session?.user?.email ?? null;

  if (!email) {
    return NextResponse.redirect(new URL(`/${safeLocale}/sign-in`, request.url));
  }

  const path = isAdminEmail(email) ? `/${safeLocale}/admin` : `/${safeLocale}/dashboard`;
  return NextResponse.redirect(new URL(path, request.url));
}
