"use client";

import { CheckCircle2, CircleAlert, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import * as Flags from "country-flag-icons/react/3x2";
import { Link } from "@/i18n/navigation";
import { fullCountryName } from "@/lib/countries";
import aggregate from "@/data/visa/destinations.aggregate.json";

const STATUS_COLORS = {
  visa_free: "text-green-600 dark:text-green-400",
  visa_on_arrival: "text-orange-600 dark:text-orange-400",
  evisa: "text-blue-600 dark:text-blue-400",
  eta: "text-light-blue-600 dark:text-light-blue-400",
  visa_required: "text-red-600 dark:text-red-400",
  freedom_of_movement: "text-emerald-600 dark:text-emerald-400",
  travel_permit: "text-violet-600 dark:text-violet-400",
  not_admitted: "text-red-600 dark:text-red-400",
  unknown: "text-gray-500 dark:text-gray-400",
};

function CountryFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-6 w-9 shrink-0 overflow-hidden rounded ring-1 ring-white/30 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover [&>svg]:h-full [&>svg]:w-full">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}