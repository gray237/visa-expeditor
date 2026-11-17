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
  en: "Tell me both pieces and I'll check — for example, “US passport to Japan”.",
  es: "Dime las dos partes y lo reviso — por ejemplo, “pasaporte de EE. UU. a Japón”.",
  fr: "Donnez-moi les deux infos et je vérifie — par exemple, « passeport américain vers le Japon ».",
};

const PREFIX: Record<Locale, (passport: string, destination: string, status: string) => string> = {
  en: (passport, destination, status) =>
    `Happy to help! For a ${passport} passport heading to ${destination} for tourism, the dataset shows ${status}.`,
  es: (passport, destination, status) =>
    `¡Claro! Para un pasaporte de ${passport} que va a ${destination} por turismo, los datos indican: ${status}.`,
  fr: (passport, destination, status) =>
    `Avec plaisir ! Pour un passeport ${passport} vers ${destination} en tourisme, la base indique : ${status}.`,
};

const FOOTER: Record<Locale, string> = {
  en: " Just double-check with the official source before you go.",
  es: " Solo confirma con la fuente oficial antes de viajar.",
  fr: " Vérifiez quand même la source officielle avant de partir.",
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
