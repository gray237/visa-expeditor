import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Palette, Shield, SlidersHorizontal } from "lucide-react";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { auth, isAuthConfigured } from "@/lib/auth/server";

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
    path: "/settings",
    title: t("settingsTitle"),
    description: t("settingsDescription"),
    noindex: true,
  });
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  if (!isAuthConfigured) {
    return (
      <div className="bg-[#F5F6F4] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl border border-[#B8925A]/30 bg-white p-8">
            <h1 className="font-display text-2xl font-semibold text-[#161B22]">
              {t("settingsTitle")}
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-[#161B22]/65">
              {t("notConfigured")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data: session } = await auth.getSession();
  if (!session?.user) redirect(`/${locale}/sign-in`);

  const cards = [
    {
      icon: Shield,
      title: t("settingsAccountTitle"),
      body: t("settingsAccountBody"),
    },
    {
      icon: Palette,
      title: t("settingsPreferencesTitle"),
      body: t("settingsPreferencesBody"),
    },
  ];

  return (
    <div className="bg-[#F5F6F4] py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("settingsEyebrow")}
          </p>
          <h1 className="mt-2 flex items-center gap-3 font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">
            <SlidersHorizontal className="h-8 w-8 text-[#0F2444]/70" strokeWidth={1.5} />
            {t("settingsTitle")}
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-[#161B22]/65">
            {t("settingsDescription")}
          </p>
        </div>

        <div className="grid gap-5">
          {cards.map(({ icon: Icon, title, body }) => (
            <section
              key={title}
              className="rounded-3xl border border-[#0F2444]/10 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F2444]/5 text-[#0F2444]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#161B22]">{title}</h2>
                  <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65">{body}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
