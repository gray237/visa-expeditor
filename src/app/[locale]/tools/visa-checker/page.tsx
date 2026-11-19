import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Info, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import * as Flags from "country-flag-icons/react/3x2";
import { Link } from "@/i18n/navigation";
import { VisaCheckerSearch } from "@/components/visa-checker-search";
import { VisaResult, confidenceBadge, type VisaGuide } from "@/components/visa-result";
import { DataSourceAttribution } from "@/components/data-source-attribution";
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

const STAT_BLURB_CANDIDATES: Record<"visaFree" | "electronic" | "paper", string[]> = {
  visaFree: ["visa-free", "no-visa-required", "no-visa", "visa_free"],
  electronic: ["electronic", "electronic-permission", "evisa-eta", "evisa"],
  paper: ["paper", "paper-visa", "visa-required"],
};
const IMAGE_EXTS = [".webp", ".jpg", ".jpeg", ".png", ".avif", ".svg"];

function getStatBlurbImages() {
  const dir = path.join(process.cwd(), "public/images/blurbs");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return {} as Partial<Record<"visaFree" | "electronic" | "paper", string>>;
  }
  const lower = files.map((file) => ({ file, lower: file.toLowerCase() }));
  const result: Partial<Record<"visaFree" | "electronic" | "paper", string>> = {};

  (Object.keys(STAT_BLURB_CANDIDATES) as Array<keyof typeof STAT_BLURB_CANDIDATES>).forEach(
    (key) => {
      const found = lower.find(
        ({ lower: name }) =>
          STAT_BLURB_CANDIDATES[key].some((candidate) => name.startsWith(candidate)) &&
          IMAGE_EXTS.some((ext) => name.endsWith(ext)),
      );
      if (found) result[key] = `/images/blurbs/${found.file}`;
    },
  );

  if (Object.keys(result).length === 0) {
    const images = files
      .filter((file) => IMAGE_EXTS.includes(path.extname(file).toLowerCase()))
      .sort();
    if (images.length >= 3) {
      (["visaFree", "electronic", "paper"] as const).forEach((key, index) => {
        result[key] = `/images/blurbs/${images[index]}`;
      });
    }
  }

  return result;
}

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
    description: t("heroDescription"),
    noindex,
  });
}

function statusBucket(status: VisaStatus) {
  if (status === "visa_free" || status === "freedom_of_movement") return "visaFree";
  if (ELECTRONIC_STATUSES.includes(status)) return "electronic";
  if (status === "visa_required" || status === "travel_permit") return "paper";
  return "other";
}

function ListFlagWatermark({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  if (!Flag) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-32 rotate-[-12deg] opacity-[0.08] [&>svg]:h-full [&>svg]:w-full [&>svg]:object-cover dark:opacity-[0.12]"
    >
      <Flag />
    </span>
  );
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
  const guide: VisaGuide | null =
    hasGuide && destination
      ? { key: destination.key, overview: guideOverview, attractions: guideAttractions }
      : null;
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
  const showStatBlurbs = Boolean(to);
  const blurbImages = getStatBlurbImages();
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
    <div className="pb-14 sm:pb-20">
      <section className="relative isolate overflow-hidden bg-[#0F2444] px-6 pb-16 pt-16 sm:pb-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 520px at 50% -12%, rgba(184,146,90,0.24), transparent 65%), " +
              "radial-gradient(620px 420px at 6% 108%, rgba(58,90,122,0.30), transparent 60%), " +
              "radial-gradient(620px 420px at 94% 108%, rgba(58,90,122,0.30), transparent 60%), " +
              "linear-gradient(165deg, #12294c 0%, #0F2444 48%, #081729 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="checker-guilloche" x="0" y="0" width="80" height="32" patternUnits="userSpaceOnUse">
                <path d="M-20,8 Q0,-4 20,8 T60,8 T100,8" stroke="#B8925A" strokeWidth="0.6" fill="none" />
                <path d="M-20,16 Q0,4 20,16 T60,16 T100,16" stroke="#B8925A" strokeWidth="0.6" fill="none" />
                <path d="M-20,24 Q0,12 20,24 T60,24 T100,24" stroke="#B8925A" strokeWidth="0.6" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#checker-guilloche)" />
          </svg>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-[#F5F6F4]/90 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-[#B8925A]" strokeWidth={2} />
            {t("heroPill")}
          </span>
          <h1 className="hero-reveal hero-reveal-1 mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[#F5F6F4] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="hero-reveal hero-reveal-2 mt-5 max-w-2xl text-base leading-relaxed text-[#F5F6F4]/75 sm:text-lg">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-350 px-6">
        <div className="relative z-10 -mt-8 sm:-mt-10">
          <div className="hero-reveal hero-reveal-3 mx-auto max-w-5xl rounded-[28px] bg-white p-2 shadow-[0_24px_70px_-20px_rgba(15,36,68,0.28)] ring-1 ring-[#0F2444]/5 sm:p-3">
            <VisaCheckerSearch
              initialPassport={passport}
              initialDestination={destinationCode}
              initialPurpose={purpose}
            />
          </div>
        </div>

        {supportLinks.length > 0 && (
          <div className="hero-reveal hero-reveal-3 mt-6 flex flex-wrap items-center justify-center gap-2">
            {supportLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-[#0F2444]/10 bg-white px-4 py-2 text-sm text-[#161B22] shadow-sm transition-colors hover:bg-[#0F2444]/5"
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <div className="min-w-0">
            <VisaResult
              locale={locale}
              passport={passport}
              hasQuery={Boolean(to)}
              knownDestinationCode={knownDestinationCode}
              purpose={purpose}
              record={record}
              guide={guide}
            />
          </div>
          <section
            className="flex h-full w-full min-w-0 flex-col self-stretch"
            aria-labelledby="checker-stats-heading"
          >
            <h2
              id="checker-stats-heading"
              className="font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
            >
              {t("stats.heading")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/60">
              {t("stats.coverage", { covered: stats.covered, total: stats.total })}
            </p>
            <div className="mt-5 grid flex-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {(
                [
                  ["visaFree", stats.visaFree],
                  ["electronic", stats.electronic],
                  ["paper", stats.paper],
                ] as const
              ).map(([key, count], index) => {
                const bg = showStatBlurbs ? blurbImages[key] : undefined;
                return (
                  <div
                    key={key}
                    className="reveal-card relative flex flex-col overflow-hidden rounded-2xl border border-[#0F2444]/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#1a1b20]"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    {bg && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${bg})` }}
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-0 bg-white/80 dark:bg-[#1a1b20]/80"
                          aria-hidden="true"
                        />
                      </>
                    )}
                    <div className={bg ? "relative" : undefined}>
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
                  </div>
                );
              })}
            </div>
          </section>
        </div>

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
                    {group.records.map((item, index) => (
                      <li key={`${item.destination}-${item.purpose}`} className="reveal-card" style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}>
                        <Link
                          href={`/tools/visa-checker?passport=${passport}&to=${item.destination}&purpose=${item.purpose}`}
                          className="group relative block h-full overflow-hidden rounded-2xl border border-[#0F2444]/10 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#B8925A]/50 hover:shadow-md dark:border-white/10 dark:bg-[#1a1b20] dark:hover:border-[#B8925A]/50"
                        >
                          <ListFlagWatermark code={item.destination} />
                          <div className="relative">
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
                          </div>
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

        <DataSourceAttribution
          locale={locale}
          className="mt-12 border-t border-[#0F2444]/10 pt-6 dark:border-white/10"
        />
      </div>
    </div>
  );
}
