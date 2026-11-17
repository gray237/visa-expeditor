"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/client";

type SocialProvider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.7 9.4 6 12 6z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.8-.9-3-.8-1.5 0-3 .9-3.8 2.2-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3.1-.7 1.4 0 1.8.7 3.1.7 1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.8-1-2.8-3.6zM14.2 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.9-1 2.9 1.1.1 2.2-.5 2.8-1.3z" />
    </svg>
  );
}

export function SocialProviderButtons() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<SocialProvider | null>(null);

  async function handleSocialSignIn(provider: SocialProvider) {
    setError(null);
    setPending(provider);
    try {
      const { error: signInError } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/${locale}/post-sign-in`,
      });
      if (signInError) throw signInError;
    } catch {
      setError(t("socialUnavailable"));
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#161B22]/40">
        {t("orContinueWith")}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialSignIn("google")}
          disabled={pending !== null}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#0F2444]/15 bg-white/[95] px-4 py-3 font-body text-sm font-semibold text-[#161B22] transition-colors hover:bg-[#0F2444]/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{t("signInWithGoogle")}</span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialSignIn("apple")}
          disabled={pending !== null}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#0F2444]/15 bg-white/[95] px-4 py-3 font-body text-sm font-semibold text-[#161B22] transition-colors hover:bg-[#0F2444]/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AppleIcon />
          <span>{t("signInWithApple")}</span>
        </button>
      </div>
      {error && <p className="font-body text-xs text-[#B42318]">{error}</p>}
    </div>
  );
}
