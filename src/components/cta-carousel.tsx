"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const SLIDES = [
  { key: "begin", glow: "rgba(184,146,90,0.30)" },
  { key: "reviewed", glow: "rgba(58,90,122,0.34)" },
  { key: "delivered", glow: "rgba(184,146,90,0.22)" },
] as const;

export function CtaCarousel() {
  const t = useTranslations("cta");
  const tc = useTranslations("common");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-140 overflow-hidden bg-[#0F2444]"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.key}
          aria-hidden={i !== active}
          inert={i !== active}
          className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              background: `radial-gradient(700px 500px at 50% 30%, ${slide.glow}, transparent 65%), linear-gradient(160deg, #12294c 0%, #0F2444 55%, #081729 100%)`,
            }}
          />

          <span
            className="relative font-display font-bold leading-none"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 8rem)",
              backgroundImage: "linear-gradient(to bottom, #E4C081, rgba(184,146,90,0.25))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t(`slides.${slide.key}.word`)}
          </span>

          <p className="relative mt-4 max-w-md font-body text-[#F5F6F4]/70">
            {t(`slides.${slide.key}.description`)}
          </p>

          <Link
            href="/start"
            className="group relative mt-8 flex items-center gap-2 rounded-full bg-[#F5F6F4] px-7 py-3.5 font-body text-sm font-semibold text-[#0F2444] transition-transform hover:-translate-y-0.5"
          >
            {t("button")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ))}

      <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-1">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => setActive(i)}
            aria-label={tc("slide", { number: i + 1 })}
            aria-current={i === active}
            className="group flex h-6 min-w-6 items-center justify-center rounded-full px-1"
          >
            <span
              className={`block h-2 rounded-full transition-all ${
                i === active
                  ? "w-6 bg-[#B8925A]"
                  : "w-2 bg-white/40 group-hover:bg-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}