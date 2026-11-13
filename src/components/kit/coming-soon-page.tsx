import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { ComingSoonRoute } from "@/content/coming-soon";
import { PageHero } from "./page-hero";
import { Breadcrumbs } from "./breadcrumbs";

export async function ComingSoonPage({
  locale,
  route,
}: {
  locale: string;
  route: ComingSoonRoute;
}) {
  const t = await getTranslations({ locale, namespace: "comingSoon" });
  const title = t(`items.${route.key}.title`);

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: title, href: route.path },
  ];

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot={route.slot}
        eyebrow={t("eyebrow")}
        heading={title}
        subhead={t(`items.${route.key}.description`)}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
        <div className="rounded-3xl border border-[#0F2444]/10 p-8 sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-[#161B22] sm:text-3xl">
            {t("bodyHeading")}
          </h2>
          <p className="mt-3 max-w-2xl font-body text-sm text-[#161B22]/70 sm:text-base">
            {t("body")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
            >
              {t("cta")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-[#0F2444]/20 px-6 py-3.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5"
            >
              {t("backHome")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
