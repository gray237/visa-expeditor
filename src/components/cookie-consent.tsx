"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "ve_cookie_consent";
const EVENT = "ve:cookie-settings";
const CHANGE_EVENT = "ve:cookie-consent-changed";

type Consent = "all" | "essential";
type ConsentSnapshot = Consent | null | "unresolved";

function getConsentSnapshot(): Consent | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "all" || stored === "essential" ? stored : null;
}

function subscribeToConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getServerConsentSnapshot(): ConsentSnapshot {
  return "unresolved";
}

export function CookieConsent() {
  const t = useTranslations("consent");
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(EVENT, open);
    return () => window.removeEventListener(EVENT, open);
  }, []);

  const decide = (value: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setSettingsOpen(false);
  };

  if (choice === "unresolved" || (choice !== null && !settingsOpen)) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl bg-[#0F2444] p-5 text-[#F5F6F4] shadow-xl sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold">{t("title")}</p>
          <p className="mt-1 font-body text-sm text-[#F5F6F4]/75">{t("body")}</p>
          <Link
            href="/cookies"
            className="mt-2 inline-block font-body text-xs text-[#F5F6F4]/80 underline underline-offset-2"
          >
            {t("learnMore")}
          </Link>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="inline-flex items-center justify-center rounded-xl border border-[#F5F6F4]/30 px-5 py-2.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#F5F6F4]/10"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="inline-flex items-center justify-center rounded-xl bg-[#F5F6F4] px-5 py-2.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#F5F6F4]/90"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("consent");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENT))}
      className={className}
    >
      {t("settings")}
    </button>
  );
}
