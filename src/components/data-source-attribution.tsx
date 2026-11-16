import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

const SOURCE_URL = "https://travelrequirements.info/data/";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

const linkClass =
  "font-semibold text-[#72572F] underline underline-offset-2 dark:text-[#E2C58F]";

export async function DataSourceAttribution({
  locale,
  className = "",
}: {
  locale: string;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "attribution" });
  return (
    <section aria-labelledby="data-attribution-heading" className={className}>
      <h2
        id="data-attribution-heading"
        className="font-display text-base font-semibold text-[#161B22] dark:text-[#F5F6F4]"
      >
        {t("heading")}
      </h2>
      <p className="mt-2 font-body text-xs leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/70">
        {t.rich("body", {
          source: (chunks: ReactNode) => (
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" className={linkClass}>
              {chunks}
            </a>
          ),
          license: (chunks: ReactNode) => (
            <a href={LICENSE_URL} target="_blank" rel="noreferrer" className={linkClass}>
              {chunks}
            </a>
          ),
        })}
      </p>
    </section>
  );
}
