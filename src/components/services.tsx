"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

function PassportArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
      <rect x="55" y="15" width="90" height="115" rx="8" fill="#0F2444" opacity="0.15" transform="rotate(-6 100 72)" />
      <rect x="60" y="10" width="90" height="115" rx="8" fill="#0F2444" />
      <circle cx="105" cy="55" r="18" fill="none" stroke="#B8925A" strokeWidth="2" />
      <path d="M105 47 L108 55 L105 63 L102 55 Z" fill="#B8925A" />
      <rect x="80" y="85" width="50" height="3" rx="1.5" fill="#B8925A" opacity="0.6" />
      <rect x="88" y="93" width="34" height="3" rx="1.5" fill="#B8925A" opacity="0.4" />
    </svg>
  );
}

function VisaArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
      <rect x="35" y="20" width="100" height="100" rx="6" fill="#F5F6F4" stroke="#0F2444" strokeWidth="1.5" opacity="0.9" />
      <rect x="50" y="35" width="70" height="45" rx="4" fill="#B8925A" opacity="0.85" />
      <path d="M58 45 L112 45 M58 55 L100 55 M58 65 L108 65" stroke="#0F2444" strokeWidth="1.5" opacity="0.3" />
      <path d="M140 55 L165 45 L160 60 L165 75 L140 65 Z" fill="#0F2444" />
    </svg>
  );
}

function ImmigrationArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
      <rect x="50" y="90" width="100" height="8" rx="2" fill="#0F2444" />
      <rect x="58" y="50" width="6" height="42" fill="#0F2444" />
      <rect x="74" y="50" width="6" height="42" fill="#0F2444" />
      <rect x="90" y="50" width="6" height="42" fill="#0F2444" />
      <rect x="106" y="50" width="6" height="42" fill="#0F2444" />
      <rect x="122" y="50" width="6" height="42" fill="#0F2444" />
      <rect x="138" y="50" width="6" height="42" fill="#0F2444" />
      <path d="M50 50 L100 22 L150 50 Z" fill="#0F2444" />
      <circle cx="100" cy="30" r="10" fill="#B8925A" />
      <path d="M95 30 L99 34 L106 25" stroke="#0F2444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IdpArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
      <rect x="40" y="30" width="120" height="80" rx="10" fill="#0F2444" />
      <circle cx="70" cy="70" r="18" fill="#F5F6F4" opacity="0.9" />
      <circle cx="70" cy="70" r="8" fill="#0F2444" opacity="0.3" />
      <rect x="100" y="55" width="45" height="4" rx="2" fill="#B8925A" />
      <rect x="100" y="65" width="35" height="4" rx="2" fill="#B8925A" opacity="0.7" />
      <rect x="100" y="75" width="40" height="4" rx="2" fill="#B8925A" opacity="0.5" />
    </svg>
  );
}

const SERVICES = [
  { key: "passports", href: "/passports", art: <PassportArt /> },
  { key: "visas", href: "/visas", art: <VisaArt /> },
  { key: "immigration", href: "/immigration", art: <ImmigrationArt /> },
  { key: "idp", href: "/tools/idp", art: <IdpArt /> },
];

export function Services() {
  const t = useTranslations("services");
  const tc = useTranslations("common");
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -360 : 360, behavior: "smooth" });
  }

  return (
    <section className="py-10 sm:py-18">
      <div className="mx-auto max-w-350 px-6">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
            {t("heading")}
          </h2>
          <p className="mt-3 font-body text-[#161B22]/60 dark:text-[#F5F6F4]/70">
            {t("subheading")}
          </p>
        </div>

        <div
          ref={scrollRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((service) => (
            <Link
              key={service.key}
              href={service.href}
              className="group w-75 shrink-0 snap-start rounded-3xl border border-[#0F2444]/8 bg-[radial-gradient(120%_120%_at_50%_15%,#ffffff_0%,#F5F6F4_100%)] p-6 transition-colors hover:border-[#B8925A]/40 sm:w-85 dark:border-white/8 dark:bg-[radial-gradient(120%_120%_at_50%_15%,#1c1e25_0%,#15161a_100%)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#161B22]/40 dark:text-[#F5F6F4]/40">
                {t(`items.${service.key}.tag`)}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {t(`items.${service.key}.title`)}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                {t(`items.${service.key}.description`)}
              </p>

              <div className="relative mt-5 aspect-4/3 overflow-hidden rounded-2xl bg-[#0F2444]/4 p-4 dark:bg-white/5">
                {service.art}
                <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0F2444] text-[#F5F6F4] transition-transform group-hover:scale-105">
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label={tc("scrollLeft")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0F2444]/15 text-[#161B22]/60 transition-colors hover:bg-[#0F2444]/5 dark:border-white/15 dark:text-[#F5F6F4]/60 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label={tc("scrollRight")}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#B8925A] text-[#0F2444] transition-colors hover:bg-[#B8925A]/10 dark:text-[#F5F6F4] dark:hover:bg-[#B8925A]/20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}