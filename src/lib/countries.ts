import visaSource from "@/data/visa/source.json";

export const PASSPORT_CODES: string[] = visaSource.passports;

export const DESTINATION_CODES: string[] = visaSource.destinations;

export const COUNTRY_CODES = PASSPORT_CODES;

export type CountryCode = string;

export type Country = {
  code: string;
};

export const COUNTRIES: Country[] = COUNTRY_CODES.map((code) => ({ code }));

export const POPULAR_COUNTRY_CODES: string[] = ["US", "GB", "CA", "IN", "NG", "DE"];
export const POPULAR_DESTINATION_CODES: string[] = [
  "MX",
  "CA",
  "GB",
  "FR",
  "IT",
  "JP",
  "TH",
  "AE",
];

const displayNamesCache = new Map<string, Intl.DisplayNames>();

function getDisplayNames(locale: string): Intl.DisplayNames {
  const cached = displayNamesCache.get(locale);
  if (cached) return cached;

  let names: Intl.DisplayNames;
  try {
    names = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  }
  displayNamesCache.set(locale, names);
  return names;
}

export function countryName(code: string, locale: string): string {
  try {
    return getDisplayNames(locale).of(code) ?? code;
  } catch {
    return code;
  }
}

function sortCountries(codes: string[], locale: string) {
  return codes
    .map((code) => ({ code, name: countryName(code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

export function localizedCountries(locale: string): { code: string; name: string }[] {
  return sortCountries(COUNTRY_CODES, locale);
}

export function destinationCountries(locale: string): { code: string; name: string }[] {
  return sortCountries(DESTINATION_CODES, locale);
}

export function shortCountryName(code: string, locale: string): string {
  return countryName(code, locale);
}

export function fullCountryName(code: string, locale: string): string {
  return countryName(code, locale);
}

export function flagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
