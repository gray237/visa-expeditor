"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { PassportSelector } from "@/components/passport-selector";
import { DestinationSelector } from "@/components/destination-selector";
import { shortCountryName } from "@/lib/countries";

// Placeholder avatars — swap each URL for a real, consented team photo before launch.
const EXPERT_AVATARS = [
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=68",
];

type HeroProps = {
  passportCode: string;
  onPassportChange: (code: string) => void;
};

export function Hero({ passportCode, onPassportChange }: HeroProps) {
  const t = useTranslations("hero");
  const router = useRouter();
  const [destinationCode, setDestinationCode] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ passport: passportCode, to: destinationCode });
    router.push(`/tools/visa-checker?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden bg-[#0F2444] pb-20 pt-24 sm:pb-28 sm:pt-32">
      {/* Placeholder background — swap for a real photo later, or keep as-is */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 85% -10%, rgba(184,146,90,0.22), transparent 60%), " +
            "radial-gradient(700px 500px at 5% 90%, rgba(58,90,122,0.28), transparent 60%), " +
            "linear-gradient(160deg, #12294c 0%, #0F2444 45%, #081729 100%)",
        }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="guilloche" x="0" y="0" width="80" height="32" patternUnits="userSpaceOnUse">
              <path d="M-20,8 Q0,-4 20,8 T60,8 T100,8" stroke="#B8925A" strokeWidth="0.6" fill="none" />
              <path d="M-20,16 Q0,4 20,16 T60,16 T100,16" stroke="#B8925A" strokeWidth="0.6" fill="none" />
              <path d="M-20,24 Q0,12 20,24 T60,24 T100,24" stroke="#B8925A" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guilloche)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-350 px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
            <div className="flex -space-x-2">
              {EXPERT_AVATARS.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-[#0F2444]"
                />
              ))}
            </div>
            <span className="font-(family-name:--font-body) text-[13px] text-[#F5F6F4]/90">
              {t("badge", { country: shortCountryName(passportCode) })}
            </span>
          </div>

          <h1 className="mt-6 font-(family-name:--font-display) text-4xl font-semibold leading-[1.1] text-[#F5F6F4] sm:text-5xl lg:text-6xl">
            {t("headline")}
          </h1>

          <p className="mt-5 max-w-lg font-(family-name:--font-body) text-base text-[#F5F6F4]/70 sm:text-lg">
            {t("subhead")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex max-w-3xl flex-col gap-1.25 rounded-3xl border border-white/40 bg-white/90 p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:flex-row sm:items-center"
        >
          <div className="flex-1">
            <PassportSelector value={passportCode} onChange={onPassportChange} variant="field" />
          </div>

          <div className="hidden h-10 w-px shrink-0 self-center bg-[#0F2444]/10 sm:block" />
          <div className="h-px w-full shrink-0 bg-[#0F2444]/10 sm:hidden" />

          <div className="flex-1">
            <DestinationSelector value={destinationCode} onChange={setDestinationCode} />
          </div>

          <button
            type="submit"
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-[#0F2444] px-6 py-3.5 font-(family-name:--font-body) text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}