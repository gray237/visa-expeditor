import { CheckCircle2, CircleAlert, Info, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import * as Flags from "country-flag-icons/react/3x2";
import { Link } from "@/i18n/navigation";
import { VisaCheckerSearch } from "@/components/visa-checker-search";
import { DESTINATIONS, PASSPORT_OVERVIEW_CODES, getPassportStats } from "@/lib/destinations";
import { DESTINATIONS_WITH_GUIDES } from "@/lib/destination-guides";
import { fullCountryName } from "@/lib/countries";

function ResultFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-8 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-[#0F2444]/10 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover dark:ring-white/15">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}

const OVERVIEW_SECTION_KEYS = ["howItVaries", "whatYouNeed", "howWeHelp"] as const;

export default async function VisaCheckerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ passport?: string; to?: string }>;
}) {
  const { locale } = await params;
  const { passport = "US", to = "" } = await searchParams;
  const t = await getTranslations("visaChecker");
  const td = await getTranslations("destinations");
  const te = await getTranslations("entryTypeInfo");
  const tp = await getTranslations("passportOverview");
  const tg = await getTranslations("destinationGuides");

  const destination = to ? DESTINATIONS.find((d) => d.countryCode === to.toUpperCase()) : undefined;
  const requirement = destination?.requirements[passport];
  const documents = requirement ? (te.raw(`${requirement.type}.documents`) as string[]) : [];

  const hasPassportOverview = PASSPORT_OVERVIEW_CODES.includes(passport);
  const stats = hasPassportOverview ? getPassportStats(passport) : null;

  const hasGuide = destination ? DESTINATIONS_WITH_GUIDES.includes(destination.key) : false;
  const guideOverview = hasGuide && destination ? (tg.raw(`${destination.key}.overview`) as string[]) : [];
  const guideAttractions =
    hasGuide && destination
      ? (tg.raw(`${destination.key}.attractions`) as { name: string; description: string }[])
      : [];

  return (
    <main className="py-14 sm:py-20">
      <div className="mx-auto max-w-350 px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
            {t("title")}
          </h1>
        </div>

        <div className="mt-8 max-w-3xl">
          <VisaCheckerSearch initialPassport={passport} initialDestination={to} />
        </div>

        {hasPassportOverview && stats && (
          <div className="mt-10 max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#B8925A]">
              {tp(`${passport}.eyebrow`)}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
              {tp(`${passport}.heading`)}
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="font-display text-3xl font-bold text-[#161B22] dark:text-[#F5F6F4]">
                  {stats.covered}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {tp(`${passport}.statsCovered`)}
                </p>
                <p className="mt-0.5 text-xs text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                  {tp(`${passport}.statsCoveredLabel`)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#B8925A]/25 bg-[#B8925A]/5 p-5">
                <p className="font-display text-3xl font-bold text-[#161B22] dark:text-[#F5F6F4]">
                  {stats.visaFree}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {tp(`${passport}.statsVisaFree`)}
                </p>
                <p className="mt-0.5 text-xs text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                  {tp(`${passport}.statsVisaFreeLabel`)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-5 dark:border-white/10 dark:bg-white/5">
                <p className="font-display text-3xl font-bold text-[#161B22] dark:text-[#F5F6F4]">
                  {stats.etaRequired}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {tp(`${passport}.statsEta`)}
                </p>
                <p className="mt-0.5 text-xs text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                  {tp(`${passport}.statsEtaLabel`)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 rounded-3xl border border-[#0F2444]/10 bg-white p-7 dark:border-white/10 dark:bg-[#1a1b20] sm:grid-cols-3 sm:p-8">
              {OVERVIEW_SECTION_KEYS.map((key) => (
                <div key={key}>
                  <h3 className="font-display text-base font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                    {tp(`${passport}.sections.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/70">
                    {tp(`${passport}.sections.${key}.body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 max-w-2xl">
          {!destination ? (
            <div className="rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-8 dark:border-white/10 dark:bg-white/5">
              <CircleAlert className="h-6 w-6 text-[#B8925A]" strokeWidth={1.75} />
              <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {to ? t("notFoundHeading") : t("emptyHeading")}
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65 dark:text-[#F5F6F4]/65">
                {to ? t("notFoundBody") : t("emptyBody")}
              </p>
            </div>
          ) : requirement ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-8 dark:border-white/10 dark:bg-[#1a1b20]">
                <div className="flex items-center gap-4">
                  <ResultFlag code={destination.countryCode} />
                  <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl dark:text-[#F5F6F4]">
                    {t("resultHeading", {
                      passport: fullCountryName(passport, locale),
                      destination: td(`countries.${destination.key}`),
                    })}
                  </h2>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#0F2444]/10 pt-6 dark:border-white/10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/40 dark:text-[#F5F6F4]/40">
                      {td("typeLabel")}
                    </p>
                    <p className="mt-1 font-body text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                      {td(`type.${requirement.type}`)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/40 dark:text-[#F5F6F4]/40">
                      {td("validLabel")}
                    </p>
                    <p className="mt-1 font-body text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                      {td("validDays", { days: requirement.validityDays })}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/40 dark:text-[#F5F6F4]/40">
                      {td("processingLabel")}
                    </p>
                    <p className="mt-1 font-body text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                      {td(`processing.${requirement.processing}`)}
                    </p>
                  </div>
                </div>

                <Link
                  href="/start"
                  className="mt-8 flex items-center justify-center rounded-2xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
                >
                  {t("startApplication")}
                </Link>
              </div>

              <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-8 dark:border-white/10 dark:bg-[#1a1b20]">
                <h3 className="font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {te(`${requirement.type}.documentsHeading`)}
                </h3>
                <ul className="mt-4 space-y-3">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B8925A]" strokeWidth={2} />
                      <span className="font-body text-sm text-[#161B22]/80 dark:text-[#F5F6F4]/80">
                        {doc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-8 dark:border-white/10 dark:bg-white/5">
                <Info className="h-5 w-5 text-[#B8925A]" strokeWidth={1.75} />
                <h3 className="mt-3 font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {te(`${requirement.type}.explainerTitle`)}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/70">
                  {te(`${requirement.type}.explainerBody`)}
                </p>
              </div>

              {hasGuide && (
                <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-8 dark:border-white/10 dark:bg-[#1a1b20]">
                  {guideOverview.map((para, i) => (
                    <p
                      key={i}
                      className="font-body text-sm leading-relaxed text-[#161B22]/75 dark:text-[#F5F6F4]/75 [&:not(:first-child)]:mt-3"
                    >
                      {para}
                    </p>
                  ))}

                  <h3 className="mt-6 font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                    {tg(`${destination.key}.attractionsHeading`)}
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {guideAttractions.map((attraction, i) => (
                      <div key={i} className="rounded-xl border border-[#0F2444]/10 p-3 dark:border-white/10">
                        <p className="text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                          {attraction.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                          {attraction.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#B8925A]/30 bg-[#B8925A]/5 p-8 dark:bg-[#B8925A]/10">
              <MessageCircle className="h-6 w-6 text-[#B8925A]" strokeWidth={1.75} />
              <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {t("noDataHeading", { country: fullCountryName(passport, locale) })}
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65 dark:text-[#F5F6F4]/65">
                {t("noDataBody")}
              </p>
              <Link
                href="/start"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
              >
                {t("talkToSpecialist")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}