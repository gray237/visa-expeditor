"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Search } from "lucide-react";
import { FlagChip } from "@/components/flag-chip";
import { destinationCountries, POPULAR_DESTINATION_CODES } from "@/lib/countries";

type DestinationSelectorProps = {
  value: string;
  onChange: (code: string) => void;
  variant?: "field" | "compact";
  abbreviated?: boolean;
};

export function DestinationSelector({
  value,
  onChange,
  variant = "field",
  abbreviated = false,
}: DestinationSelectorProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const uid = useId().replace(/:/g, "");
  const dialogId = `destination-dialog-${uid}`;
  const titleId = `destination-title-${uid}`;
  const listId = `destination-options-${uid}`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const countries = destinationCountries(locale);
  const selected = countries.find((country) => country.code === value);
  const popular = countries.filter((country) => POPULAR_DESTINATION_CODES.includes(country.code));
  const filtered = query
    ? countries.filter((country) => country.name.toLowerCase().includes(query.toLowerCase()))
    : null;

  useEffect(() => {
    if (!open) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled])',
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

  function close() {
    setOpen(false);
    setQuery("");
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function choose(code: string) {
    onChange(code);
    close();
  }

  const modal = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B1B33]/70 backdrop-blur-sm" onClick={close} />

      <div
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-[#F5F6F4] shadow-2xl"
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 id={titleId} className="font-display text-xl font-semibold text-[#0F2444]">
              {t("selectDestination")}
            </h2>
            <p className="mt-1 font-body text-sm text-[#161B22]/70">
              {t("selectDestinationSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
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

        <div className="px-6 pt-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#161B22]/70"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              role="combobox"
              aria-label={t("searchDestinations")}
              aria-autocomplete="list"
              aria-expanded
              aria-controls={listId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  dialogRef.current?.querySelector<HTMLElement>('[role="option"]')?.focus();
                }
              }}
              placeholder={t("searchDestinations")}
              className="w-full rounded-xl border border-[#0F2444]/15 bg-white py-2.5 pl-10 pr-3.5 font-body text-sm outline-none focus:border-[#B8925A]"
            />
          </div>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto px-6 pb-5">
          {!filtered && (
            <p className="mb-1.5 mt-3 px-1 font-mono text-[11px] uppercase tracking-wider text-[#161B22]/70">
              {t("popular")}
            </p>
          )}
          <ul id={listId} role="listbox" aria-label={t("selectDestination")} className="space-y-1">
            {(filtered ?? popular).map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={country.code === value}
                  onClick={() => choose(country.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                    country.code === value ? "bg-[#0F2444]/6" : "hover:bg-[#0F2444]/4"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FlagChip code={country.code} />
                    <span className="font-body text-sm text-[#161B22]">{country.name}</span>
                  </span>
                  {country.code === value && (
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
          {filtered?.length === 0 && (
            <p className="px-3 py-8 text-center font-body text-sm text-[#161B22]/70">
              {t("noMatches")} {t("noMatchesHint")}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        className={
          variant === "compact"
            ? "flex h-9 items-center gap-1 rounded-full px-0.5 text-left transition-colors hover:bg-[#0F2444]/5"
            : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[#0F2444]/5"
        }
      >
        {selected ? (
          <FlagChip code={selected.code} />
        ) : (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-dashed border-[#B8925A]/70 bg-[#B8925A]/8 text-[#B8925A]">
            <Plus className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
          </span>
        )}
        {variant === "compact" ? (
          selected && (
            <span className="hidden font-body text-xs font-semibold text-[#161B22] sm:inline">
              {selected.code}
            </span>
          )
        ) : (
          <span className="flex min-w-0 flex-col">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#161B22]/70">
              {abbreviated ? t("destination") : t("myDestination")}
            </span>
            <span className="truncate font-body text-sm font-semibold text-[#161B22]">
              {abbreviated
                ? selected?.code ?? t("destination")
                : selected?.name ?? t("whereGoing")}
            </span>
          </span>
        )}
        {(variant !== "compact" || !selected) && (
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
