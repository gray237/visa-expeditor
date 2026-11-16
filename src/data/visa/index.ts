import { readFileSync } from "node:fs";
import { join } from "node:path";
import sourceMetadata from "./source.json";
import type { VisaConfidence, VisaStatus } from "./schema.mjs";
import { DESTINATIONS } from "@/lib/destinations";

export const VISA_DATA_SOURCE = sourceMetadata;

export type VisaSummaryRecord = {
  passport: string;
  destination: string;
  purpose: "tourism";
  status: VisaStatus;
  maxStayDays: number | null;
  confidence: VisaConfidence;
  lastVerified: string | null;
  sourceVerifiedOn: string | null;
  importedOn: string | null;
};

type StoredSummaryRecord = Omit<
  VisaSummaryRecord,
  "passport" | "destination" | "purpose"
>;

type SummaryFile = {
  generatedFrom: {
    dataset: string;
    version: string;
    commit: string;
    importedAt: string;
  };
  passports: string[];
  destinations: string[];
  records: Record<string, Record<string, StoredSummaryRecord>>;
};

let summaryCache: SummaryFile | null = null;

function loadSummary(): SummaryFile {
  if (summaryCache) return summaryCache;
  try {
    summaryCache = JSON.parse(
      readFileSync(
        join(process.cwd(), "src/data/visa/summary.generated.json"),
        "utf8",
      ),
    ) as SummaryFile;
  } catch {
    summaryCache = {
      generatedFrom: {
        dataset: sourceMetadata.name,
        version: sourceMetadata.version,
        commit: sourceMetadata.commit,
        importedAt: sourceMetadata.importedAt,
      },
      passports: [],
      destinations: [],
      records: {},
    };
  }
  return summaryCache;
}

export const VISA_SUMMARY_SOURCE = loadSummary().generatedFrom;
export const VISA_PASSPORT_CODES: string[] = loadSummary().passports;
export const VISA_DESTINATION_CODES: string[] = loadSummary().destinations;
export const VISA_DESTINATIONS_COUNT = VISA_DESTINATION_CODES.length;

const recordsByPassport = new Map<string, VisaSummaryRecord[]>();

export function visaRecordsForPassport(passport: string) {
  const code = passport.toUpperCase();
  const cached = recordsByPassport.get(code);
  if (cached) return cached;

  const destinations = loadSummary().records[code] ?? {};
  const records = Object.entries(destinations).map(([destination, record]) => ({
    passport: code,
    destination,
    purpose: "tourism" as const,
    ...record,
  }));
  recordsByPassport.set(code, records);
  return records;
}

export function findVisaRecord(
  passport: string,
  destination: string,
  purpose: VisaSummaryRecord["purpose"] = "tourism",
) {
  if (purpose !== "tourism") return undefined;
  return visaRecordsForPassport(passport).find(
    (record) => record.destination === destination.toUpperCase(),
  );
}

export function getVisaStats(passport: string) {
  const records = visaRecordsForPassport(passport);
  const covered = records.filter((record) => record.status !== "unknown").length;

  return {
    covered,
    total: VISA_DESTINATIONS_COUNT,
    visaFree: records.filter((record) =>
      ["visa_free", "freedom_of_movement"].includes(record.status),
    ).length,
    electronic: records.filter((record) =>
      ["evisa", "eta", "visa_on_arrival"].includes(record.status),
    ).length,
    paper: records.filter((record) =>
      ["visa_required", "travel_permit"].includes(record.status),
    ).length,
  };
}

export function visaDestinationNameKey(code: string) {
  return DESTINATIONS.find((destination) => destination.countryCode === code)?.key;
}
