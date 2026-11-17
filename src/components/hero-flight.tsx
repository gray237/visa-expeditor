"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Plane } from "lucide-react";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function HeroFlight() {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const planeRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  useEffect(() => {
    if (!mounted) return;
    const plane = planeRef.current;
    const section = document.querySelector<HTMLElement>("[data-flight-section]");
    const row = document.querySelector<HTMLElement>("[data-flight-row]");
    if (!plane || !section || !row) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let current = 0;
    let lastTime = 0;

    function targetProgress() {
      if (reduceMotion.matches) return 0;
      const rect = section!.getBoundingClientRect();
      return clamp01(-rect.top / Math.max(rect.height * 0.68, 1));
    }

    function paint(progress: number) {
      const rowRect = row!.getBoundingClientRect();
      if (!rowRect.width) return;

      const target = document.querySelector<HTMLElement>("[data-flight-target]");
      const inset = Math.min(28, rowRect.width * 0.06);
      const travel = clamp01(progress / 0.62);
      const dock = clamp01((progress - 0.62) / 0.38);
      const easedTravel = easeInOutCubic(travel);
      const easedDock = easeInOutCubic(dock);

      let x = lerp(rowRect.left + inset, rowRect.right - inset, easedTravel);
      let y =
        rowRect.top - Math.sin(travel * Math.PI) * Math.min(18, rowRect.width * 0.035);
      let scale = 1;

      if (target) {
        const targetRect = target.getBoundingClientRect();
        x = lerp(x, targetRect.left + targetRect.width / 2, easedDock);
        y = lerp(y, targetRect.top + targetRect.height / 2, easedDock);
        scale = lerp(1, 0.68, easedDock);
      }

      const bank =
        directionRef.current * Math.sin(travel * Math.PI) * 8 * (1 - easedDock);
      const size = 36;
      plane!.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(${scale}) rotate(${bank}deg)`;
      plane!.style.opacity = "1";
    }

    function tick(now: number) {
      frameId = 0;
      const delta = lastTime ? Math.min(now - lastTime, 64) : 16;
      lastTime = now;
      const target = targetProgress();
      directionRef.current = target >= current ? 1 : -1;
      current =
        Math.abs(target - current) < 0.0004
          ? target
          : current + (target - current) * (1 - Math.exp(-delta / 90));
      paint(current);
      if (Math.abs(target - current) > 0.0004) {
        frameId = requestAnimationFrame(tick);
      } else {
        lastTime = 0;
      }
    }

    function schedule() {
      if (!frameId) frameId = requestAnimationFrame(tick);
    }

    function onResize() {
      paint(current);
      schedule();
    }

    function onMotionChange() {
      current = 0;
      directionRef.current = 1;
      paint(0);
      schedule();
    }

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => onResize());
    resizeObserver?.observe(row);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    reduceMotion.addEventListener("change", onMotionChange);
    paint(0);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      reduceMotion.removeEventListener("change", onMotionChange);
      resizeObserver?.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={planeRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed left-0 top-0 z-70 flex h-9 w-9 items-center justify-center rounded-full border border-[#B8925A]/70 bg-[#0F2444] text-[#B8925A] shadow-[0_14px_34px_-14px_rgba(6,18,36,0.85)] will-change-transform"
    >
      <Plane className="h-4 w-4 rotate-45" strokeWidth={1.7} />
    </div>,
    document.body,
  );
}
