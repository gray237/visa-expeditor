"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarCheck, CheckCircle2, CircleAlert } from "lucide-react";

type Rule = "threeMonths" | "sixMonths" | "stay";

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function addMonths(date: Date, months: number): Date {
  const day = date.getUTCDate();
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

export function PassportValidityCalculator() {
  const t = useTranslations("tools.calculator");
  const locale = useLocale();
  const [expiry, setExpiry] = useState("");
  const [departure, setDeparture] = useState("");
  const [returnValue, setReturnValue] = useState("");
  const [rule, setRule] = useState<Rule>("sixMonths");

  const hasInput = Boolean(expiry || departure || returnValue);

  const result = useMemo(() => {
    const expiryDate = parseDate(expiry);
    const departureDate = parseDate(departure);
    const returnDate = parseDate(returnValue);

    if (!expiryDate || !departureDate || !returnDate) {
      return { status: "incomplete" as const };
    }
    if (returnDate < departureDate) {
      return { status: "returnBeforeDeparture" as const };
    }

    const requiredUntil =
      rule === "stay"
        ? returnDate
        : addMonths(departureDate, rule === "threeMonths" ? 3 : 6);

    return {
      status: "complete" as const,
      meets: expiryDate.getTime() >= requiredUntil.getTime(),
      requiredUntil,
    };
  }, [expiry, departure, returnValue, rule]);

  return (
    <section
      aria-labelledby="passport-validity-heading"
      className="rounded-3xl border border-[#0F2444]/10 bg-white p-6 sm:p-8"
    >
      <div className="flex items-start gap-3">
        <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8A6D3F]" strokeWidth={1.75} />
        <div>
          <h2
            id="passport-validity-heading"
            className="font-display text-xl font-semibold text-[#161B22] sm:text-2xl"
          >
            {t("heading")}
          </h2>
          <p className="mt-1 font-body text-sm text-[#161B22]/65 sm:text-base">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/50">
            {t("expiryLabel")}
          </span>
          <input
            type="date"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
            className="rounded-xl border border-[#0F2444]/15 bg-white px-3.5 py-2.5 font-body text-sm text-[#161B22] outline-none focus:border-[#B8925A]"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/50">
            {t("departureLabel")}
          </span>
          <input
            type="date"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
            className="rounded-xl border border-[#0F2444]/15 bg-white px-3.5 py-2.5 font-body text-sm text-[#161B22] outline-none focus:border-[#B8925A]"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/50">
            {t("returnLabel")}
          </span>
          <input
            type="date"
            value={returnValue}
            onChange={(event) => setReturnValue(event.target.value)}
            className="rounded-xl border border-[#0F2444]/15 bg-white px-3.5 py-2.5 font-body text-sm text-[#161B22] outline-none focus:border-[#B8925A]"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/50">
            {t("ruleLabel")}
          </span>
          <select
            value={rule}
            onChange={(event) => setRule(event.target.value as Rule)}
            className="rounded-xl border border-[#0F2444]/15 bg-white px-3.5 py-2.5 font-body text-sm text-[#161B22] outline-none focus:border-[#B8925A]"
          >
            <option value="threeMonths">{t("rules.threeMonths")}</option>
            <option value="sixMonths">{t("rules.sixMonths")}</option>
            <option value="stay">{t("rules.stay")}</option>
          </select>
        </label>
      </div>

      <div aria-live="polite" className="mt-6">
        {result.status === "complete" ? (
          <div
            className={`rounded-2xl border p-5 ${
              result.meets
                ? "border-[#2E7D4F]/25 bg-[#2E7D4F]/5"
                : "border-[#B23B3B]/25 bg-[#B23B3B]/5"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.meets ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D4F]" strokeWidth={2} />
              ) : (
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#B23B3B]" strokeWidth={2} />
              )}
              <div>
                <p className="font-body text-sm font-semibold text-[#161B22]">
                  {result.meets ? t("result.meets") : t("result.doesNotMeet")}
                </p>
                <p className="mt-1 font-body text-sm text-[#161B22]/70">
                  {t("result.requiredUntil", {
                    date: formatDate(result.requiredUntil, locale),
                  })}
                </p>
              </div>
            </div>
          </div>
        ) : hasInput ? (
          <p className="rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-4 font-body text-sm text-[#161B22]/65">
            {result.status === "returnBeforeDeparture"
              ? t("result.returnBeforeDeparture")
              : t("result.invalidDates")}
          </p>
        ) : null}
      </div>

      <p className="mt-4 font-body text-xs leading-relaxed text-[#161B22]/55">
        {t("result.disclaimer")}
      </p>
    </section>
  );
}
