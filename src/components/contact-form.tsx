"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Send } from "lucide-react";
import { Turnstile } from "@/components/turnstile";
import { AuthError } from "@/components/auth/auth-card";
import { submitContact, type ContactState } from "@/lib/contact/actions";

const inputClass =
  "w-full rounded-xl border border-[#0F2444]/15 bg-white px-4 py-3 font-body text-sm text-[#161B22] outline-none transition focus:border-[#0F2444]/40 focus:ring-2 focus:ring-[#0F2444]/10";

const labelClass = "mb-1.5 block font-body text-sm font-semibold text-[#0F2444]";

const TOPICS = ["general", "passport", "visa", "immigration", "other"] as const;

export function ContactForm({ turnstileConfigured }: { turnstileConfigured: boolean }) {
  const t = useTranslations("contact");
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    undefined,
  );
  const protectionRequired = process.env.NODE_ENV === "production";
  const protectionReady = !protectionRequired || turnstileConfigured;
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

  if (state?.status === "success") {
    return (
      <div className="rounded-2xl border border-[#0F2444]/10 bg-[#0F2444]/3 p-7 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#0F2444]" strokeWidth={1.6} />
        <h2 className="mt-4 font-display text-xl font-semibold text-[#161B22]">
          {t("successTitle")}
        </h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t("nameLabel")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={t("namePlaceholder")}
            className={inputClass}
          />
        </div>

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
      </div>

      <div>
        <label htmlFor="topic" className={labelClass}>
          {t("topicLabel")}
        </label>
        <select id="topic" name="topic" className={inputClass} defaultValue="general">
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {t(`topics.${topic}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          placeholder={t("messagePlaceholder")}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">{t("honeypotLabel")}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state?.status === "error" && <AuthError>{t(`errors.${state.error}`)}</AuthError>}
      {protectionRequired && !turnstileConfigured && (
        <AuthError>
          {supportEmail
            ? t("errors.turnstileNotConfiguredWithEmail", { email: supportEmail })
            : t("errors.turnstileNotConfigured")}
        </AuthError>
      )}

      <Turnstile action="contact" />

      <button
        type="submit"
        disabled={isPending || !protectionReady}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F2444] px-6 py-3.5 font-body text-sm font-semibold text-[#F5F6F4] transition-colors hover:bg-[#0F2444]/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {isPending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
