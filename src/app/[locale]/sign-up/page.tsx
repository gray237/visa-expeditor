import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { isAuthConfigured } from "@/lib/auth/server";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "auth" });
  return buildMetadata({
    locale,
    path: "/sign-up",
    title: t("signUpTitle"),
    description: t("signUpSubtitle"),
    noindex: true,
  });
}

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  return (
    <div className="bg-[#F5F6F4] py-16 sm:py-24">
      <div className="mx-auto max-w-md px-6">
        <AuthCard
          eyebrow={t("signUpEyebrow")}
          title={t("signUpTitle")}
          subtitle={t("signUpSubtitle")}
        >
          {isAuthConfigured ? (
            <SignUpForm />
          ) : (
            <p className="rounded-xl border border-[#B8925A]/30 bg-[#B8925A]/8 px-4 py-3 font-body text-sm leading-relaxed text-[#161B22]/75">
              {t("notConfigured")}
            </p>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
