import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LogOut } from "lucide-react";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { signOutAction } from "@/lib/auth/actions";

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
    path: "/dashboard",
    title: t("dashboardTitle"),
    description: t("dashboardEmptyBody"),
    noindex: true,
  });
}

export default async function DashboardPage({
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
              {t("dashboardTitle")}
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

  const name = session.user.name || session.user.email;
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <div className="bg-[#F5F6F4] py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(15,36,68,0.35)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F2444] font-display text-xl font-semibold text-[#F5F6F4]">
                {initial}
              </span>
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
                  {t("dashboardEyebrow")}
                </p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-[#161B22]">
                  {t("welcome", { name })}
                </h1>
                <p className="mt-1 font-body text-sm text-[#161B22]/60">
                  {session.user.email}
                </p>
              </div>
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl border border-[#0F2444]/15 px-4 py-2.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5"
              >
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-6">
            <h2 className="font-display text-lg font-semibold text-[#161B22]">
              {t("dashboardEmptyTitle")}
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65">
              {t("dashboardEmptyBody")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
