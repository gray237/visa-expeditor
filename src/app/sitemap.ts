import type { MetadataRoute } from "next";
import { LEGAL_DRAFT_BANNER, LEGAL_PAGES } from "@/content/legal";
import { localeAlternates, localePath, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const INDEXABLE_PATHS = [
  "/",
  "/about",
  "/contact",
  "/immigration",
  "/immigration/citizenship",
  "/immigration/family",
  "/immigration/green-cards",
  "/immigration/investor-visas",
  "/passports",
  "/passports/lost-stolen",
  "/passports/name-change",
  "/passports/new",
  "/passports/renewal",
  "/resources",
  "/resources/faqs",
  "/tools",
  "/tools/passport-validity",
  "/tools/visa-checker",
  "/visas",
  "/visas/business",
  "/visas/student",
  "/visas/tourist",
  "/visas/work",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = LEGAL_DRAFT_BANNER
    ? INDEXABLE_PATHS
    : [...INDEXABLE_PATHS, ...LEGAL_PAGES.map((page) => page.path)];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      alternates: { languages: localeAlternates(path) },
    })),
  );
}
