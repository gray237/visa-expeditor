import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/kit/page-hero";
import { Breadcrumbs } from "@/components/kit/breadcrumbs";
import { FaqSection } from "@/components/kit/faq-section";
import { CtaBand } from "@/components/kit/cta-band";

const PATH = "/resources/faqs";

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
  const t = await getTranslations({ locale, namespace: "resources" });
  return buildMetadata({
    locale,
    path: PATH,
    title: t("faqsPage.meta.title"),
    description: t("faqsPage.meta.description"),
  });
}

export default async function ResourcesFaqsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "resources" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.resources"), href: "/resources" },
    { label: t("faqsPage.breadcrumbs.faqs"), href: PATH },
  ];

  const faqs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    question: t(`faqsPage.faqs.q${n}`),
    answer: t(`faqsPage.faqs.a${n}`),
  }));

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot="page.resources.hero"
        eyebrow={t("faqsPage.hero.eyebrow")}
        heading={t("faqsPage.hero.heading")}
        subhead={t("faqsPage.hero.subhead")}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <FaqSection heading={t("faqsPage.faqs.heading")} faqs={faqs} />
      <div className="mx-auto max-w-350 px-6 pb-20">
        <CtaBand
          title={t("faqsPage.cta.title")}
          body={t("faqsPage.cta.body")}
          buttonLabel={t("faqsPage.cta.button")}
          buttonHref="/contact"
        />
      </div>
    </div>
  );
}
