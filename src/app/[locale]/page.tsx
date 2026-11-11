import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaexpeditor.com";

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
  const path = locale === "en" ? "" : `/${locale}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: meta.home.title,
    description: meta.home.description,
    alternates: {
      canonical: url,
      languages: {
        en: SITE_URL,
        es: `${SITE_URL}/es`,
        fr: `${SITE_URL}/fr`,
      },
    },
    openGraph: {
      title: meta.home.title,
      description: meta.home.description,
      url,
      siteName: meta.siteName,
      locale,
      type: "website",
      images: [
        {
          url: `${url}/og.jpg`,
          width: 1200,
          height: 630,
          alt: meta.home.ogAlt,
        },
      ],
    },
  };
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