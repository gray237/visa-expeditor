import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const POINTS = ["guidance", "review", "pricing", "tracking", "language"];

export function Comparison() {
  const t = useTranslations("comparison");

  return (
    <section className="py-10 sm:py-18">
      <div className="mx-auto max-w-350 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
            {t("heading")}
          </h2>
          <p className="mt-3 font-body text-[#161B22]/60 dark:text-[#F5F6F4]/70">
            {t("subheading")}
          </p>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          <div className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#B8925A] bg-[#0F2444] font-display text-sm font-bold text-[#F5F6F4] lg:flex">
            {t("vs")}
          </div>

          {/* With Visa Expeditor */}
          <div className="rounded-3xl border-2 border-[#B8925A]/40 bg-white p-7 sm:p-8 dark:bg-[#1a1b20]">
            <div className="flex items-center gap-3 border-b border-[#0F2444]/10 pb-5 dark:border-white/10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B8925A]">
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {t("us.title")}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#B8925A]">
                  {t("us.tagline")}
                </p>
              </div>
            </div>

            <ul className="divide-y divide-[#0F2444]/10 dark:divide-white/10">
              {POINTS.map((key) => (
                <li key={key} className="flex gap-3 py-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#B8925A]" strokeWidth={3} />
                  <div>
                    <p className="font-body text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                      {t(`points.${key}.us.title`)}
                    </p>
                    <p className="mt-0.5 font-body text-[13px] text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                      {t(`points.${key}.us.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/start"
              className="mt-6 flex items-center justify-center rounded-2xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
            >
              {t("cta")}
            </Link>
          </div>

          {/* Doing it yourself */}
          <div className="rounded-3xl border-2 border-[#9C3B3B]/25 bg-white p-7 sm:p-8 dark:bg-[#1a1b20]">
            <div className="flex items-center gap-3 border-b border-[#0F2444]/10 pb-5 dark:border-white/10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#161B22]/10 dark:bg-white/10">
                <X className="h-5 w-5 text-[#9C3B3B]" strokeWidth={3} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {t("diy.title")}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#161B22]/40 dark:text-[#F5F6F4]/40">
                  {t("diy.tagline")}
                </p>
              </div>
            </div>

            <ul className="divide-y divide-[#0F2444]/10 dark:divide-white/10">
              {POINTS.map((key) => (
                <li key={key} className="flex gap-3 py-4">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-[#9C3B3B]" strokeWidth={3} />
                  <div>
                    <p className="font-body text-sm font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                      {t(`points.${key}.diy.title`)}
                    </p>
                    <p className="mt-0.5 font-body text-[13px] text-[#161B22]/60 dark:text-[#F5F6F4]/60">
                      {t(`points.${key}.diy.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}