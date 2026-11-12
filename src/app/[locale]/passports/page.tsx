import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { passportsHubConfig } from "@/content/passports";
import { PageHero } from "@/components/kit/page-hero";
import { Breadcrumbs } from "@/components/kit/breadcrumbs";
import { HubGrid } from "@/components/kit/hub-grid";
import { FaqSection } from "@/components/kit/faq-section";
import { CtaBand } from "@/components/kit/cta-band";

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
  const t = await getTranslations({ locale, namespace: "passports" });
  const path = locale === "en" ? "/passports" : `/${locale}/passports`;
  const url = `${SITE_URL}${path}`;

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/passports`,
        es: `${SITE_URL}/es/passports`,
        fr: `${SITE_URL}/fr/passports`,
      },
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url,
      siteName: "Visa Expeditor",
      locale,
      type: "website",
    },
  };
}

export default async function PassportsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "passports" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.passports"), href: "/passports" },
  ];

  const gridItems = passportsHubConfig.items.map((item) => ({
    href: item.href,
    label: t(`items.${item.key}.label`),
    description: t(`items.${item.key}.description`),
  }));

  const faqs = [
    { question: t("faqs.q1"), answer: t("faqs.a1") },
    { question: t("faqs.q2"), answer: t("faqs.a2") },
    { question: t("faqs.q3"), answer: t("faqs.a3") },
    { question: t("faqs.q4"), answer: t("faqs.a4") },
    { question: t("faqs.q5"), answer: t("faqs.a5") },
  ];

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot={passportsHubConfig.slot}
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <HubGrid
        heading={t("grid.heading")}
        subhead={t("grid.subhead")}
        items={gridItems}
      />
      <FaqSection heading={t("faqs.heading")} faqs={faqs} />
      <div className="mx-auto max-w-350 px-6 pb-20">
        <CtaBand
          title={t("cta.title")}
          body={t("cta.body")}
          buttonLabel={t("cta.button")}
          buttonHref="/start"
        />
      </div>
    </div>
  );
}
