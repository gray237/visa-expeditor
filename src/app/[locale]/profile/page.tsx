import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Settings, User, LayoutDashboard } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
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
    path: "/profile",
    title: t("profileTitle"),
    description: t("profileDescription"),
    noindex: true,
  });
}

export default async function ProfilePage({
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
              {t("profileTitle")}
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

  const name = session.user.name || session.user.email || "";
  const email = session.user.email || "";
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <div className="bg-[#F5F6F4] py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("profileEyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">
            {t("profileTitle")}
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-[#161B22]/65">
            {t("profileDescription")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-[#0F2444]/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4 border-b border-[#0F2444]/10 pb-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F2444] font-display text-2xl font-semibold text-[#F5F6F4]">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-semibold text-[#161B22]">{name}</p>
                <p className="truncate font-body text-sm text-[#161B22]/60">{email}</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#0F2444]/10 bg-[#F5F6F4]/60 p-4">
                <dt className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#161B22]/50">
                  <User className="h-3.5 w-3.5" /> {t("profileNameLabel")}
                </dt>
                <dd className="mt-2 break-words font-body text-sm font-semibold text-[#161B22]">{name}</dd>
              </div>
              <div className="rounded-2xl border border-[#0F2444]/10 bg-[#F5F6F4]/60 p-4">
                <dt className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#161B22]/50">
                  <Mail className="h-3.5 w-3.5" /> {t("profileEmailLabel")}
                </dt>
                <dd className="mt-2 break-all font-body text-sm font-semibold text-[#161B22]">{email}</dd>
              </div>
            </dl>

            <div className="mt-6 rounded-2xl bg-[#0F2444]/[0.03] p-4">
              <p className="font-body text-sm leading-relaxed text-[#161B22]/70">{t("profileManageHint")}</p>
            </div>
          </section>

          <aside className="rounded-3xl border border-[#0F2444]/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-lg font-semibold text-[#161B22]">{t("profileActions")}</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl border border-[#0F2444]/10 px-4 py-3 font-body text-sm font-medium text-[#161B22] transition-colors hover:bg-[#0F2444]/[0.03] hover:text-[#0F2444]"
              >
                <LayoutDashboard className="h-4 w-4 text-[#0F2444]/60" /> {t("menuDashboard")}
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-xl border border-[#0F2444]/10 px-4 py-3 font-body text-sm font-medium text-[#161B22] transition-colors hover:bg-[#0F2444]/[0.03] hover:text-[#0F2444]"
              >
                <Settings className="h-4 w-4 text-[#0F2444]/60" /> {t("menuSettings")}
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-xl bg-[#0F2444] px-4 py-3 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
              >
                <Mail className="h-4 w-4" /> {t("contactSupport")}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
