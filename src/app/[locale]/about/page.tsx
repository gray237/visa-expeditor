import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { aboutPageConfig } from "@/content/about";
import { PageHero } from "@/components/kit/page-hero";
import { Breadcrumbs } from "@/components/kit/breadcrumbs";
import { ArticleLayout } from "@/components/kit/article-layout";
import { CtaBand } from "@/components/kit/cta-band";

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
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.about"), href: "/about" },
  ];

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot={aboutPageConfig.slot}
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <ArticleLayout title={t("hero.heading")} description={t("hero.subhead")}>
        <div className="space-y-6">
          <p>{t("content.p1")}</p>
          <p>{t("content.p2")}</p>
          <p>{t("content.p3")}</p>
          <p>{t("content.p4")}</p>
        </div>
      </ArticleLayout>
      <div className="mx-auto max-w-350 px-6 pb-20">
        <CtaBand
          title={t("cta.title")}
          body={t("cta.body")}
          buttonLabel={t("cta.button")}
          buttonHref={aboutPageConfig.ctaHref}
        />
      </div>
    </div>
  );
}
