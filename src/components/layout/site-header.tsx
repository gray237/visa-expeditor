"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import { QuickCheckerTool } from "@/components/layout/quick-checker-tool";
import { MegaMenuTrigger } from "@/components/mega-menu";
import { AuthButton } from "@/components/auth-button";
import { LanguageSelector } from "@/components/language-selector";
import { NAV_ITEMS } from "@/lib/nav";
import { ComingSoonBadge } from "@/components/coming-soon-badge";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const t = useTranslations();
  const tc = useTranslations("common");

  return (
    <header className="sticky top-0 z-50 border-b border-[#0F2444]/10 bg-[#F5F6F4]/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-20 max-w-350 items-center justify-between px-1 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
            aria-label={menuOpen ? tc("closeMenu") : tc("openMenu")}
            aria-expanded={menuOpen}
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`h-[3px] w-6 rounded-full bg-[#0F2444] transition-transform ${
                  menuOpen ? "translate-y-[9px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[3px] w-6 rounded-full bg-[#0F2444] transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[3px] w-6 rounded-full bg-[#0F2444] transition-transform ${
                  menuOpen ? "-translate-y-[9px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <MegaMenuTrigger key={item.href} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <QuickCheckerTool />
          <LanguageSelector />

          <div className="hidden lg:block">
            <AuthButton />
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-[#0F2444]/10 px-1 py-4 sm:px-6 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const isExpanded = expandedMobile === item.href;
            return (
              <div key={item.href} className="border-b border-[#0F2444]/5 last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 py-3 font-body text-[15px] text-[#161B22]/80"
                  >
                    {t(`nav.${item.key}.label`)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpandedMobile(isExpanded ? null : item.href)}
                    aria-label={isExpanded ? tc("collapse") : tc("expand")}
                    className="flex h-9 w-9 shrink-0 items-center justify-center text-[#161B22]/50"
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
                          onClick={() => setMenuOpen(false)}
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
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0F2444]/10 py-2.5 font-body text-sm font-semibold text-[#0F2444]"
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
          <div className="mt-4">
            <AuthButton fullWidth />
          </div>
        </nav>
      )}
    </header>
  );
}