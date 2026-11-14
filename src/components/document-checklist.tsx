"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardCheck, Printer } from "lucide-react";
import { PassportSelector } from "@/components/passport-selector";
import { DestinationSelector } from "@/components/destination-selector";
import { usePassport } from "@/components/providers/passport-provider";
import { findVisaRecord } from "@/data/visa";
import type { VisaStatus } from "@/data/visa/schema.mjs";

function entryTypeForStatus(status: VisaStatus): "visaFree" | "etaRequired" | null {
  if (status === "visa_free") return "visaFree";
  if (status === "eta") return "etaRequired";
  return null;
}

export function DocumentChecklist() {
  const t = useTranslations("tools.checklistPage");
  const tEntry = useTranslations("entryTypeInfo");
  const tCommon = useTranslations("common");
  const { passport, setPassport } = usePassport();
  const [destination, setDestination] = useState("");

  const record = destination
    ? findVisaRecord(passport, destination, "tourism")
    : undefined;
  const entryType = record ? entryTypeForStatus(record.status) : null;
  const documents = entryType
    ? (tEntry.raw(`${entryType}.documents`) as string[])
    : [];

  const showEmpty = !destination;
  const showPaper = Boolean(record && record.status === "visa_required");
  const showNoData = Boolean(destination && !entryType && !showPaper);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <section className="h-fit rounded-3xl border border-[#0F2444]/10 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8A6D3F]" strokeWidth={1.75} />
          <div>
            <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl">
              {t("form.heading")}
            </h2>
            <p className="mt-1 font-body text-sm text-[#161B22]/65">
              {t("form.description")}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="rounded-2xl border border-[#0F2444]/10 bg-[#F5F6F4] p-1.5">
            <PassportSelector value={passport} onChange={setPassport} variant="field" />
          </div>
          <div className="rounded-2xl border border-[#0F2444]/10 bg-[#F5F6F4] p-1.5">
            <DestinationSelector value={destination} onChange={setDestination} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          disabled={showEmpty || showNoData || showPaper}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0F2444]/20 px-5 py-3 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5 disabled:cursor-not-allowed disabled:opacity-40 print:hidden"
        >
          <Printer className="h-4 w-4" />
          {t("result.print")}
        </button>
        <p className="mt-2 text-center font-body text-xs text-[#161B22]/50 print:hidden">
          {t("result.printHint")}
        </p>
      </section>

      <section
        aria-live="polite"
        className="rounded-3xl border border-[#0F2444]/10 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl">
              {entryType ? tEntry(`${entryType}.documentsHeading`) : t("result.heading")}
            </h2>
            <p className="mt-1 font-body text-sm text-[#161B22]/65">
              {t("result.description")}
            </p>
          </div>
          <span className="rounded-full bg-[#B8925A]/10 px-3 py-1 font-body text-[11px] font-semibold text-[#72572F]">
            {tCommon("sampleData")}
          </span>
        </div>

        {showEmpty && (
          <p className="mt-6 rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-4 font-body text-sm text-[#161B22]/65">
            {t("result.empty")}
          </p>
        )}

        {showPaper && (
          <p className="mt-6 rounded-2xl border border-[#B8925A]/25 bg-[#B8925A]/5 p-4 font-body text-sm text-[#161B22]/70">
            {t("result.paper")}
          </p>
        )}

        {showNoData && (
          <p className="mt-6 rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-4 font-body text-sm text-[#161B22]/65">
            {t("result.noData")}
          </p>
        )}

        {entryType && documents.length > 0 && (
          <div className="mt-6">
            <ul className="space-y-3">
              {documents.map((document) => (
                <li
                  key={document}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[#0F2444]/10 p-4"
                >
                  <span className="font-body text-sm leading-relaxed text-[#161B22]/80">
                    {document}
                  </span>
                  <span className="shrink-0 rounded-full bg-[#B8925A]/10 px-2.5 py-1 font-body text-[10px] font-semibold text-[#72572F]">
                    {tCommon("sampleData")}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-5">
              <h3 className="font-body text-sm font-semibold text-[#161B22]">
                {tEntry(`${entryType}.explainerTitle`)}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65">
                {tEntry(`${entryType}.explainerBody`)}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
