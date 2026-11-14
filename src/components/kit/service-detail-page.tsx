import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { ImageSlot } from "@/lib/image-slots";
import { localePath, SITE_URL } from "@/lib/seo";
import { PageHero } from "./page-hero";
import { Breadcrumbs } from "./breadcrumbs";
import { StepList } from "./step-list";
import { RequirementList } from "./requirement-list";
import { FaqSection } from "./faq-section";
import { CtaBand } from "./cta-band";

export async function ServiceDetailPage({
  locale,
  namespace,
  detailKey,
  slot,
  path,
  parentHref,
  parentKey,
  ctaHref = "/contact",
  beforeContent,
}: {
  locale: string;
  namespace: string;
  detailKey: string;
  slot: ImageSlot;
  path: string;
  parentHref: string;
  parentKey: string;
  ctaHref?: string;
  beforeContent?: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace });
  const base = `detail.${detailKey}`;
  const heading = t(`${base}.hero.heading`);
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: heading,
    description: t(`${base}.hero.subhead`),
    provider: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}${localePath(locale, path)}`,
    inLanguage: locale,
  };

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t(`breadcrumbs.${parentKey}`), href: parentHref },
    { label: heading, href: path },
  ];

  const whoFor = [1, 2, 3].map((n) => t(`${base}.whoFor.i${n}`));

  const steps = [1, 2, 3, 4].map((n) => ({
    number: n,
    title: t(`${base}.steps.s${n}.title`),
    description: t(`${base}.steps.s${n}.description`),
  }));

  const requirements = [1, 2, 3, 4].map((n) => ({
    label: t(`${base}.requirements.r${n}.label`),
    value: t(`${base}.requirements.r${n}.value`),
  }));

  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    question: t(`${base}.faqs.q${n}`),
    answer: t(`${base}.faqs.a${n}`),
  }));

  return (
    <div className="bg-[#F5F6F4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <PageHero
        slot={slot}
        eyebrow={t(`${base}.hero.eyebrow`)}
        heading={heading}
        subhead={t(`${base}.hero.subhead`)}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {beforeContent && (
        <div className="mx-auto max-w-350 px-6 pt-8 sm:pt-10">{beforeContent}</div>
      )}

      <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
        <h2 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">
          {t(`${base}.overview.heading`)}
        </h2>
        <div className="mt-6 space-y-4 font-body text-sm leading-relaxed text-[#161B22]/70 sm:text-base">
          <p>{t(`${base}.overview.p1`)}</p>
          <p>{t(`${base}.overview.p2`)}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20 max-w-350 mx-auto px-6 border-t border-[#0F2444]/10">
        <h2 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">
          {t(`${base}.whoFor.heading`)}
        </h2>
        <ul className="mt-6 space-y-3">
          {whoFor.map((item) => (
            <li key={item} className="flex items-start gap-3 font-body text-sm text-[#161B22]/70 sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8925A]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <StepList heading={t(`${base}.steps.heading`)} steps={steps} />
      <RequirementList heading={t(`${base}.requirements.heading`)} items={requirements} />
      <FaqSection heading={t(`${base}.faqs.heading`)} faqs={faqs} />

      <div className="mx-auto max-w-350 px-6 pb-20">
        <CtaBand
          title={t(`${base}.cta.title`)}
          body={t(`${base}.cta.body`)}
          buttonLabel={t(`${base}.cta.button`)}
          buttonHref={ctaHref}
        />
      </div>
    </div>
  );
}
