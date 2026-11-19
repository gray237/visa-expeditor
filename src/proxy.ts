import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_AUTH_SKIP_ROUTES, processAuthMiddleware } from "@neon/auth/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function localeSkipRoute(pathname: string) {
  const segment = pathname.split("/")[1];
  return segment && routing.locales.includes(segment as (typeof routing.locales)[number])
    ? `/${segment}`
    : null;
}

// Next.js 16 proxy: use named `proxy` export (checked before mod.default in the
// CJS interop template). A default-only export causes ProxyMissingExportError.
export async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET?.trim();
  if (!baseUrl || !cookieSecret || cookieSecret.length < 32) {
    return intlResponse;
  }

  const pathname = request.nextUrl.pathname;
  const localeSkip = localeSkipRoute(pathname);
  const skipRoutes = localeSkip
    ? [...DEFAULT_AUTH_SKIP_ROUTES, localeSkip]
    : [...DEFAULT_AUTH_SKIP_ROUTES];

  const authResult = await processAuthMiddleware({
    request,
    pathname,
    skipRoutes,
    loginUrl: new URL("/sign-in", request.url).toString(),
    baseUrl,
    cookieSecret,
    sessionDataTtl: 300,
  });

  if (authResult.action === "redirect_oauth") {
    const res = NextResponse.redirect(authResult.redirectUrl);
    for (const cookie of authResult.cookies) res.headers.append("Set-Cookie", cookie);
    return res;
  }

  if (authResult.action === "allow") {
    if (authResult.headers) {
      for (const [key, value] of Object.entries(authResult.headers)) {
        intlResponse.headers.set(key, value);
      }
    }
    if (authResult.cookies) {
      for (const cookie of authResult.cookies) {
        intlResponse.headers.append("Set-Cookie", cookie);
      }
    }
  }

  // Let next-intl/app routes handle other cases (including login redirects).
  return intlResponse;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next|og(?:/|$)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
  ],
};
