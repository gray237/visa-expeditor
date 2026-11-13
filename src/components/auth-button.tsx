"use client";

import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/client";

export function AuthButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const t = useTranslations("auth");
  const { data: session, isPending } = authClient.useSession();

  const buttonClass = `flex h-9 items-center justify-center rounded-full bg-[#0F2444] px-6 font-body text-[13px] font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90 ${
    fullWidth ? "w-full" : ""
  }`;

  if (isPending) {
    return (
      <div
        className={`h-9 animate-pulse rounded-full bg-[#0F2444]/10 ${fullWidth ? "w-full" : "w-37.5"}`}
      />
    );
  }

  if (!session?.user) {
    return (
      <Link href="/sign-in" className={buttonClass}>
        {t("signIn")}
      </Link>
    );
  }

  const name = session.user.name || session.user.email;
  const initial = name.slice(0, 1).toUpperCase();

  async function handleSignOut() {
    await authClient.signOut();
    window.location.reload();
  }

  return (
    <div className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}>
      <Link
        href="/dashboard"
        aria-label={t("dashboard")}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B8925A] font-body text-[13px] font-bold text-[#0F2444]"
      >
        {initial}
      </Link>

      <Link href="/dashboard" className={`${buttonClass} flex-1`}>
        {t("dashboard")}
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        aria-label={t("signOut")}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0F2444]/15 text-[#0F2444] transition-colors hover:bg-[#0F2444]/5"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
