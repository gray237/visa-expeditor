"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Turnstile } from "@/components/turnstile";
import { AuthError, AuthNotice } from "@/components/auth/auth-card";
import { signInAction, type AuthActionState } from "@/lib/auth/actions";

const inputClass =
  "w-full rounded-2xl border border-[#0F2444]/15 bg-white/[95] px-4.5 py-3.5 font-body text-sm text-[#161B22] outline-none transition focus:border-[#B8925A] focus:ring-2 focus:ring-[#B8925A]/20 shadow-sm dark:bg-[#0F2444]/20 dark:text-[#F5F6F4]";

const labelClass = "mb-1.5 block font-body text-sm font-semibold text-[#0F2444]";

export function SignInForm({ registered = false }: { registered?: boolean }) {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState<AuthActionState, FormData>(
    signInAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {registered && <AuthNotice>{t("registeredNotice")}</AuthNotice>}

      <div>
        <label htmlFor="email" className={labelClass}>
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder={t("passwordPlaceholder")}
          className={inputClass}
        />
      </div>

      {state?.error && <AuthError>{t(`errors.${state.error}`)}</AuthError>}

      <Turnstile action="sign-in" />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t("signingIn") : t("signIn")}
      </button>

      <p className="pt-1 text-center font-body text-sm text-[#161B22]/65">
        {t("noAccount")}{" "}
        <Link href="/sign-up" className="font-semibold text-[#0F2444] hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
