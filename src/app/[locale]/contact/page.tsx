import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { routing } from "@/i18n/routing";
import { ContactForm } from "@/components/contact-form";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const turnstileConfigured = Boolean(
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() &&
      process.env.TURNSTILE_SECRET_KEY?.trim(),
  );

  const details = [
    supportEmail
      ? {
          key: "email",
          href: `mailto:${supportEmail}`,
          label: supportEmail,
          icon: Mail,
        }
      : null,
    phone
      ? {
          key: "phone",
          href: `tel:${phone.replace(/[^\d+]/g, "")}`,
          label: phone,
          icon: Phone,
        }
      : null,
    whatsapp
      ? {
          key: "whatsapp",
          href: `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`,
          label: t("whatsappLabel"),
          icon: MessageCircle,
        }
      : null,
  ].filter((detail) => detail !== null);

  return (
    <div className="bg-[#F5F6F4] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B8925A]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#161B22] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed text-[#161B22]/65">
            {t("subhead")}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-[#0F2444]/10 bg-white p-7 sm:p-8">
            <ContactForm turnstileConfigured={turnstileConfigured} />
          </div>

          <aside className="space-y-4">
            {details.length > 0 && (
              <div className="rounded-2xl border border-[#0F2444]/10 bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-[#161B22]">
                  {t("directTitle")}
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65">
                  {t("directBody")}
                </p>

                <ul className="mt-4 space-y-3">
                  {details.map((detail) => {
                    const Icon = detail.icon;
                    return (
                      <li key={detail.key}>
                        <a
                          href={detail.href}
                          className="flex items-center gap-3 font-body text-sm font-semibold text-[#0F2444] hover:underline"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F2444]/6">
                            <Icon className="h-4 w-4" />
                          </span>
                          {detail.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-[#B8925A]/25 bg-[#B8925A]/6 p-6">
              <h2 className="font-display text-lg font-semibold text-[#161B22]">
                {t("responseTitle")}
              </h2>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#161B22]/65">
                {t("responseBody")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
