import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaexpeditor.com";

/**
 * Path without a leading locale prefix for the default locale, with one for
 * every other locale. `path` must start with "/" and never include the locale.
 */
export function localePath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? clean : `/${locale}${clean}`;
}

export function localeAlternates(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path;
  return {
    en: `${SITE_URL}${clean}`,
    es: `${SITE_URL}/es${clean}`,
    fr: `${SITE_URL}/fr${clean}`,
  };
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${localePath(locale, path)}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: localeAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Visa Expeditor",
      locale,
      type: "website",
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
