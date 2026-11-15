"use client";

import { useTranslations } from "next-intl";

export function ComingSoonBadge({
  variant = "light",
  className = "",
  id,
}: {
  variant?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  const t = useTranslations("common");
  const colors =
    variant === "dark"
      ? "bg-[#B8925A]/20 text-[#F5E6CB] ring-1 ring-[#B8925A]/40"
      : "bg-[#B8925A]/10 text-[#72572F]";

  return (
    <span
      id={id}
      className={`inline-flex rounded-full px-2.5 py-1 font-body text-[11px] font-semibold ${colors} ${className}`}
    >
      {t("comingSoon")}
    </span>
  );
}
