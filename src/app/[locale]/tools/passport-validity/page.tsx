import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { generateLocaleParams } from "@/lib/page-factories";
import { detailByPath } from "@/content/services";
import { ServiceDetailPage } from "@/components/kit/service-detail-page";
import { PassportValidityCalculator } from "@/components/passport-validity-calculator";

const config = detailByPath("/tools/passport-validity");

type RouteArgs = { params: Promise<{ locale: string }> };

export const generateStaticParams = generateLocaleParams;

export async function generateMetadata({ params }: RouteArgs): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: config.namespace });
  return buildMetadata({
    locale,
    path: config.path,
    title: t(`detail.${config.key}.meta.title`),
    description: t(`detail.${config.key}.meta.description`),
  });
}

export default async function PassportValidityPage({ params }: RouteArgs) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <ServiceDetailPage
      locale={locale}
      namespace={config.namespace}
      detailKey={config.key}
      slot={config.slot}
      path={config.path}
      parentHref={config.parentHref}
      parentKey={config.parentKey}
      beforeContent={<PassportValidityCalculator />}
    />
  );
}
