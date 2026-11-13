import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isAuthConfigured } from "@/lib/auth/server";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signInTitle"), description: t("signInSubtitle") };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ registered?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("auth");
  const { registered } = await searchParams;

  return (
    <main className="bg-[#F5F6F4] py-16 sm:py-24">
      <div className="mx-auto max-w-md px-6">
        <AuthCard
          eyebrow={t("signInEyebrow")}
          title={t("signInTitle")}
          subtitle={t("signInSubtitle")}
        >
          {isAuthConfigured ? (
            <SignInForm registered={registered === "1"} />
          ) : (
            <p className="rounded-xl border border-[#B8925A]/30 bg-[#B8925A]/8 px-4 py-3 font-body text-sm leading-relaxed text-[#161B22]/75">
              {t("notConfigured")}
            </p>
          )}
        </AuthCard>
      </div>
    </main>
  );
}
