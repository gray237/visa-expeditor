import { NextResponse } from "next/server";
import { findVisaRecord, VISA_PASSPORT_CODES, VISA_DESTINATION_CODES } from "@/data/visa";
import { countryName, localizedCountries } from "@/lib/countries";
import { routing } from "@/i18n/routing";
import enVisa from "../../../../messages/en/visaChecker.json";
import esVisa from "../../../../messages/es/visaChecker.json";
import frVisa from "../../../../messages/fr/visaChecker.json";

const STATUS_COPY = {
  en: enVisa.statuses,
  es: esVisa.statuses,
  fr: frVisa.statuses,
};

type Locale = (typeof routing.locales)[number];

type IncomingMessage = { role?: unknown; content?: unknown };

const PROMPTS: Record<Locale, string> = {
  en: "Try: “US passport to Japan” or “Do I need a visa for France with a Canadian passport?”",
  es: "Prueba: “pasaporte de EE. UU. a Japón” o “¿necesito visado para Francia con pasaporte canadiense?”",
  fr: "Essayez : « passeport américain vers le Japon » ou « ai-je besoin d'un visa pour la France avec un passeport canadien ? »",
};

const PREFIX: Record<Locale, (passport: string, destination: string, status: string) => string> = {
  en: (passport, destination, status) =>
    `For a ${passport} passport travelling to ${destination} for tourism, the dataset lists: ${status}.`,
  es: (passport, destination, status) =>
    `Para un pasaporte de ${passport} que viaja a ${destination} por turismo, el dataset indica: ${status}.`,
  fr: (passport, destination, status) =>
    `Pour un passeport ${passport} voyageant vers ${destination} pour tourisme, la base indique : ${status}.`,
};

const FOOTER: Record<Locale, string> = {
  en: " This is sample data only — confirm with the destination's official government source before travelling.",
  es: " Solo son datos de muestra: confirma con la fuente oficial del destino antes de viajar.",
  fr: " Données indicatives seulement — confirmez auprès de la source officielle de la destination avant de voyager.",
};

function detectCodes(text: string, locale: Locale) {
  const lower = text.toLowerCase();
  const matches: { code: string; index: number }[] = [];

  for (const country of localizedCountries(locale)) {
    const index = lower.indexOf(country.name.toLowerCase());
    if (index >= 0) matches.push({ code: country.code, index });
  }

  for (const match of text.matchAll(/\b([A-Z]{2})\b/g)) {
    if (matches.some((item) => item.code === match[1])) continue;
    matches.push({ code: match[1], index: match.index ?? text.length });
  }

  const unique = [...new Map(matches.sort((a, b) => a.index - b.index).map((m) => [m.code, m])).values()];
  const passport = unique.find((m) => VISA_PASSPORT_CODES.includes(m.code))?.code ?? "US";
  const destination = unique.find(
    (m) => m.code !== passport && VISA_DESTINATION_CODES.includes(m.code),
  )?.code;

  return { passport, destination };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "" }, { status: 400 });
  }

  const payload = body as { messages?: unknown; locale?: unknown };
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return NextResponse.json({ reply: "" }, { status: 400 });
  }

  const messages = payload.messages.slice(-8) as IncomingMessage[];
  const last = messages[messages.length - 1];
  const prompt = typeof last?.content === "string" ? last.content.trim() : "";
  if (!prompt || prompt.length > 500) {
    return NextResponse.json({ reply: "" }, { status: 400 });
  }

  const locale: Locale = routing.locales.includes(payload.locale as Locale)
    ? (payload.locale as Locale)
    : "en";
  const { passport, destination } = detectCodes(prompt, locale);

  if (!destination) {
    return NextResponse.json({
      reply: `${PROMPTS[locale]} ${FOOTER[locale]}`,
    });
  }

  const record = findVisaRecord(passport, destination);
  if (!record || record.status === "unknown") {
    return NextResponse.json({
      reply: `${PREFIX[locale](countryName(passport, locale), countryName(destination, locale), STATUS_COPY[locale].unknown)} ${FOOTER[locale]}`,
    });
  }

  const statusLabel = (STATUS_COPY[locale] as Record<string, string>)[record.status] ?? record.status;
  const stay = record.maxStayDays
    ? locale === "en"
      ? ` Maximum stay: ${record.maxStayDays} days.`
      : locale === "es"
        ? ` Estancia máxima: ${record.maxStayDays} días.`
        : ` Séjour maximal : ${record.maxStayDays} jours.`
    : "";

  return NextResponse.json({
    reply: `${PREFIX[locale](countryName(passport, locale), countryName(destination, locale), statusLabel)}${stay}${FOOTER[locale]}`,
  });
}
