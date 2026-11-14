import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Next.js 16 proxy: use named `proxy` export (checked before mod.default in the
// CJS interop template). A default-only export causes ProxyMissingExportError.
export const proxy = intlMiddleware;

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next|og(?:/|$)|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
