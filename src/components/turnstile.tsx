"use client";

import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile";

export function Turnstile({ action }: { action?: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) return null;

  return (
    <div className="pt-1">
      <TurnstileWidget
        siteKey={siteKey}
        options={{ action, theme: "light", size: "flexible" }}
      />
    </div>
  );
}
