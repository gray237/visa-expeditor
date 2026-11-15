"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/lib/nav";
import { ComingSoonBadge } from "@/components/coming-soon-badge";

export function MegaMenuTrigger({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations(`nav.${item.key}`);
  const menuId = `mega-menu-${item.key}`;

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement)) setOpen(false);
    }, 150);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href={item.href}
        onFocus={() => setOpen(true)}
        className="flex items-center gap-1 rounded-sm font-body text-[15px] text-[#161B22]/80 transition-colors hover:text-[#0F2444]"
      >
        {t("label")}
      </Link>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t("label")}
        aria-expanded={open}
        aria-controls={menuId}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#161B22]/70 hover:bg-[#0F2444]/5"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={menuId}
          aria-label={t("label")}
          role="region"
          className={`absolute top-full z-50 mt-3 w-160 rounded-2xl border border-[#0F2444]/10 bg-white p-3 shadow-xl ${
            item.align === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div className="grid grid-cols-2 gap-1">
            {item.items.map((sub) => {
              const Icon = sub.icon;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#0F2444]/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0F2444]/6 text-[#0F2444]">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2 font-body text-sm font-semibold text-[#161B22]">
                      {t(`items.${sub.key}.label`)}
                      {sub.soon && <ComingSoonBadge />}
                    </span>
                    <span className="mt-0.5 block font-body text-[13px] text-[#161B22]/60">
                      {t(`items.${sub.key}.description`)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          {item.viewAllHref && (
            <Link
              href={item.viewAllHref}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#0F2444]/10 py-2.5 font-body text-sm font-semibold text-[#0F2444] transition-colors hover:bg-[#0F2444]/5"
            >
              {t("viewAll")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}