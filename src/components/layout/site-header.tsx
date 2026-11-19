"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import { QuickCheckerTool } from "@/components/layout/quick-checker-tool";
import { MegaMenuTrigger } from "@/components/mega-menu";
import { ProfileMenu } from "@/components/profile-menu";
import { LanguageSelector } from "@/components/language-selector";
import { NAV_ITEMS } from "@/lib/nav";
import { ComingSoonBadge } from "@/components/coming-soon-badge";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations();
  const tc = useTranslations("common");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#0F2444]/10 bg-[#F5F6F4]/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-20 max-w-350 items-center justify-between px-1 sm:px-6">
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#0F2444]/5 lg:hidden"
              aria-label={tc("openMenu")}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <div className="flex flex-col gap-1.5">
                <span className="h-[3px] w-6 rounded-full bg-[#0F2444]" />
                <span className="h-[3px] w-6 rounded-full bg-[#0F2444]" />
                <span className="h-[3px] w-6 rounded-full bg-[#0F2444]" />
              </div>
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <MegaMenuTrigger key={item.href} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <QuickCheckerTool />
            <LanguageSelector />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label={tc("closeMenu")}
          tabIndex={menuOpen ? 0 : -1}
          className={`absolute inset-0 bg-[#0F2444]/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={tc("openMenu")}
          className={`absolute inset-y-0 left-0 flex w-full max-w-sm flex-col border-r border-[#0F2444]/10 bg-[#F5F6F4] shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#0F2444]/10 px-4 py-4 sm:px-6">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={tc("closeMenu")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#161B22]/70 transition-colors hover:bg-[#0F2444]/5 hover:text-[#0F2444]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3 sm:px-4" aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const isExpanded = expandedMobile === item.href;
              return (
                <div key={item.href} className="border-b border-[#0F2444]/5 last:border-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className="flex-1 px-2 py-3 font-body text-[15px] font-medium text-[#161B22]/85"
                    >
                      {t(`nav.${item.key}.label`)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedMobile(isExpanded ? null : item.href)}
                      aria-label={isExpanded ? tc("collapse") : tc("expand")}
                      aria-expanded={isExpanded}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#161B22]/50 hover:bg-[#0F2444]/5"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-1 pb-3">
                      {item.items.map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#0F2444]/5"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F2444]/6 text-[#0F2444]">
                              <Icon className="h-4 w-4" strokeWidth={1.75} />
                            </span>
                            <span className="flex flex-wrap items-center gap-2 font-body text-sm text-[#161B22]">
                              {t(`nav.${item.key}.items.${sub.key}.label`)}
                              {sub.soon && <ComingSoonBadge />}
                            </span>
                          </Link>
                        );
                      })}

                      {item.viewAllHref && (
                        <Link
                          href={item.viewAllHref}
                          className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#0F2444]/10 py-2.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5"
                        >
                          {t(`nav.${item.key}.viewAll`)}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}
