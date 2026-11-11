"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const COOKIE_NAME = "ve_passport";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DEFAULT_PASSPORT = "US";
const VALID_CODE = /^[A-Z]{2}$/;

type PassportContextValue = {
  passport: string;
  setPassport: (code: string) => void;
};

const PassportContext = createContext<PassportContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${COOKIE_NAME}=`;
  const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(prefix.length)).toUpperCase();
  return VALID_CODE.test(value) ? value : null;
}

function writeCookie(code: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    code,
  )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function getSnapshot() {
  return readCookie() ?? DEFAULT_PASSPORT;
}

function getServerSnapshot() {
  return DEFAULT_PASSPORT;
}

export function PassportProvider({ children }: { children: ReactNode }) {
  const passport = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setPassport = useCallback((code: string) => {
    const next = code.toUpperCase();
    if (!VALID_CODE.test(next)) return;
    writeCookie(next);
    emit();
  }, []);

  const value = useMemo(() => ({ passport, setPassport }), [passport, setPassport]);

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}

export function usePassport() {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error("usePassport must be used within a PassportProvider");
  }
  return context;
}
