"use client";

import { useLocale, useTranslations } from "next-intl";
import * as Flags from "country-flag-icons/react/3x2";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DESTINATIONS, MOST_VISITED_BY_PASSPORT, DEFAULT_FEATURED } from "@/lib/destinations";
import { fullCountryName } from "@/lib/countries";

function CardFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-6 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-white/40 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}

export function DestinationGrid({ passportCode }: { passportCode: string }) {
  const t = useTranslations("destinations");
  const locale = useLocale();
  const featuredKey = MOST_VISITED_BY_PASSPORT[passportCode] ?? DEFAULT_FEATURED;

  return (
    <section className="py-10 sm:py-18">
      <div className="mx-auto max-w-350 px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
              {t("heading")}
            </h2>
            <p className="mt-2 font-body text-[#161B22]/60 dark:text-[#F5F6F4]/70">
              {t("subheading", { country: fullCountryName(passportCode, locale) })}
            </p>
          </div>
        </div>

        <div className="grid grid-flow-row-dense grid-cols-2 auto-rows-32.5 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {DESTINATIONS.map((destination) => {
            const requirement = destination.requirements[passportCode];
            const isTall = destination.key === featuredKey;

            return (
              <Link
                key={destination.key}
                href={`/tools/visa-checker?passport=${passportCode}&to=${destination.countryCode}`}
                className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1 ${
                  isTall ? "row-span-4" : "row-span-2"
                }`}
                style={{
                  background: `linear-gradient(155deg, ${destination.accent}CC 0%, #0F2444 65%)`,
                }}
              >
                <div className="absolute left-5 top-5">
                  <CardFlag code={destination.countryCode} />
                </div>

                <h3 className="relative font-display text-xl font-semibold text-white sm:text-2xl">
                  {t(`countries.${destination.key}`)}
                </h3>

                <div className="relative mt-3 border-t border-white/15 pt-3">
                  {requirement ? (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                          {t("typeLabel")}
                        </p>
                        <p className="font-body text-[12px] font-semibold leading-tight text-white">
                          {t(`type.${requirement.type}`)}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                          {t("validLabel")}
                        </p>
                        <p className="font-body text-[12px] font-semibold leading-tight text-white">
                          {t("validDays", { days: requirement.validityDays })}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                          {t("processingLabel")}
                        </p>
                        <p className="font-body text-[12px] font-semibold leading-tight text-white">
                          {t(`processing.${requirement.processing}`)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 font-body text-[13px] font-semibold text-white">
                      {t("checkRequirements")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}