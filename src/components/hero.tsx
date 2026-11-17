"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Plane } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { PassportSelector } from "@/components/passport-selector";
import { DestinationSelector } from "@/components/destination-selector";
import { HeroFlight } from "@/components/hero-flight";
import { usePassport } from "@/components/providers/passport-provider";
import { useDestination } from "@/components/providers/destination-provider";
import { shortCountryName } from "@/lib/countries";

const EXPERT_AVATARS = [
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=68",
];

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const router = useRouter();
  const { passport, setPassport } = usePassport();
  const { destination, setDestination } = useDestination();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ passport });
    if (destination) params.set("to", destination);
    router.push(`/tools/visa-checker?${params.toString()}`);
  }

  return (
    <section
      data-flight-section
      className="relative bg-[#0F2444] pb-20 pt-24 sm:pb-28 sm:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/images/backgrounds/visa-expeditor-hero.webp"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,18,36,0.94)_0%,rgba(9,27,52,0.82)_42%,rgba(15,36,68,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,18,36,0.9)_0%,rgba(6,18,36,0.08)_45%,rgba(15,36,68,0.28)_100%)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(760px 520px at 88% 8%, rgba(184,146,90,0.24), transparent 65%)",
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-guilloche" x="0" y="0" width="80" height="32" patternUnits="userSpaceOnUse">
              <path d="M-20,8 Q0,-4 20,8 T60,8 T100,8" stroke="#B8925A" strokeWidth="0.6" fill="none" />
              <path d="M-20,16 Q0,4 20,16 T60,16 T100,16" stroke="#B8925A" strokeWidth="0.6" fill="none" />
              <path d="M-20,24 Q0,12 20,24 T60,24 T100,24" stroke="#B8925A" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-guilloche)" />
        </svg>
        <svg
          className="absolute inset-0 h-full w-full text-[#B8925A]/30 lg:text-[#B8925A]/20"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-20 600 C 70 560 110 480 80 400 C 50 320 110 250 210 270 C 310 290 370 210 330 120 C 310 70 260 40 190 50"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 12"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M20 620 C 120 560 150 470 120 390 C 95 320 160 270 250 290 C 340 310 390 230 355 145"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="2 14"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M60 600 C 150 540 180 450 150 380 C 130 330 180 300 240 315"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1 12"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-350 px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
            <div className="flex -space-x-2">
              {EXPERT_AVATARS.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-[#0F2444]"
                />
              ))}
            </div>
            <span className="font-body text-[13px] text-[#F5F6F4]/90">
              {t("badge", { country: shortCountryName(passport, locale) })}
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-[#F5F6F4] sm:text-5xl lg:text-6xl">
            {t("headline")}
          </h1>

          <p className="mt-5 max-w-lg font-body text-base text-[#F5F6F4]/70 sm:text-lg">
            {t("subhead")}
          </p>
        </div>

        <div data-flight-row className="relative z-10 mt-12 w-full max-w-3xl sm:mt-14">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-10 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(184,146,90,0.85)_12%,rgba(184,146,90,0.85)_88%,transparent)]" />
            <div
              className="absolute inset-x-4 top-0 h-px opacity-45"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(184,146,90,0.9) 0 2px, transparent 2px 10px)",
              }}
            />
            <span className="absolute -left-px top-[-3px] h-1.5 w-1.5 rounded-full border border-[#B8925A]/80 bg-[#0F2444]" />
            <span className="absolute -right-px top-[-3px] h-1.5 w-1.5 rounded-full border border-[#B8925A]/80 bg-[#0F2444]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative flex max-w-3xl flex-col gap-1.25 rounded-[26px] border border-white/70 bg-white/95 p-3 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <PassportSelector value={passport} onChange={setPassport} variant="field" />
            </div>

            <div className="hidden h-10 w-px shrink-0 self-center bg-[#0F2444]/10 sm:block" />
            <div className="h-px w-full shrink-0 bg-[#0F2444]/10 sm:hidden" />

            <div className="flex-1">
              <DestinationSelector value={destination} onChange={setDestination} />
            </div>

            <button
              type="submit"
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
            >
              {t("cta")}
              <Plane className="h-4 w-4 rotate-45" strokeWidth={1.8} aria-hidden />
            </button>
          </form>

          <HeroFlight />
        </div>
      </div>
    </section>
  );
}
