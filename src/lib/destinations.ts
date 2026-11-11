export type VisaRequirement = {
  type: "visaFree" | "etaRequired";
  validityDays: number;
  processing: "none" | "minutes";
};

export type Destination = {
  key: string;
  countryCode: string;
  accent: string;
  requirements: Partial<Record<string, VisaRequirement>>;
};

// Requirements below are illustrative sample data for demo purposes only —
// they are NOT sourced from a live, current, or verified regulatory feed and
// must not be treated as accurate travel advice. 17 destinations now have real
// entries, all using the same confidence bar as always: only nationality pairs
// with long-standing, well-documented visa-waiver relationships. Everything
// else searchable in the destination picker (44 countries total) intentionally
// falls back to a "check requirements" state rather than guessing. Replace
// all of it with a real, properly licensed visa-data source before this goes
// anywhere near real users.
export const DESTINATIONS: Destination[] = [
  {
    key: "mexico",
    countryCode: "MX",
    accent: "#2E7D4F",
    requirements: {
      US: { type: "visaFree", validityDays: 180, processing: "none" },
      GB: { type: "visaFree", validityDays: 180, processing: "none" },
      CA: { type: "visaFree", validityDays: 180, processing: "none" },
      AU: { type: "visaFree", validityDays: 180, processing: "none" },
    },
  },
  {
    key: "canada",
    countryCode: "CA",
    accent: "#C8384C",
    requirements: {
      US: { type: "visaFree", validityDays: 180, processing: "none" },
      GB: { type: "etaRequired", validityDays: 180, processing: "minutes" },
      AU: { type: "etaRequired", validityDays: 180, processing: "minutes" },
    },
  },
  {
    key: "unitedKingdom",
    countryCode: "GB",
    accent: "#35507A",
    requirements: {
      US: { type: "etaRequired", validityDays: 180, processing: "minutes" },
      CA: { type: "etaRequired", validityDays: 180, processing: "minutes" },
      AU: { type: "etaRequired", validityDays: 180, processing: "minutes" },
    },
  },
  {
    key: "france",
    countryCode: "FR",
    accent: "#3B5FA0",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "italy",
    countryCode: "IT",
    accent: "#4C8C5C",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "japan",
    countryCode: "JP",
    accent: "#B8455A",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "germany",
    countryCode: "DE",
    accent: "#A88232",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "spain",
    countryCode: "ES",
    accent: "#C1543D",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "thailand",
    countryCode: "TH",
    accent: "#3D6B8C",
    requirements: { US: { type: "visaFree", validityDays: 60, processing: "none" } },
  },
  {
    key: "australia",
    countryCode: "AU",
    accent: "#2F5F8C",
    requirements: { US: { type: "etaRequired", validityDays: 90, processing: "minutes" } },
  },
  {
    key: "southKorea",
    countryCode: "KR",
    accent: "#5B4B8A",
    requirements: { US: { type: "visaFree", validityDays: 90, processing: "none" } },
  },
  {
    key: "ireland",
    countryCode: "IE",
    accent: "#2D8659",
    requirements: { US: { type: "visaFree", validityDays: 90, processing: "none" } },
  },
  {
    key: "switzerland",
    countryCode: "CH",
    accent: "#B23B3B",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "netherlands",
    countryCode: "NL",
    accent: "#C97A2E",
    requirements: {
      US: { type: "visaFree", validityDays: 90, processing: "none" },
      GB: { type: "visaFree", validityDays: 90, processing: "none" },
      CA: { type: "visaFree", validityDays: 90, processing: "none" },
      AU: { type: "visaFree", validityDays: 90, processing: "none" },
    },
  },
  {
    key: "singapore",
    countryCode: "SG",
    accent: "#2E8C8C",
    requirements: { US: { type: "visaFree", validityDays: 90, processing: "none" } },
  },
  {
    key: "newZealand",
    countryCode: "NZ",
    accent: "#1F2937",
    requirements: { US: { type: "etaRequired", validityDays: 90, processing: "minutes" } },
  },
  {
    key: "uae",
    countryCode: "AE",
    accent: "#A67C3D",
    requirements: { US: { type: "visaFree", validityDays: 90, processing: "none" } },
  },
];

export const MOST_VISITED_BY_PASSPORT: Partial<Record<string, string>> = {
  US: "mexico",
};

export const DEFAULT_FEATURED = "canada";

export type PassportStats = {
  covered: number;
  visaFree: number;
  etaRequired: number;
};

// Computed live from the data above, not hardcoded — stays honest automatically
// as more destinations get added, instead of needing hand-updated numbers.
export function getPassportStats(passportCode: string): PassportStats {
  let visaFree = 0;
  let etaRequired = 0;
  let covered = 0;

  for (const destination of DESTINATIONS) {
    const requirement = destination.requirements[passportCode];
    if (!requirement) continue;
    covered += 1;
    if (requirement.type === "visaFree") visaFree += 1;
    if (requirement.type === "etaRequired") etaRequired += 1;
  }

  return { covered, visaFree, etaRequired };
}

// Which passports have a full overview (stats + travel guide) ready in the
// locale files. Add a code here only once its content exists under
// passportOverview.<code> in all three message files.
export const PASSPORT_OVERVIEW_CODES = ["US"];