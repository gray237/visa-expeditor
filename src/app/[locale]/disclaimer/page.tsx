import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { legalByPath } from "@/content/legal";
import { LegalPage } from "@/components/kit/legal-page";
import { DataSourceAttribution } from "@/components/data-source-attribution";

const config = legalByPath("/disclaimer");

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
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({
    locale,
    path: config.path,
    title: t(`pages.${config.key}.title`),
    description: t(`pages.${config.key}.description`),
  });
}

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <LegalPage locale={locale} config={config} />
      <div className="bg-[#F5F6F4] pb-16">
        <div className="mx-auto max-w-350 px-6">
          <DataSourceAttribution
            locale={locale}
            className="border-t border-[#0F2444]/10 pt-6 dark:border-white/10"
          />
        </div>
      </div>
    </>
  );
}
