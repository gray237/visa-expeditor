import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "start" });
  return buildMetadata({
    locale,
    path: "/start/confirmation",
    title: t("confirmation.title"),
    description: t("confirmation.body"),
    noindex: true,
  });
}

export default async function ApplicationConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("start");

  return (
    <div className="bg-[#F5F6F4] py-16 sm:py-24 dark:bg-[#101115]">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-8 dark:border-white/10 dark:bg-[#1a1b20]">
          <h1 className="font-display text-3xl font-semibold text-[#161B22] dark:text-[#F5F6F4]">
            {t("confirmation.title")}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#161B22]/70 dark:text-[#F5F6F4]/70">
            {t("confirmation.body")}
          </p>
          <Link
            href="/tools/visa-checker"
            className="mt-6 inline-flex rounded-xl bg-[#0F2444] px-5 py-3 text-sm font-semibold text-white"
          >
            {t("confirmation.return")}
          </Link>
        </div>
      </div>
    </div>
  );
}
