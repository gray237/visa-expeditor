"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { PassportSelector } from "@/components/passport-selector";
import { DestinationSelector } from "@/components/destination-selector";

export function VisaCheckerSearch({
  initialPassport,
  initialDestination,
  initialPurpose,
}: {
  initialPassport: string;
  initialDestination: string;
  initialPurpose: string;
}) {
  const t = useTranslations("hero");
  const checker = useTranslations("visaChecker");
  const router = useRouter();
  const [passportCode, setPassportCode] = useState(initialPassport);
  const [destinationCode, setDestinationCode] = useState(initialDestination);
  const [purpose, setPurpose] = useState(initialPurpose);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({
      passport: passportCode,
      to: destinationCode,
      purpose,
    });
    router.push(`/tools/visa-checker?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-1.25 rounded-[20px] sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <PassportSelector value={passportCode} onChange={setPassportCode} variant="field" />
      </div>

      <div className="hidden h-10 w-px shrink-0 self-center bg-[#0F2444]/10 sm:block" />
      <div className="h-px w-full shrink-0 bg-[#0F2444]/10 sm:hidden" />

      <div className="flex-1">
        <DestinationSelector value={destinationCode} onChange={setDestinationCode} />
      </div>

      <label className="flex min-w-36 flex-col gap-1 px-2 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/70">
          {checker("filters.purpose")}
        </span>
        <select
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          className="w-full bg-transparent text-sm text-[#161B22] outline-none dark:text-[#F5F6F4]"
        >
          {(["tourism", "business", "transit", "study", "work"] as const).map((value) => (
            <option key={value} value={value}>
              {checker(`purposes.${value}`)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
      >
        {t("cta")}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}