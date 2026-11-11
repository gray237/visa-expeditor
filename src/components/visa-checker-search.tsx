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
}: {
  initialPassport: string;
  initialDestination: string;
}) {
  const t = useTranslations("hero");
  const router = useRouter();
  const [passportCode, setPassportCode] = useState(initialPassport);
  const [destinationCode, setDestinationCode] = useState(initialDestination);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ passport: passportCode, to: destinationCode });
    router.push(`/tools/visa-checker?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[5px] rounded-3xl border border-[#0F2444]/10 bg-white p-3 shadow-lg sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <PassportSelector value={passportCode} onChange={setPassportCode} variant="field" />
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
  );
}