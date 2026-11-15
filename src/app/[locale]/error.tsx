"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-wider text-[#836539]">
        Visa Expeditor
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-[#161B22]">
        {t("errorTitle")}
      </h1>
      <p className="mt-4 text-base text-[#161B22]/70">{t("errorBody")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#0F2444] px-5 py-3 font-semibold text-white"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-xl border border-[#0F2444]/20 px-5 py-3 font-semibold text-[#0F2444]"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
