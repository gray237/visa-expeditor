import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import type { HubRouteConfig, ServiceDetailConfig } from "@/content/types";
import { ServiceDetailPage } from "@/components/kit/service-detail-page";
import { HubPage } from "@/components/kit/hub-page";

export function generateLocaleParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type RouteArgs = { params: Promise<{ locale: string }> };

export function makeServiceDetailRoute(config: ServiceDetailConfig) {
  async function generateMetadata({ params }: RouteArgs): Promise<Metadata> {
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

  async function Page({ params }: RouteArgs) {
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
      />
    );
  }

  return { generateMetadata, Page };
}

export function makeHubRoute(config: HubRouteConfig) {
  async function generateMetadata({ params }: RouteArgs): Promise<Metadata> {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) return {};
    const t = await getTranslations({ locale, namespace: config.namespace });
    return buildMetadata({
      locale,
      path: `/${config.slug}`,
      title: t("meta.title"),
      description: t("meta.description"),
    });
  }

  async function Page({ params }: RouteArgs) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);
    return <HubPage locale={locale} config={config} />;
  }

  return { generateMetadata, Page };
}
