"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, Plane } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { PassportSelector } from "@/components/passport-selector";
import { DestinationSelector } from "@/components/destination-selector";
import { usePassport } from "@/components/providers/passport-provider";
import { useDestination } from "@/components/providers/destination-provider";

export function QuickCheckerTool() {
  const router = useRouter();
  const t = useTranslations("common");
  const { passport, setPassport } = usePassport();
  const { destination, setDestination } = useDestination();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ passport });
    if (destination) params.set("to", destination);
    router.push(`/tools/visa-checker?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-[#0F2444]/15 bg-white px-1 py-0.5 shadow-[0_6px_20px_-14px_rgba(15,36,68,0.5)]"
    >
      <PassportSelector
        value={passport}
        onChange={setPassport}
        variant="pill"
        abbreviated
      />
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#B8925A]" strokeWidth={2} aria-hidden />
      <DestinationSelector
        value={destination}
        onChange={setDestination}
        variant="compact"
        abbreviated
      />
      <button
        type="submit"
        data-flight-target
        aria-label={t("search")}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F2444] text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
      >
        <Plane data-flight-plane-icon className="h-4 w-4 rotate-45" strokeWidth={1.8} aria-hidden />
      </button>
    </form>
  );
}
