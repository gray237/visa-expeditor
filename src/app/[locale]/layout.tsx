import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PassportProvider } from "@/components/providers/passport-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Visa Expeditor — Passport & Visa Help, Done Right",
  description:
    "Passport renewals, visa applications, and travel document help — reviewed by real people, not a chatbot.",
  icons: {
    icon: "/favicon.svg",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body
          className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} font-body antialiased`}
        >
          <NextIntlClientProvider>
            <PassportProvider>
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </PassportProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}