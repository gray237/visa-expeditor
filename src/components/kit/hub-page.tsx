import { getTranslations } from "next-intl/server";
import type { HubRouteConfig } from "@/content/types";
import { PageHero } from "./page-hero";
import { Breadcrumbs } from "./breadcrumbs";
import { HubGrid } from "./hub-grid";
import { FaqSection } from "./faq-section";
import { CtaBand } from "./cta-band";

export async function HubPage({
  locale,
  config,
}: {
  locale: string;
  config: HubRouteConfig;
}) {
  const t = await getTranslations({ locale, namespace: config.namespace });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t(`breadcrumbs.${config.breadcrumbKey}`), href: `/${config.slug}` },
  ];

  const gridItems = config.items.map((item) => ({
    href: item.href,
    label: t(`items.${item.key}.label`),
    description: t(`items.${item.key}.description`),
  }));

  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    question: t(`faqs.q${n}`),
    answer: t(`faqs.a${n}`),
  }));

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot={config.slot}
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
          buttonHref={config.ctaHref}
        />
      </div>
    </div>
  );
}
