"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const COOKIE_NAME = "ve_destination";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const VALID_CODE = /^[A-Z]{2}$/;

type DestinationContextValue = {
  destination: string;
  setDestination: (code: string) => void;
};

const DestinationContext = createContext<DestinationContextValue | null>(null);
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readCookie(): string {
  if (typeof document === "undefined") return "";
  const prefix = `${COOKIE_NAME}=`;
  const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  if (!match) return "";
  const value = decodeURIComponent(match.slice(prefix.length)).toUpperCase();
  return VALID_CODE.test(value) ? value : "";
}

function writeCookie(code: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    code,
  )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function getSnapshot() {
  return readCookie();
}

function getServerSnapshot() {
  return "";
}

export function DestinationProvider({ children }: { children: ReactNode }) {
  const destination = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setDestination = useCallback((code: string) => {
    const next = code.toUpperCase();
    if (next && !VALID_CODE.test(next)) return;
    writeCookie(next);
    for (const listener of listeners) listener();
  }, []);

  const value = useMemo(() => ({ destination, setDestination }), [destination, setDestination]);

  return (
    <DestinationContext.Provider value={value}>{children}</DestinationContext.Provider>
  );
}

export function useDestination() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestination must be used within a DestinationProvider");
  }
  return context;
}
