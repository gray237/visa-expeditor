export type Destination = {
  key: string;
  countryCode: string;
  accent: string;
};

export const DESTINATIONS: Destination[] = [
  { key: "mexico", countryCode: "MX", accent: "#2E7D4F" },
  { key: "canada", countryCode: "CA", accent: "#C8384C" },
  { key: "unitedKingdom", countryCode: "GB", accent: "#35507A" },
  { key: "france", countryCode: "FR", accent: "#3B5FA0" },
  { key: "italy", countryCode: "IT", accent: "#4C8C5C" },
  { key: "japan", countryCode: "JP", accent: "#B8455A" },
  { key: "germany", countryCode: "DE", accent: "#A88232" },
  { key: "spain", countryCode: "ES", accent: "#C1543D" },
  { key: "thailand", countryCode: "TH", accent: "#3D6B8C" },
  { key: "australia", countryCode: "AU", accent: "#2F5F8C" },
  { key: "southKorea", countryCode: "KR", accent: "#5B4B8A" },
  { key: "ireland", countryCode: "IE", accent: "#2D8659" },
  { key: "switzerland", countryCode: "CH", accent: "#B23B3B" },
  { key: "netherlands", countryCode: "NL", accent: "#C97A2E" },
  { key: "singapore", countryCode: "SG", accent: "#2E8C8C" },
  { key: "newZealand", countryCode: "NZ", accent: "#1F2937" },
  { key: "uae", countryCode: "AE", accent: "#A67C3D" },
];

export const MOST_VISITED_BY_PASSPORT: Partial<Record<string, string>> = {
  US: "mexico",
};

export const DEFAULT_FEATURED = "canada";
export const PASSPORT_OVERVIEW_CODES = ["US"];
