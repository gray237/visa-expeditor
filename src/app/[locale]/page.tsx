import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/hero";
import { DestinationGrid } from "@/components/destination-grid";
import { Services } from "@/components/services";
import { ImmigrationShowcase } from "@/components/immigration-showcase";
import { HowItWorks } from "@/components/how-it-works";
import { Comparison } from "@/components/comparison";
import { CtaCarousel } from "@/components/cta-carousel";

import enMeta from "../../../messages/en/meta.json";
import esMeta from "../../../messages/es/meta.json";
import frMeta from "../../../messages/fr/meta.json";

type Meta = typeof enMeta;
const META_BY_LOCALE: Record<string, Meta> = { en: enMeta, es: esMeta, fr: frMeta };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const meta = META_BY_LOCALE[locale] ?? META_BY_LOCALE.en;
  return buildMetadata({
    locale,
    path: "/",
    title: meta.home.title,
    description: meta.home.description,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <DestinationGrid />
      <Services />
      <ImmigrationShowcase />
      <HowItWorks />
      <Comparison />
      <CtaCarousel />
    </>
  );
}