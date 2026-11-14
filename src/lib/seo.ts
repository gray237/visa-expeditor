import type { Metadata } from "next";
import { LEGAL_DRAFT_BANNER, LEGAL_PAGES } from "@/content/legal";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://visa-expeditor.vercel.app"
).replace(/\/+$/, "");

export const SITE_HOST = new URL(SITE_URL).hostname;

/** Preview hosts are kept out of search results until the real domain is live. */
export const SITE_IS_PREVIEW = SITE_HOST.includes("vercel.app");

/**
 * Every locale is served with its prefix, including the default locale.
 * `path` must start with "/" and never include the locale.
 */
export function localePath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

export function localeAlternates(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path;
  return {
    en: `${SITE_URL}/en${clean}`,
    es: `${SITE_URL}/es${clean}`,
    fr: `${SITE_URL}/fr${clean}`,
    "x-default": `${SITE_URL}/en${clean}`,
  };
}

function metadataTitle(title: string): Metadata["title"] {
  const trimmed = title.trim();
  if (trimmed.startsWith("Visa Expeditor")) return { absolute: trimmed };
  return trimmed.replace(/\s*[—–-]\s*Visa Expeditor\s*$/i, "");
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
  const isDraftLegalPage =
    LEGAL_DRAFT_BANNER && LEGAL_PAGES.some((page) => page.path === path);
  const normalizedTitle = metadataTitle(title);
  const resolvedTitle =
    typeof normalizedTitle === "string" ? normalizedTitle : title.trim();
  return {
    title: metadataTitle(title),
    description,
    alternates: {
      canonical: url,
      languages: localeAlternates(path),
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: "Visa Expeditor",
      locale,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og/${locale}`,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    ...(noindex || isDraftLegalPage || SITE_IS_PREVIEW
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
