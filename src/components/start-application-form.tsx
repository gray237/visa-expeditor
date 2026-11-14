"use client";

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AuthError } from "@/components/auth/auth-card";
import { Turnstile } from "@/components/turnstile";
import { countryName, COUNTRY_CODES } from "@/lib/countries";
import { submitApplication, type ApplicationState } from "@/lib/start/actions";

const STEPS = ["service", "traveler", "contact", "review"] as const;
const SERVICES = ["passport", "visa", "immigration"] as const;
const PURPOSES = ["tourism", "business", "transit", "study", "work"] as const;
const inputClass =
  "w-full rounded-xl border border-[#0F2444]/15 bg-white px-4 py-3 text-sm text-[#161B22] outline-none transition focus:border-[#0F2444]/40 focus:ring-2 focus:ring-[#0F2444]/10 dark:bg-[#1a1b20] dark:text-[#F5F6F4]";
const labelClass =
  "mb-1.5 block text-sm font-semibold text-[#0F2444] dark:text-[#F5F6F4]";

type ApplicationDraft = {
  service: string;
  purpose: string;
  passport: string;
  destination: string;
  name: string;
  email: string;
  phone: string;
  travelStart: string;
  travelEnd: string;
  message: string;
};

export function StartApplicationForm({
  initialDraft,
  turnstileConfigured,
  submissionReady,
}: {
  initialDraft: ApplicationDraft;
  turnstileConfigured: boolean;
  submissionReady: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("start");
  const [state, formAction, isPending] = useActionState<ApplicationState, FormData>(
    submitApplication,
    undefined,
  );
  const [draft, setDraft] = useState(initialDraft);
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function updateDraft(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function nextStep() {
    if (formRef.current?.reportValidity()) {
      setStep((current) => Math.min(current + 1, STEPS.length - 1));
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <nav aria-label={t("steps.navigation")}>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STEPS.map((key, index) => (
            <li
              key={key}
              aria-current={index === step ? "step" : undefined}
              className={`rounded-xl px-3 py-2 text-center text-xs font-semibold ${
                index === step
                  ? "bg-[#0F2444] text-white"
                  : "bg-[#0F2444]/5 text-[#161B22]/60 dark:bg-white/10 dark:text-[#F5F6F4]/60"
              }`}
            >
              {t(`steps.${key}`)}
            </li>
          ))}
        </ol>
      </nav>

      <section hidden={step !== 0} aria-labelledby="application-step-service">
        <h2
          id="application-step-service"
          className="font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
        >
          {t("stepTitles.service")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="service" className={labelClass}>
              {t("fields.service")}
            </label>
            <select
              id="service"
              name="service"
              value={draft.service}
              onChange={updateDraft}
              required={step === 0}
              className={inputClass}
            >
              {SERVICES.map((service) => (
                <option key={service} value={service}>
                  {t(`services.${service}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="purpose" className={labelClass}>
              {t("fields.purpose")}
            </label>
            <select
              id="purpose"
              name="purpose"
              value={draft.purpose}
              onChange={updateDraft}
              required={step === 0}
              className={inputClass}
            >
              {PURPOSES.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {t(`purposes.${purpose}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="passport" className={labelClass}>
              {t("fields.passport")}
            </label>
            <select
              id="passport"
              name="passport"
              value={draft.passport}
              onChange={updateDraft}
              required={step === 0}
              className={inputClass}
            >
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {countryName(code, locale)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="destination" className={labelClass}>
              {t("fields.destination")}
            </label>
            <select
              id="destination"
              name="destination"
              value={draft.destination}
              onChange={updateDraft}
              required={step === 0}
              className={inputClass}
            >
              <option value="">{t("fields.chooseDestination")}</option>
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {countryName(code, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section hidden={step !== 1} aria-labelledby="application-step-traveler">
        <h2
          id="application-step-traveler"
          className="font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
        >
          {t("stepTitles.traveler")}
        </h2>
        <div className="mt-5">
          <label htmlFor="name" className={labelClass}>
            {t("fields.name")}
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={draft.name}
            onChange={updateDraft}
            required={step === 1}
            maxLength={120}
            className={inputClass}
          />
        </div>
      </section>

      <section hidden={step !== 2} aria-labelledby="application-step-contact">
        <h2
          id="application-step-contact"
          className="font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
        >
          {t("stepTitles.contact")}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>
              {t("fields.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={updateDraft}
              required={step === 2}
              maxLength={254}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              {t("fields.phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={draft.phone}
              onChange={updateDraft}
              maxLength={40}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="travelStart" className={labelClass}>
              {t("fields.travelStart")}
            </label>
            <input
              id="travelStart"
              name="travelStart"
              type="date"
              value={draft.travelStart}
              onChange={updateDraft}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="travelEnd" className={labelClass}>
              {t("fields.travelEnd")}
            </label>
            <input
              id="travelEnd"
              name="travelEnd"
              type="date"
              value={draft.travelEnd}
              onChange={updateDraft}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="message" className={labelClass}>
            {t("fields.message")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={3000}
            value={draft.message}
            onChange={updateDraft}
            className={`${inputClass} resize-y`}
          />
        </div>
        <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-[#161B22]/75 dark:text-[#F5F6F4]/75">
          <input
            type="checkbox"
            name="privacyConsent"
            required={step === 2}
            className="mt-1 h-4 w-4 accent-[#0F2444]"
          />
          <span>
            {t("privacyAcknowledgement")}{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              {t("privacyLink")}
            </Link>
          </span>
        </label>
      </section>

      <section hidden={step !== 3} aria-labelledby="application-step-review">
        <h2
          id="application-step-review"
          className="font-display text-xl font-semibold text-[#161B22] dark:text-[#F5F6F4]"
        >
          {t("stepTitles.review")}
        </h2>
        <dl className="mt-5 grid gap-3 rounded-2xl border border-[#0F2444]/10 p-5 text-sm dark:border-white/10">
          {(
            [
              ["service", t(`services.${draft.service}`)],
              ["purpose", t(`purposes.${draft.purpose}`)],
              ["passport", countryName(draft.passport, locale)],
              [
                "destination",
                draft.destination
                  ? countryName(draft.destination, locale)
                  : t("fields.chooseDestination"),
              ],
              ["name", draft.name],
              ["email", draft.email],
              ["phone", draft.phone || t("notProvided")],
              ["travelDates", `${draft.travelStart || "—"} – ${draft.travelEnd || "—"}`],
              ["message", draft.message || t("notProvided")],
            ] as const
          ).map(([key, value]) => (
            <div key={key} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-semibold text-[#161B22] dark:text-[#F5F6F4]">
                {t(`fields.${key}`)}
              </dt>
              <dd className="break-words text-[#161B22]/70 dark:text-[#F5F6F4]/70">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={step >= 2 ? "space-y-3" : "hidden"}>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">{t("honeypotLabel")}</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <Turnstile action="application" />
        {state?.status === "error" && (
          <AuthError>{t(`errors.${state.error}`)}</AuthError>
        )}
        {process.env.NODE_ENV === "production" && !turnstileConfigured && (
          <AuthError>{t("errors.turnstileNotConfigured")}</AuthError>
        )}
        {process.env.NODE_ENV === "production" &&
          turnstileConfigured &&
          !submissionReady && <AuthError>{t("errors.configurationRequired")}</AuthError>}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-[#0F2444]/10 pt-5 dark:border-white/10">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            className="inline-flex items-center gap-2 rounded-xl border border-[#0F2444]/15 px-5 py-3 text-sm font-semibold text-[#0F2444] dark:border-white/15 dark:text-[#F5F6F4]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </button>
        ) : (
          <span />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F2444] px-5 py-3 text-sm font-semibold text-white"
          >
            {t("continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isPending || !submissionReady}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F2444] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isPending ? t("sending") : t("submit")}
          </button>
        )}
      </div>
    </form>
  );
}
