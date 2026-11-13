import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { comingSoonRouteForSlug, comingSoonSlugs } from "@/content/coming-soon";
import { ComingSoonPage } from "@/components/kit/coming-soon-page";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = comingSoonSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const route = comingSoonRouteForSlug(slug);
  if (!route) return {};
  const t = await getTranslations({ locale, namespace: "comingSoon" });
  return buildMetadata({
    locale,
    path: route.path,
    title: t(`items.${route.key}.title`),
    description: t(`items.${route.key}.description`),
    noindex: true,
  });
}

export default async function ComingSoonSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const route = comingSoonRouteForSlug(slug);
  if (!route) notFound();
  setRequestLocale(locale);
  return <ComingSoonPage locale={locale} route={route} />;
}
