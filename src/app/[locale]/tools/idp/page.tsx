import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { generateLocaleParams } from "@/lib/page-factories";
import { PageHero } from "@/components/kit/page-hero";
import { Breadcrumbs } from "@/components/kit/breadcrumbs";

type RouteArgs = { params: Promise<{ locale: string }> };

export const generateStaticParams = generateLocaleParams;

// TODO(owner): verify issuer rules per country before launch. In the U.S.,
// the Department of State currently designates AAA and AATA as the only
// authorized IDP issuers. Never imply that Visa Expeditor issues an IDP.
const ISSUERS = [
  { labelKey: "issuerAaa", href: "https://www.aaa.com/international/idp.html" },
  { labelKey: "issuerAata", href: "https://www.aataidp.com" },
] as const;

export async function generateMetadata({ params }: RouteArgs): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "tools" });
  return buildMetadata({
    locale,
    path: "/tools/idp",
    title: t("idp.meta.title"),
    description: t("idp.meta.description"),
  });
}

export default async function IdpPage({ params }: RouteArgs) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tools" });

  const breadcrumbs = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("breadcrumbs.tools"), href: "/tools" },
    { label: t("idp.hero.heading"), href: "/tools/idp" },
  ];

  return (
    <div className="bg-[#F5F6F4]">
      <PageHero
        slot="page.tools.hero"
        eyebrow={t("idp.hero.eyebrow")}
        heading={t("idp.hero.heading")}
        subhead={t("idp.hero.subhead")}
      />
      <div className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <article className="mx-auto max-w-3xl px-6 pb-20 pt-8 sm:pt-10">
        <div className="space-y-4 font-body text-sm leading-relaxed text-[#161B22]/75 sm:text-base">
          <p>{t("idp.body.p1")}</p>
          <p>{t("idp.body.p2")}</p>
          <p>{t("idp.body.p3")}</p>
        </div>

        <section className="mt-10 rounded-3xl border border-[#0F2444]/10 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl">
            {t("idp.issuerHeading")}
          </h2>
          <p className="mt-2 font-body text-sm text-[#161B22]/70">
            {t("idp.issuerBody")}
          </p>
          <ul className="mt-4 space-y-3">
            {ISSUERS.map((issuer) => (
              <li key={issuer.href}>
                <a
                  href={issuer.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm font-semibold text-[#72572F] underline underline-offset-2"
                >
                  {t(`idp.${issuer.labelKey}`)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-body text-xs leading-relaxed text-[#161B22]/55">
            {t("idp.verifyNote")}
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-[#0F2444]/10 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl">
            {t("idp.helpHeading")}
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/70">
            {t("idp.helpBody")}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0F2444] px-6 py-3 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
          >
            {t("idp.cta")}
          </Link>
        </section>
      </article>
    </div>
  );
}
