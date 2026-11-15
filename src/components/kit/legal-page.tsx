import { getTranslations } from "next-intl/server";
import { LEGAL_DRAFT_BANNER, type LegalPageConfig } from "@/content/legal";
import { PageHero } from "./page-hero";
import { Breadcrumbs } from "./breadcrumbs";

export async function LegalPage({
  locale,
  config,
}: {
  locale: string;
  config: LegalPageConfig;
}) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const base = `pages.${config.key}`;
  const title = t(`${base}.title`);
  const description = t(`${base}.description`);
  const sections = [1, 2, 3, 4, 5, 6].map((n) => ({
    heading: t(`${base}.sections.s${n}.heading`),
    body: t(`${base}.sections.s${n}.body`),
  }));

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: title, href: config.path },
  ];

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot="page.about.hero"
        eyebrow={t("eyebrow")}
        heading={title}
        subhead={description}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {LEGAL_DRAFT_BANNER && (
        <div className="mx-auto max-w-350 px-6 pt-6">
          <p className="rounded-xl border border-[#B8925A]/40 bg-[#B8925A]/10 px-4 py-3 font-body text-sm text-[#836539]">
            {t("draftBanner")}
          </p>
        </div>
      )}

      <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#161B22]/70 sm:text-base">
                {section.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-[#0F2444]/10 pt-6 font-body text-sm text-[#161B22]/60">
          {t("footerNote")}
        </p>
      </section>
    </div>
  );
}
