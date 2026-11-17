"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { FlagChip } from "@/components/flag-chip";
import { localizedCountries, POPULAR_COUNTRY_CODES } from "@/lib/countries";

type PassportSelectorProps = {
  value: string;
  onChange: (code: string) => void;
  variant?: "pill" | "field";
  abbreviated?: boolean;
};

export function PassportSelector({
  value,
  onChange,
  variant = "pill",
  abbreviated = false,
}: PassportSelectorProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pendingCode, setPendingCode] = useState(value);
  const [livesElsewhere, setLivesElsewhere] = useState(false);
  const [residenceCode, setResidenceCode] = useState(value);
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const countries = localizedCountries(locale);
  const selected = countries.find((c) => c.code === value) ?? countries[0];
  const pending = countries.find((c) => c.code === pendingCode) ?? selected;
  const popular = countries.filter((c) => POPULAR_COUNTRY_CODES.includes(c.code));
  const filtered = query
    ? countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : null;

  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function openModal() {
    setPendingCode(value);
    setQuery("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function confirm() {
    onChange(pendingCode);
    closeModal();
  }

  const modal = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B1B33]/70 backdrop-blur-sm" onClick={closeModal} />

      <div
        ref={dialogRef}
        id="passport-selector-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="passport-selector-title"
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-[#F5F6F4] shadow-2xl"
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 id="passport-selector-title" className="font-display text-xl font-semibold text-[#0F2444]">
              {t("selectPassport")}
            </h2>
            <p className="mt-1 font-body text-sm text-[#161B22]/70">
              {t("selectPassportSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label={t("close")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#161B22]/70 transition-colors hover:bg-[#0F2444]/5 hover:text-[#0F2444]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <svg className="mt-4 h-2 w-full shrink-0 text-[#B8925A]/40" viewBox="0 0 400 8" preserveAspectRatio="none">
          <path
            d="M0 4 Q 10 0 20 4 T 40 4 T 60 4 T 80 4 T 100 4 T 120 4 T 140 4 T 160 4 T 180 4 T 200 4 T 220 4 T 240 4 T 260 4 T 280 4 T 300 4 T 320 4 T 340 4 T 360 4 T 380 4 T 400 4"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        <div className="px-6 pt-4">
          <div className="relative">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#161B22]/70"
            >
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-label={t("searchCountry")}
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="passport-country-options"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  dialogRef.current
                    ?.querySelector<HTMLElement>('[role="option"]')
                    ?.focus();
                }
              }}
              placeholder={t("searchCountry")}
              className="w-full rounded-xl border border-[#0F2444]/15 bg-white py-2.5 pl-10 pr-3.5 font-body text-sm outline-none focus:border-[#B8925A]"
            />
          </div>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto px-6 pb-2">
          {!filtered && (
            <p className="mb-1.5 mt-3 px-1 font-mono text-[11px] uppercase tracking-wider text-[#161B22]/70">
              {t("popular")}
            </p>
          )}
          <ul
            id="passport-country-options"
            role="listbox"
            aria-label={t("selectPassport")}
          >
            {(filtered ?? popular).map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={pendingCode === country.code}
                  onClick={() => setPendingCode(country.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                    pendingCode === country.code ? "bg-[#0F2444]/6" : "hover:bg-[#0F2444]/4"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FlagChip code={country.code} />
                    <span className="font-body text-sm text-[#161B22]">
                      {country.name}
                    </span>
                  </span>
                  {pendingCode === country.code && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#B8925A]">
                      <path
                        d="M3 8.5L6.5 12L13 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {filtered && filtered.length === 0 && (
            <p className="px-3 py-8 text-center font-body text-sm text-[#161B22]/70">
              {t("noMatches")} {t("noMatchesHint")}
            </p>
          )}
        </div>

        <div className="border-t border-[#0F2444]/10 px-6 py-4">
          <label className="flex cursor-pointer items-center gap-2.5">
            <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={livesElsewhere}
                onChange={(event) => setLivesElsewhere(event.target.checked)}
                className="peer sr-only"
              />
              <span className="h-4 w-4 rounded border border-[#0F2444]/30 bg-white transition-colors peer-checked:border-[#0F2444] peer-checked:bg-[#0F2444]" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="pointer-events-none absolute text-[#F5F6F4] opacity-0 peer-checked:opacity-100"
              >
                <path
                  d="M1.5 5L4 7.5L8.5 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-body text-sm text-[#161B22]/80">
              {t("liveElsewhere", { country: pending.name })}
            </span>
          </label>

          {livesElsewhere && (
            <select
              value={residenceCode}
              onChange={(event) => setResidenceCode(event.target.value)}
              className="mt-3 w-full rounded-xl border border-[#0F2444]/15 bg-white px-3.5 py-2.5 font-body text-sm outline-none focus:border-[#B8925A]"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={confirm}
            className="mt-4 w-full rounded-xl bg-[#0F2444] py-3 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
          >
            {t("continue")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="passport-selector-dialog"
        className={
          variant === "pill"
            ? "flex h-9 w-9 items-center justify-center rounded-full px-0 text-sm transition-colors hover:bg-[#0F2444]/5 sm:w-auto sm:justify-start sm:gap-1.5 sm:px-2.5"
            : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[#0F2444]/5"
        }
      >
        <FlagChip code={selected.code} />
        {variant === "pill" ? (
          <span className="hidden font-body font-medium text-[#161B22] sm:inline">
            {abbreviated ? selected.code : selected.name}
          </span>
        ) : (
          <span className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#161B22]/70">
              {abbreviated ? t("passport") : t("myPassport")}
            </span>
            <span className="font-body text-sm font-semibold text-[#161B22]">
              {abbreviated ? selected.code : selected.name}
            </span>
          </span>
        )}
        {!(variant === "pill" && abbreviated) && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-[#161B22]/70">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open ? createPortal(modal, document.body) : null}
    </>
  );
}