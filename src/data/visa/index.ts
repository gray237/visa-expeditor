import summary from "./summary.generated.json";
import sourceMetadata from "./source.json";
import type { VisaConfidence, VisaStatus } from "./schema.mjs";
import { DESTINATIONS } from "@/lib/destinations";

export const VISA_DATA_SOURCE = sourceMetadata;
export const VISA_SUMMARY_SOURCE = summary.generatedFrom;
export const VISA_PASSPORT_CODES: string[] = summary.passports;
export const VISA_DESTINATION_CODES: string[] = summary.destinations;
export const VISA_DESTINATIONS_COUNT = VISA_DESTINATION_CODES.length;

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

const SUMMARY_RECORDS = summary.records as unknown as Record<
  string,
  Record<string, StoredSummaryRecord>
>;

const recordsByPassport = new Map<string, VisaSummaryRecord[]>();

export function visaRecordsForPassport(passport: string) {
  const code = passport.toUpperCase();
  const cached = recordsByPassport.get(code);
  if (cached) return cached;

  const destinations = SUMMARY_RECORDS[code] ?? {};
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
