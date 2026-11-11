export type Country = {
  name: string;
  code: string;
};

export const COUNTRIES: Country[] = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "India", code: "IN" },
  { name: "Nigeria", code: "NG" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "South Korea", code: "KR" },
  { name: "Spain", code: "ES" },
  { name: "Italy", code: "IT" },
  { name: "Netherlands", code: "NL" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Kenya", code: "KE" },
  { name: "Ghana", code: "GH" },
  { name: "Cameroon", code: "CM" },
  { name: "South Africa", code: "ZA" },
  { name: "Philippines", code: "PH" },
  { name: "Pakistan", code: "PK" },
  { name: "Indonesia", code: "ID" },
  { name: "Egypt", code: "EG" },
  { name: "Turkey", code: "TR" },
  { name: "Ireland", code: "IE" },
  { name: "New Zealand", code: "NZ" },
  { name: "Singapore", code: "SG" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Portugal", code: "PT" },
  { name: "Poland", code: "PL" },
  { name: "Argentina", code: "AR" },
  { name: "Colombia", code: "CO" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Israel", code: "IL" },
  { name: "Thailand", code: "TH" },
  { name: "Vietnam", code: "VN" },
  { name: "Malaysia", code: "MY" },
  { name: "Belgium", code: "BE" },
  { name: "Austria", code: "AT" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
];

export const POPULAR_COUNTRY_CODES = ["US", "GB", "CA", "IN", "NG", "DE"];

export function flagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const SHORT_NAMES: Record<string, string> = {
  US: "US",
  GB: "UK",
  AE: "UAE",
};

export function shortCountryName(code: string): string {
  const country = COUNTRIES.find((c) => c.code === code);
  return SHORT_NAMES[code] ?? country?.name ?? code;
}

export function fullCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}