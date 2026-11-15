import type { Metadata } from "next";
import { CheckCircle2, CircleAlert, Info, Mail, MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import * as Flags from "country-flag-icons/react/3x2";
import { Link } from "@/i18n/navigation";
import { VisaCheckerSearch } from "@/components/visa-checker-search";
import { DESTINATIONS, PASSPORT_OVERVIEW_CODES } from "@/lib/destinations";
import { DESTINATIONS_WITH_GUIDES } from "@/lib/destination-guides";
import {
  DESTINATION_CODES,
  destinationCountries,
  fullCountryName,
} from "@/lib/countries";
import {
  findVisaRecord,
  getVisaStats,
  visaRecordsForPassport,
} from "@/data/visa/full";
import type { VisaStatus } from "@/data/visa/schema.mjs";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

const PURPOSES = ["tourism", "business", "transit", "study", "work"] as const;
const OVERVIEW_SECTION_KEYS = ["howItVaries", "whatYouNeed", "howWeHelp"] as const;
const ELECTRONIC_STATUSES: VisaStatus[] = ["evisa", "eta", "visa_on_arrival"];

function resolveDestinationCode(value: string, locale: string) {
  const code = value.trim().toUpperCase();
  return (
    DESTINATION_CODES.find((countryCode) => countryCode === code) ??
    destinationCountries(locale).find(
      (country) => country.name.toLocaleLowerCase(locale) === value.trim().toLocaleLowerCase(locale),
    )?.code ??
    code
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ passport?: string; to?: string; purpose?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const query = await searchParams;
  const passport = (query.passport ?? "US").toUpperCase();
  const destinationCode = resolveDestinationCode(query.to ?? "", locale);
  const purpose = PURPOSES.find((value) => value === query.purpose) ?? "tourism";
  const noindex = Boolean(
    query.to && !findVisaRecord(passport, destinationCode, purpose),
  );
  const t = await getTranslations({ locale, namespace: "visaChecker" });
  return buildMetadata({
    locale,
    path: "/tools/visa-checker",
    title: t("title"),
    description: t("emptyBody"),
    noindex,
  });
}

function ResultFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-8 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-[#0F2444]/10 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover dark:ring-white/15">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}

function statusBucket(status: VisaStatus) {
  if (status === "visa_free" || status === "freedom_of_movement") return "visaFree";
  if (ELECTRONIC_STATUSES.includes(status)) return "electronic";
  if (status === "visa_required" || status === "travel_permit") return "paper";
  return "other";
}

function confidenceBadge(
  record: { confidence: string; lastVerified: string | null },
  t: (key: string, values?: Record<string, string>) => string,
) {
  if (record.confidence === "verified" && record.lastVerified) {
    return t("verifiedBadge", { date: record.lastVerified });
  }
  return t("notIndependentlyVerified");
}

export default async function VisaCheckerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ passport?: string; to?: string; purpose?: string }>;
}) {
  const { locale } = await params;
  const {
    passport: requestedPassport = "US",
    to = "",
    purpose: requestedPurpose = "tourism",
  } = await searchParams;
  const passport = requestedPassport.toUpperCase();
  const purpose = PURPOSES.find((value) => value === requestedPurpose) ?? "tourism";
  const destinationCode = resolveDestinationCode(to, locale);
  const knownDestinationCode = DESTINATION_CODES.find(
    (code) => code === destinationCode,
  );
  const destination = DESTINATIONS.find((item) => item.countryCode === destinationCode);
  const record =
    knownDestinationCode && passport.length === 2
      ? findVisaRecord(passport, knownDestinationCode, purpose)
      : undefined;
  const records = visaRecordsForPassport(passport);
  const stats = getVisaStats(passport);
  const hasPassportOverview = PASSPORT_OVERVIEW_CODES.includes(passport);
  const hasGuide = destination ? DESTINATIONS_WITH_GUIDES.includes(destination.key) : false;
  const t = await getTranslations("visaChecker");
  const tp = await getTranslations("passportOverview");
  const tg = await getTranslations("destinationGuides");

  const guideOverview =
    hasGuide && destination ? (tg.raw(`${destination.key}.overview`) as string[]) : [];
  const guideAttractions =
    hasGuide && destination
      ? (tg.raw(`${destination.key}.attractions`) as { name: string; description: string }[])
      : [];
  const groups = (["visaFree", "electronic", "paper", "other"] as const)
    .map((key) => ({
      key,
      records: records
        .filter((item) => statusBucket(item.status) === key)
        .sort((a, b) =>
          fullCountryName(a.destination, locale).localeCompare(
            fullCountryName(b.destination, locale),
            locale,
          ),
        ),
    }))
    .filter((group) => group.records.length > 0);
  const hasSample = records.some((record) => record.confidence === "sample");
  const hasImported = records.some((record) => record.confidence === "imported");
  const hasVerified = records.some((record) => record.confidence === "verified");
  const dataNotice = hasSample
    ? t("sampleNotice")
    : hasImported
      ? t("importedNotice")
      : hasVerified
        ? t("verifiedNotice")
        : t("sampleNotice");

  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER?.trim();
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const supportLinks = [
    ...(email
      ? [{ label: t("support.email"), href: `mailto:${email}`, icon: <Mail className="h-4 w-4" /> }]
      : []),
    ...(phone
      ? [{ label: t("support.phone"), href: `tel:${phone}`, icon: <Phone className="h-4 w-4" /> }]
      : []),
    ...(whatsapp
      ? [
          {
            label: t("support.whatsapp"),
            href: `https://wa.me/${whatsapp}`,
            icon: <MessageCircle className="h-4 w-4" />,
          },
        ]
      : []),
  ];

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-350 px-6">
        <nav
          aria-label={t("breadcrumbs.label")}
          className="flex items-center gap-2 font-body text-sm text-[#161B22]/70 dark:text-[#F5F6F4]/55"
        >
          <Link href="/tools" className="underline-offset-4 hover:underline">
            {t("breadcrumbs.tools")}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t("breadcrumbs.checker")}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#836539]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
              {t("title")}
            </h1>
          </div>
          {supportLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {supportLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0F2444]/10 px-4 py-2 text-sm text-[#161B22] transition-colors hover:bg-[#0F2444]/5 dark:border-white/15 dark:text-[#F5F6F4] dark:hover:bg-white/10"
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7 max-w-5xl">
          <VisaCheckerSearch
            initialPassport={passport}
            initialDestination={destinationCode}
            initialPurpose={purpose}
          />
        </div>

        <section className="mt-10" aria-labelledby="checker-stats-heading">
          <h2
            id="checker-stats-heading"
            className="font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
          >
            {t("stats.heading")}
          </h2>
          <p className="mt-1 text-sm text-[#161B22]/70 dark:text-[#F5F6F4]/60">
            {t("stats.coverage", { covered: stats.covered, total: stats.total })}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(
              [
                ["visaFree", stats.visaFree],
                ["electronic", stats.electronic],
                ["paper", stats.paper],
              ] as const
            ).map(([key, count]) => (
              <div
                key={key}
                className="rounded-2xl border border-[#0F2444]/10 bg-white p-5 dark:border-white/10 dark:bg-[#1a1b20]"
              >
                <p className="font-display text-3xl font-bold text-[#161B22] dark:text-[#F5F6F4]">
                  {count}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {t(`stats.${key}`)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/60">
                  {t(`stats.${key}Description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="visa-list-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="visa-list-heading"
                className="font-display text-2xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
              >
                {t("list.heading")}
              </h2>
              <p className="mt-1 text-sm text-[#161B22]/70 dark:text-[#F5F6F4]/60">
                {t("list.description")}
              </p>
            </div>
            <span className="rounded-full bg-[#B8925A]/10 px-3 py-1 text-xs font-semibold text-[#72572F] dark:text-[#E2C58F]">
              {t("datasetBadge")}
            </span>
          </div>

          {groups.length > 0 ? (
            <div className="mt-6 space-y-7">
              {groups.map((group) => (
                <section key={group.key} aria-labelledby={`bucket-${group.key}`}>
                  <h3
                    id={`bucket-${group.key}`}
                    className="font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]"
                  >
                    {t(`buckets.${group.key}`)}
                  </h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.records.map((item) => (
                      <li key={`${item.destination}-${item.purpose}`}>
                        <Link
                          href={`/tools/visa-checker?passport=${passport}&to=${item.destination}&purpose=${item.purpose}`}
                          className="block h-full rounded-2xl border border-[#0F2444]/10 bg-white p-4 transition-colors hover:border-[#B8925A]/50 dark:border-white/10 dark:bg-[#1a1b20] dark:hover:border-[#B8925A]/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                              {fullCountryName(item.destination, locale)}
                            </span>
                            <span className="rounded-full bg-[#0F2444]/5 px-2.5 py-1 text-xs text-[#161B22]/75 dark:bg-white/10 dark:text-[#F5F6F4]/75">
                              {t(`statuses.${item.status}`)}
                            </span>
                          </div>
                          {item.maxStayDays !== null && (
                            <p className="mt-2 text-xs text-[#161B22]/70 dark:text-[#F5F6F4]/60">
                              {t("maximumStay", { days: item.maxStayDays })}
                            </p>
                          )}
                          <span className="mt-3 inline-block rounded-full bg-[#B8925A]/10 px-2.5 py-1 text-[11px] font-semibold text-[#72572F] dark:text-[#E2C58F]">
                            {confidenceBadge(item, t)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-[#0F2444]/10 p-5 text-sm text-[#161B22]/70 dark:border-white/10 dark:text-[#F5F6F4]/65">
              {t("list.noEntries")}
            </p>
          )}
        </section>

        <div className="mt-8 rounded-2xl border border-[#B8925A]/25 bg-[#B8925A]/5 p-5 dark:bg-[#B8925A]/10">
          <Info className="h-5 w-5 text-[#8A6D3F]" strokeWidth={1.75} />
          <p className="mt-2 text-sm leading-relaxed text-[#161B22]/75 dark:text-[#F5F6F4]/75">
            {dataNotice}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/60">
            {t("disclaimer")}
          </p>
          {hasImported && (
            <p className="mt-2 text-xs leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/60">
              {t("attribution")}{" "}
              <a
                href="https://travelrequirements.info/data/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                travelrequirements.info/data
              </a>
            </p>
          )}
        </div>

        {hasPassportOverview && (
          <section className="mt-10" aria-labelledby="travel-guide-heading">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#836539]">
              {tp(`${passport}.eyebrow`)}
            </p>
            <h2
              id="travel-guide-heading"
              className="mt-2 font-display text-2xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
            >
              {t("travelGuideHeading", {
                passport: fullCountryName(passport, locale),
              })}
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {OVERVIEW_SECTION_KEYS.map((key) => (
                <article
                  key={key}
                  className="rounded-2xl border border-[#0F2444]/10 bg-white p-5 dark:border-white/10 dark:bg-[#1a1b20]"
                >
                  <h3 className="font-display text-base font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                    {tp(`${passport}.sections.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/70">
                    {tp(`${passport}.sections.${key}.body`)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 max-w-3xl" aria-live="polite">
          {!to ? (
            <div className="rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-7 dark:border-white/10 dark:bg-white/5">
              <CircleAlert className="h-6 w-6 text-[#8A6D3F]" strokeWidth={1.75} />
              <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {t("emptyHeading")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/65">
                {t("emptyBody")}
              </p>
            </div>
          ) : !knownDestinationCode ? (
            <div className="rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-7 dark:border-white/10 dark:bg-white/5">
              <CircleAlert className="h-6 w-6 text-[#8A6D3F]" strokeWidth={1.75} />
              <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {t("notFoundHeading")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/65">
                {t("notFoundBody")}
              </p>
            </div>
          ) : !record || record.status === "unknown" ? (
            <div className="rounded-3xl border border-[#B8925A]/30 bg-[#B8925A]/5 p-7 dark:bg-[#B8925A]/10">
              <MessageCircle className="h-6 w-6 text-[#8A6D3F]" strokeWidth={1.75} />
              <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {t("noDataHeading", {
                  country: fullCountryName(passport, locale),
                })}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/65">
                {t("noDataBody")}
              </p>
              <Link
                href={`/start?passport=${passport}&to=${knownDestinationCode}&purpose=${purpose}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F2444] px-6 py-3.5 text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
              >
                {t("talkToSpecialist")}
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <article className="rounded-3xl border border-[#0F2444]/10 bg-white p-7 dark:border-white/10 dark:bg-[#1a1b20]">
                <div className="flex items-start gap-4">
                  <ResultFlag code={knownDestinationCode} />
                  <div>
                    <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl dark:text-[#F5F6F4]">
                      {t("resultHeading", {
                        purpose: t(`purposes.${purpose}`),
                        passport: fullCountryName(passport, locale),
                        destination: fullCountryName(knownDestinationCode, locale),
                      })}
                    </h2>
                    <span className="mt-3 inline-block rounded-full bg-[#B8925A]/10 px-3 py-1 text-xs font-semibold text-[#72572F] dark:text-[#E2C58F]">
                      {confidenceBadge(record, t)}
                    </span>
                  </div>
                </div>

                <dl className="mt-6 grid gap-4 border-t border-[#0F2444]/10 pt-5 sm:grid-cols-2 dark:border-white/10">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                      {t("result.statusLabel")}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                      {t(`statuses.${record.status}`)}
                    </dd>
                  </div>
                  {record.maxStayDays !== null && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                        {t("result.maximumStayLabel")}
                      </dt>
                      <dd className="mt-1 font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                        {t("maximumStay", { days: record.maxStayDays })}
                      </dd>
                    </div>
                  )}
                  {record.govFee && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                        {t("result.feeLabel")}
                      </dt>
                      <dd className="mt-1 font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                        {new Intl.NumberFormat(locale, {
                          style: "currency",
                          currency: record.govFee.currency,
                          maximumFractionDigits: 2,
                        }).format(record.govFee.amount)}
                      </dd>
                    </div>
                  )}
                  {(record.lastVerified || record.sourceVerifiedOn) && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                        {t("result.lastVerifiedLabel")}
                      </dt>
                      <dd className="mt-1 font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                        {record.lastVerified ?? record.sourceVerifiedOn}
                      </dd>
                    </div>
                  )}
                  {record.sourceUrl && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                        {t("result.sourceLabel")}
                      </dt>
                      <dd className="mt-1">
                        {record.sourceName && (
                          <p className="mb-1 text-xs leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/60">
                            {record.sourceName}
                          </p>
                        )}
                        <a
                          href={record.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-sm font-semibold text-[#72572F] underline underline-offset-2 dark:text-[#E2C58F]"
                        >
                          {t("result.officialSource")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                {record.status === "not_admitted" && (
                  <p className="mt-6 rounded-2xl border border-[#B23B3B]/25 bg-[#B23B3B]/5 p-4 text-sm leading-relaxed text-[#161B22]/75 dark:text-[#F5F6F4]/75">
                    {t("notAdmittedNotice")}
                  </p>
                )}

                {record.status !== "not_admitted" && (
                  <Link
                    href={`/start?passport=${passport}&to=${knownDestinationCode}&purpose=${purpose}`}
                    className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-[#0F2444] px-6 py-3.5 text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
                  >
                    {t("startApplication")}
                  </Link>
                )}
              </article>

              <article className="rounded-3xl border border-[#0F2444]/10 bg-white p-7 dark:border-white/10 dark:bg-[#1a1b20]">
                <h3 className="font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {t("checklist.heading")}
                </h3>
                <ul className="mt-4 space-y-3">
                  {(["passport", "purpose", "officialSource"] as const).map((key) => (
                    <li key={key} className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#8A6D3F]"
                        strokeWidth={2}
                      />
                      <span className="text-sm text-[#161B22]/80 dark:text-[#F5F6F4]/80">
                        {t(`checklist.${key}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>

              {hasGuide && destination && (
                <article className="rounded-3xl border border-[#0F2444]/10 bg-white p-7 dark:border-white/10 dark:bg-[#1a1b20]">
                  {guideOverview.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-relaxed text-[#161B22]/75 dark:text-[#F5F6F4]/75 [&:not(:first-child)]:mt-3"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <h3 className="mt-6 font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                    {tg(`${destination.key}.attractionsHeading`)}
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {guideAttractions.map((attraction, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#0F2444]/10 p-3 dark:border-white/10"
                      >
                        <p className="text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                          {attraction.name}
                        </p>
                        <p className="mt-1 text-xs text-[#161B22]/70 dark:text-[#F5F6F4]/60">
                          {attraction.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
