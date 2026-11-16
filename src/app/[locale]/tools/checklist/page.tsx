import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { generateLocaleParams } from "@/lib/page-factories";
import { visaRecordsForPassport } from "@/data/visa";
import { PageHero } from "@/components/kit/page-hero";
import { Breadcrumbs } from "@/components/kit/breadcrumbs";
import { DocumentChecklist } from "@/components/document-checklist";

type RouteArgs = { params: Promise<{ locale: string }> };

export const generateStaticParams = generateLocaleParams;

export async function generateMetadata({ params }: RouteArgs): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "tools" });
  return buildMetadata({
    locale,
    path: "/tools/checklist",
    title: t("checklistPage.meta.title"),
    description: t("checklistPage.meta.description"),
  });
}

export default async function ChecklistPage({ params }: RouteArgs) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.tools"), href: "/tools" },
    { label: t("checklistPage.hero.heading"), href: "/tools/checklist" },
  ];

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot="page.tools.hero"
        eyebrow={t("checklistPage.hero.eyebrow")}
        heading={t("checklistPage.hero.heading")}
        subhead={t("checklistPage.hero.subhead")}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="mx-auto max-w-350 px-6 pb-20 pt-8 sm:pt-10">
        <DocumentChecklist
          initialPassport="US"
          initialRecords={visaRecordsForPassport("US")}
        />
      </div>
    </div>
  );
}
