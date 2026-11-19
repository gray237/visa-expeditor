"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { LayoutDashboard, LogOut, Settings, User, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/client";

export function ProfileMenu() {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isPending) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-[#0F2444]/10" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/sign-in"
        className="flex h-9 items-center justify-center rounded-full bg-[#0F2444] px-5 font-body text-[13px] font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90"
      >
        {t("signIn")}
      </Link>
    );
  }

  const name = session.user.name || session.user.email || "";
  const initial = (name || "?").slice(0, 1).toUpperCase();
  const email = session.user.email || "";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const links = [
    { href: "/dashboard", label: t("menuDashboard"), icon: LayoutDashboard },
    { href: "/profile", label: t("menuProfile"), icon: User },
    { href: "/settings", label: t("menuSettings"), icon: Settings },
  ] as const;

  const drawer = (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={t("closeAccountMenu")}
        tabIndex={open ? 0 : -1}
        className={`absolute inset-0 bg-[#0F2444]/40 backdrop-blur-[1px] transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        id="profile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t("accountMenu")}
        className={`absolute inset-y-0 right-0 flex h-full w-full max-w-sm flex-col border-l border-[#0F2444]/10 bg-[#F5F6F4] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#0F2444]/10 bg-[#F5F6F4] px-5 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2444] font-body text-sm font-bold text-[#F5F6F4] ring-2 ring-[#B8925A]/30">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate font-body text-sm font-semibold text-[#161B22]">{name}</p>
              {email && (
                <p className="truncate font-body text-xs text-[#161B22]/60">{email}</p>
              )}
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#B8925A]">
                {t("signedInAs")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            aria-label={t("closeAccountMenu")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#161B22]/70 transition-colors hover:bg-[#0F2444]/5 hover:text-[#0F2444]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto bg-[#F5F6F4] px-3 py-4">
          <ul className="flex flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-[#161B22]/80 transition-colors hover:bg-[#0F2444]/5 hover:text-[#0F2444]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F2444]/5 text-[#0F2444]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-[#0F2444]/10 bg-[#F5F6F4] p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut || !open}
            tabIndex={open ? 0 : -1}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0F2444]/15 bg-white px-4 py-2.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </button>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openAccountMenu")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="profile-drawer"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B8925A] font-body text-[13px] font-bold text-[#0F2444] ring-offset-2 transition hover:bg-[#a8834f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2444]"
      >
        {initial}
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
