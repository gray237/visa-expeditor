import { CheckCircle2, CircleAlert, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import * as Flags from "country-flag-icons/react/3x2";
import { Link } from "@/i18n/navigation";
import { fullCountryName } from "@/lib/countries";
import type { VisaRecord } from "@/data/visa/schema.mjs";

const STATUS_COLORS = {
  visa_free: "text-green-600 dark:text-green-400 bg-green-600/5 dark:bg-green-600/10",
  visa_on_arrival: "text-orange-600 dark:text-orange-400 bg-orange-600/5 dark:bg-orange-600/10",
  evisa: "text-blue-600 dark:text-blue-400 bg-blue-600/5 dark:bg-blue-600/10",
  eta: "text-light-blue-600 dark:text-light-blue-400 bg-light-blue-600/5 dark:bg-light-blue-600/10",
  visa_required: "text-red-600 dark:text-red-400 bg-red-600/5 dark:bg-red-600/10",
  freedom_of_movement: "text-emerald-600 dark:text-emerald-400 bg-emerald-600/5 dark:bg-emerald-600/10",
  travel_permit: "text-violet-600 dark:text-violet-400 bg-violet-600/5 dark:bg-violet-600/10",
  not_admitted: "text-red-600 dark:text-red-400 bg-red-600/5 dark:bg-red-600/10",
  unknown: "text-gray-500 dark:text-gray-400 bg-gray-500/5 dark:bg-gray-500/10",
};

function ResultFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-8 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-[#0F2444]/10 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover dark:ring-white/15">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}

export function confidenceBadge(
  record: { confidence: string; lastVerified: string | null },
  t: (key: string, values?: Record<string, string>) => string,
) {
  if (record.confidence === "verified" && record.lastVerified) {
    return t("verifiedBadge", { date: record.lastVerified });
  }
  return t("notIndependentlyVerified");
}

export type VisaGuide = {
  key: string;
  overview: string[];
  attractions: { name: string; description: string }[];
};

export async function VisaResult({
  locale,
  passport,
  hasQuery,
  knownDestinationCode,
  purpose,
  record,
  guide,
}: {
  locale: string;
  passport: string;
  hasQuery: boolean;
  knownDestinationCode: string | undefined;
  purpose: string;
  record: VisaRecord | undefined;
  guide: VisaGuide | null;
}) {
  const t = await getTranslations("visaChecker");
  const tg = await getTranslations("destinationGuides");

  return (
    <section className="mt-0 max-w-full" aria-live="polite">
      {!hasQuery ? (
        <div className="reveal-card flex h-full min-h-64 flex-col justify-center rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-7 text-center dark:border-white/10 dark:bg-white/5">
          <CircleAlert className="mx-auto h-6 w-6 text-[#8A6D3F]" strokeWidth={1.75} />
          <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
            {t("emptyHeading")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/65">
            {t("emptyBody")}
          </p>
        </div>
      ) : !knownDestinationCode ? (
        <div className="reveal-card flex h-full min-h-64 flex-col justify-center rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-7 text-center dark:border-white/10 dark:bg-white/5">
          <CircleAlert className="mx-auto h-6 w-6 text-[#8A6D3F]" strokeWidth={1.75} />
          <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
            {t("notFoundHeading")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/65">
            {t("notFoundBody")}
          </p>
        </div>
      ) : !record || record.status === "unknown" ? (
        <div className="reveal-card flex h-full min-h-64 flex-col justify-center rounded-3xl border border-[#B8925A]/30 bg-[#B8925A]/5 p-7 text-center dark:bg-[#B8925A]/10">
          <MessageCircle className="mx-auto h-6 w-6 text-[#8A6D3F]" strokeWidth={1.75} />
          <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
            {t("noDataHeading", { country: fullCountryName(passport, locale) })}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/65">
            {t("noDataBody")}
          </p>
          <Link
            href={`/start?passport=${passport}&to=${knownDestinationCode}&purpose=${purpose}`}
            className="mx-auto mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F2444] px-6 py-3.5 text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
          >
            {t("talkToSpecialist")}
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          <article className="reveal-card rounded-3xl border border-[#0F2444]/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#1a1b20]">
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
                <dd className="mt-1 flex items-center">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[record.status]}`}>
                    {t(`statuses.${record.status}`)}
                  </span>
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
              {record.visaTypeName && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                    {t("result.visaTypeLabel")}
                  </dt>
                  <dd className="mt-1 font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                    {record.visaTypeName}
                  </dd>
                </div>
              )}
              {record.notes && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                    {t("result.notesLabel")}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-[#161B22]/80 dark:text-[#F5F6F4]/70">
                    {record.notes}
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
              {record.evidenceUrl && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[#161B22]/70 dark:text-[#F5F6F4]/50">
                    {t("result.evidenceLabel")}
                  </dt>
                  <dd className="mt-1">
                    {record.evidenceRule && (
                      <p className="mb-1 text-xs leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/60">
                        {record.evidenceRule}
                      </p>
                    )}
                    <a
                      href={record.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm font-semibold text-[#72572F] underline underline-offset-2 dark:text-[#E2C58F]"
                    >
                      {t("result.viewEvidence")}
                    </a>
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

          <article className="reveal-card rounded-3xl border border-[#0F2444]/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#1a1b20]">
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

          {guide && (
            <article className="reveal-card rounded-3xl border border-[#0F2444]/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#1a1b20]">
              {guide.overview.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-[#161B22]/75 dark:text-[#F5F6F4]/75 [&:not(:first-child)]:mt-3"
                >
                  {paragraph}
                </p>
              ))}
              <h3 className="mt-6 font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {tg(`${guide.key}.attractionsHeading`)}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {guide.attractions.map((attraction, index) => (
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
  );
}
