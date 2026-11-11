import { useTranslations } from "next-intl";
import { PackageCheck, Search, ShieldCheck, SquareCheckBig } from "lucide-react";

const STEPS = [
  { key: "search", icon: Search },
  { key: "prepare", icon: SquareCheckBig },
  { key: "review", icon: ShieldCheck },
  { key: "deliver", icon: PackageCheck },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="py-10 sm:py-18">
      <div className="mx-auto max-w-350 px-6">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] dark:text-[#F5F6F4] sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 font-body text-[#161B22]/70 dark:text-[#F5F6F4]/70">
            {t("subheading")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className="rounded-3xl border border-[#0F2444]/10 bg-[#0F2444]/5 p-6 transition-colors dark:border-white/15 dark:bg-white/10"
              >
                <span className="font-display text-5xl font-bold text-[#B8925A]/45 dark:text-[#B8925A]/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#0F2444]/10 bg-[#0F2444]/5 text-[#B8925A] dark:border-white/15 dark:bg-white/10">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65 dark:text-[#F5F6F4]/65">
                  {t(`steps.${step.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}