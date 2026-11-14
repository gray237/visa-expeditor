import type { MetadataRoute } from "next";
import { localePath, SITE_IS_PREVIEW, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  if (SITE_IS_PREVIEW) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  const privatePaths = ["/dashboard", "/sign-in", "/sign-up", "/start"];
  const localizedPrivatePaths = routing.locales.flatMap((locale) =>
    privatePaths.map((path) => localePath(locale, path)),
  );
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...localizedPrivatePaths, "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
