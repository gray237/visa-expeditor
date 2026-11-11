"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import * as Flags from "country-flag-icons/react/3x2";
import { Link } from "@/i18n/navigation";
import { IMMIGRATION_SERVICES } from "@/lib/immigration-programs";

const COUNTRY_IMAGES: Partial<Record<string, string>> = {
  unitedStates: "https://images.unsplash.com/photo-1777106800033-60faaaf4f2a3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  canada: "https://images.unsplash.com/photo-1507992781348-310259076fe0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9yb250b3xlbnwwfHwwfHx8MA%3D%3D",
  unitedKingdom: "https://images.unsplash.com/photo-1765924848202-754408284baa?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  australia: "https://plus.unsplash.com/premium_photo-1697730224601-a3c867ac1886?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  portugal: "https://images.unsplash.com/photo-1748279944004-f1d733dc711b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  newZealand: "https://cdn.sanity.io/images/nxpteyfv/goguides/bc37e6f28942611e13fc79996648ff9056aed9ef-1600x1066.jpg",
};

function PanelFlag({ code }: { code: string }) {
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <span className="relative inline-block h-6 w-9 shrink-0 overflow-hidden rounded ring-1 ring-white/30 transition-all duration-500 group-hover/card:ring-2 group-hover/card:ring-[#B8925A]/60 [&>svg]:absolute! [&>svg]:inset-0! [&>svg]:h-full! [&>svg]:w-full! [&>svg]:object-cover">
      {Flag ? <Flag title={code} /> : null}
    </span>
  );
}

const LOOP_ITEMS = [...IMMIGRATION_SERVICES, ...IMMIGRATION_SERVICES];
const PASS_DURATION_MS = 160000;
const DRAG_CLICK_THRESHOLD = 6;

export function ImmigrationShowcase() {
  const t = useTranslations("immigrationShowcase");
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId: number;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = now - lastTime;
      lastTime = now;
      const track = trackRef.current;

      if (track) {
        const setWidth = track.scrollWidth / 2;

        if (!draggingRef.current && !pausedRef.current && !reducedMotionRef.current && setWidth > 0) {
          offsetRef.current -= (setWidth / PASS_DURATION_MS) * dt;
        }

        if (setWidth > 0) {
          if (offsetRef.current <= -setWidth) offsetRef.current += setWidth;
          if (offsetRef.current > 0) offsetRef.current -= setWidth;
        }

        track.style.transform = `translateX(${offsetRef.current}px)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    draggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD) draggedRef.current = true;
    offsetRef.current = dragStartOffsetRef.current + delta;
  }

  function handlePointerUp() {
    draggingRef.current = false;
  }

  function handleClickCapture(e: React.MouseEvent) {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <section className="relative py-10 sm:py-18">
      <div className="mx-auto max-w-350 px-6">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] sm:text-4xl dark:text-[#F5F6F4]">
            {t("heading")}
          </h2>
          <p className="mt-3 font-body text-[#161B22]/70 dark:text-[#F5F6F4]/70">
            {t("subheading")}
          </p>
        </div>
      </div>

      <div
        className="relative mt-10 touch-pan-y select-none overflow-hidden"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClickCapture={handleClickCapture}
          className="flex w-max cursor-grab [&_img]:pointer-events-none active:cursor-grabbing"
        >
          {LOOP_ITEMS.map((service, i) => {
            const image = service.countryCode ? COUNTRY_IMAGES[service.key] : undefined;
            return (
              <Link
                key={`${service.key}-${i}`}
                href={service.href}
                draggable={false}
                className="group/card relative flex h-115 w-70 shrink-0 flex-col overflow-hidden border-r border-white/10 sm:h-130 sm:w-85 lg:w-100"
              >
                <div className="absolute inset-0">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 400px"
                      className="object-cover brightness-40 transition-all duration-700 ease-out group-hover/card:scale-110 group-hover/card:brightness-90"
                    />
                  ) : (
                    <div
                      className="h-full w-full transition-transform duration-700 ease-out group-hover/card:scale-110"
                      style={{ background: `linear-gradient(165deg, ${service.accent} 0%, #0F2444 80%)` }}
                    />
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-black/75 to-transparent" />

                <div className="relative z-20 flex items-center justify-between gap-2 px-5 py-4 transition-all duration-500 group-hover/card:bg-[#0F2444]/70 group-hover/card:backdrop-blur-[3px]">
                  <span className="font-display text-base font-semibold leading-tight text-[#F5F6F4] sm:text-lg">
                    {t(`items.${service.key}.label`)}
                  </span>
                  {service.countryCode ? (
                    <PanelFlag code={service.countryCode} />
                  ) : service.icon ? (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 transition-all duration-500 group-hover/card:bg-[#B8925A]/20 group-hover/card:ring-1 group-hover/card:ring-[#B8925A]/50">
                      <service.icon
                        className="h-4.5 w-4.5 text-[#F5F6F4] transition-colors duration-500 group-hover/card:text-[#B8925A]"
                        strokeWidth={1.75}
                      />
                    </span>
                  ) : null}
                </div>

                <div className="relative z-20 mt-auto p-5 sm:p-6">
                  <p className="font-body text-[13px] leading-relaxed text-[#F5F6F4]/85 sm:text-sm">
                    {t(`items.${service.key}.description`)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex translate-y-1/4 justify-center">
        <span
          className="select-none whitespace-nowrap font-display font-bold leading-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 9rem)",
            backgroundImage: "linear-gradient(to bottom, #B8925A, rgba(184,146,90,0.15))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          EXPLORE
        </span>
      </div>
    </section>
  );
}