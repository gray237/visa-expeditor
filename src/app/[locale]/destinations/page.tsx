import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import * as Flags from "country-flag-icons/react/3x2";
import aggregate from "@/data/visa/destinations.aggregate.json";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "common" });
  return buildMetadata({
    locale,
    path: "/destinations",
    title: t("destinationsTitle", { fallback: "Destinations" }),
    description: t("destinationsSubtitle", {
      fallback: "Visa and entry requirements for every country.",
    }),
  });
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" });

  const entries = Object.entries(aggregate).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold text-[#161B22]">
            {t("destinationsTitle", { fallback: "Destinations" })}
          </h1>
          <p className="mt-2 font-body text-sm text-[#161B22]/65">
            {t("destinationsSubtitle", {
              fallback: "Visa and entry requirements for every country.",
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {entries.map(([code, destination]) => {
            const Flag = Flags[code as keyof typeof Flags];
            return (
              <div
                key={code}
                className="rounded-xl border border-[#0F2444]/10 bg-white p-4 shadow-sm transition-colors hover:border-[#0F2444]/25 hover:shadow-[0_10px_30px_-10px_rgba(15,36,68,0.12)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="shrink-0">
                    {Flag ? <Flag title={code} aria-hidden /> : null}
                  </span>
                  <h3 className="font-body text-sm font-semibold text-[#161B22]">
                    {destination.name}
                  </h3>
                </div>
                <p className="font-body text-xs text-[#161B22]/55">
                  {destination.region}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#161B22]/50">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#0F2444]/15 bg-[#0F2444]/5"
                  >
                    {destination.visaFree}
                  </span>
                  <span className="font-body">
                    {t("visaFreeShort", { fallback: "visa-free" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}