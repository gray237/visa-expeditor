"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchTo(nextLocale: (typeof routing.locales)[number]) {
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`${t("changeLanguage")} ${locale.toUpperCase()}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0F2444]/15 bg-white text-[#161B22] transition-colors hover:bg-[#0F2444]/5"
      >
        <span className="font-mono text-[12px] font-semibold tracking-wide">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-[#0F2444]/10 bg-white p-1.5 shadow-xl">
          {routing.locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchTo(code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body text-sm transition-colors ${
                code === locale ? "bg-[#0F2444]/6 font-semibold text-[#0F2444]" : "text-[#161B22] hover:bg-[#0F2444]/4"
              }`}
            >
              {LOCALE_LABELS[code] ?? code}
              {code === locale && <Check className="h-4 w-4 text-[#B8925A]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}