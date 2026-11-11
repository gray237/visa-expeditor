export const COUNTRY_CODES = [
  "US",
  "GB",
  "CA",
  "AU",
  "IN",
  "NG",
  "DE",
  "FR",
  "BR",
  "MX",
  "JP",
  "CN",
  "KR",
  "ES",
  "IT",
  "NL",
  "AE",
  "KE",
  "GH",
  "CM",
  "ZA",
  "PH",
  "PK",
  "ID",
  "EG",
  "TR",
  "IE",
  "NZ",
  "SG",
  "SE",
  "CH",
  "PT",
  "PL",
  "AR",
  "CO",
  "SA",
  "IL",
  "TH",
  "VN",
  "MY",
  "BE",
  "AT",
  "NO",
  "DK",
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type Country = {
  code: string;
};

export const COUNTRIES: Country[] = COUNTRY_CODES.map((code) => ({ code }));

export const POPULAR_COUNTRY_CODES: string[] = ["US", "GB", "CA", "IN", "NG", "DE"];

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

export function localizedCountries(locale: string): { code: string; name: string }[] {
  return COUNTRIES.map((country) => ({
    code: country.code,
    name: countryName(country.code, locale),
  })).sort((a, b) => a.name.localeCompare(b.name, locale));
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
