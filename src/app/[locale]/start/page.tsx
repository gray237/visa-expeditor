import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { StartApplicationForm } from "@/components/start-application-form";
import { COUNTRY_CODES } from "@/lib/countries";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

const PURPOSES = ["tourism", "business", "transit", "study", "work"] as const;

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
    path: "/start",
    title: t("title"),
    description: t("description"),
    noindex: true,
  });
}

export default async function StartPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ passport?: string; to?: string; purpose?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const query = await searchParams;
  const passport = COUNTRY_CODES.find((code) => code === query.passport?.toUpperCase());
  const destination = COUNTRY_CODES.find((code) => code === query.to?.toUpperCase()) ?? "";
  const purpose = PURPOSES.find((value) => value === query.purpose) ?? "tourism";
  const turnstileConfigured = Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim(),
  );
  const submissionReady =
    process.env.NODE_ENV !== "production" ||
    Boolean(
      process.env.DATABASE_URL?.trim() &&
        process.env.RESEND_API_KEY?.trim() &&
        process.env.TEAM_EMAIL?.trim() &&
        turnstileConfigured &&
        process.env.UPSTASH_REDIS_REST_URL?.trim() &&
        process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
    );
  const t = await getTranslations("start");

  return (
    <div className="bg-[#F5F6F4] py-12 sm:py-20 dark:bg-[#101115]">
      <div className="mx-auto max-w-4xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8A6D3F]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
            {t("title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#161B22]/65 dark:text-[#F5F6F4]/65">
            {t("description")}
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-[#0F2444]/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-[#1a1b20]">
          <StartApplicationForm
            initialDraft={{
              service: "visa",
              purpose,
              passport: passport ?? "US",
              destination,
              name: "",
              email: "",
              phone: "",
              travelStart: "",
              travelEnd: "",
              message: "",
            }}
            turnstileConfigured={turnstileConfigured}
            submissionReady={submissionReady}
          />
        </div>
      </div>
    </div>
  );
}
