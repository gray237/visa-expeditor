"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("common");
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-wider text-[#836539]">
        Visa Expeditor
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-[#161B22]">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-4 text-base text-[#161B22]/70">{t("notFoundBody")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-[#0F2444] px-5 py-3 font-semibold text-white"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
