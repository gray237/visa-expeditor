import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { auth, isAuthConfigured } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/isAdmin";
import { signOutAction } from "@/lib/auth/actions";
import aggregate from "@/data/visa/destinations.aggregate.json";
import { Globe, LogOut, Mail, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "admin" });
  return buildMetadata({
    locale,
    path: "/admin",
    title: t("title"),
    description: t("adminDescription", {
      fallback: "Admin Studio — Visa Expeditor administrator dashboard.",
    }),
    noindex: true,
  });
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "admin" });

  if (!isAuthConfigured) {
    return (
      <div className="bg-[#F5F6F4] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl border border-[#B8925A]/30 bg-[#B8925A]/8 p-8">
            <h1 className="font-display text-2xl font-semibold text-[#161B22]">
              {t("title")}
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
  const email = session?.user?.email ?? null;
  const admin = isAdminEmail(email);

  if (!email) {
    redirect(`/${locale}/sign-in`);
  }

  if (!admin) {
    return (
      <div className="bg-[#F5F6F4] py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-[#B42318]" aria-hidden />
              <h2 className="font-display text-xl font-semibold text-[#161B22]">
                {t("notAdmin")}
              </h2>
            </div>
            <p className="font-body text-sm leading-relaxed text-[#161B22]/65">
              {t("notAdminBody")}
            </p>
            <p className="mt-4 font-body text-sm text-[#161B22]/60">
              {t("signedInAs")}: {email}
            </p>
            <form action={signOutAction}>
              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#0F2444]/15 px-4 py-2.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5"
              >
                <LogOut className="h-4 w-4" /> {t("signOut")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  const destinationCount = Object.keys(aggregate).length;

  return (
    <div className="bg-[#F5F6F4] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-[#161B22]">
              {t("title")}
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#0F2444]/10 bg-[#0F2444]/3 px-4 py-2.5 text-xs font-body text-[#0F2444]">
            <Users className="h-4 w-4 mr-1.5" aria-hidden />
            {t("role")}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-[#0F2444]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-xs font-semibold text-[#161B22]/50">
                {t("passports")}
              </span>
              <Globe className="h-5 w-5 text-[#161B22]/20" aria-hidden />
            </div>
            <p className="font-display text-2xl font-semibold text-[#161B22]">
              {t("passportsCount", { count: 199 })}
            </p>
          </div>
          <div className="rounded-2xl border border-[#0F2444]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-xs font-semibold text-[#161B22]/50">
                {t("destinations")}
              </span>
              <Mail className="h-5 w-5 text-[#161B22]/20" aria-hidden />
            </div>
            <p className="font-display text-2xl font-semibold text-[#161B22]">
              {t("destinationsCount", { count: destinationCount })}
            </p>
          </div>
          <div className="rounded-2xl border border-[#0F2444]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-xs font-semibold text-[#161B22]/50">
                {t("signedInAs")}
              </span>
              <Mail className="h-5 w-5 text-[#161B22]/20" aria-hidden />
            </div>
            <p className="font-body text-sm font-semibold text-[#161B22] truncate">
              {email}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#0F2444]/10 bg-white p-8 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[#161B22] mb-6">
            {t("quickLinks")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href={`/${locale}/dashboard`}
              className="flex items-center gap-3 rounded-xl border border-[#0F2444]/15 px-5 py-4 font-body text-sm text-[#161B22] hover:bg-[#0F2444]/3 hover:text-[#0F2444] transition-colors"
            >
              <Users className="h-5 w-5 text-[#0F2444]/30" aria-hidden />
              <span>{t("goDashboard")}</span>
            </a>
            <a
              href={`/${locale}/destinations`}
              className="flex items-center gap-3 rounded-xl border border-[#0F2444]/15 px-5 py-4 font-body text-sm text-[#161B22] hover:bg-[#0F2444]/3 hover:text-[#0F2444] transition-colors"
            >
              <Globe className="h-5 w-5 text-[#0F2444]/30" aria-hidden />
              <span>{t("viewDestinations")}</span>
            </a>
            <form
              action={signOutAction}
              className="flex items-center gap-3 rounded-xl border border-[#0F2444]/15 px-5 py-4 font-body text-sm text-[#0F2444] hover:bg-[#0F2444]/3 transition-colors"
            >
              <button
                type="submit"
                className="flex items-center gap-2 font-body text-sm font-semibold text-[#0F2444] hover:underline cursor-pointer"
              >
                <LogOut className="h-5 w-5" aria-hidden />
                {t("signOut")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
