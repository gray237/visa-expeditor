import { readFileSync } from "node:fs";
import { join } from "node:path";
import sourceMetadata from "./source.json";
import type { VisaRecord } from "./schema.mjs";

export const VISA_DATA_SOURCE = sourceMetadata;
export const VISA_DESTINATIONS_COUNT = sourceMetadata.destinations.length;

const DATA_DIRECTORY = join(process.cwd(), "src/data/visa");
const recordsCache = new Map<string, VisaRecord[]>();

export function visaRecordsForPassport(passport: string): VisaRecord[] {
  const code = passport.toUpperCase();
  const cached = recordsCache.get(code);
  if (cached) return cached;

  let records: VisaRecord[] = [];
  if (/^[A-Z]{2}$/.test(code)) {
    try {
      records = JSON.parse(
        readFileSync(join(DATA_DIRECTORY, `${code}.json`), "utf8"),
      ) as VisaRecord[];
    } catch {
      records = [];
    }
  }
  recordsCache.set(code, records);
  return records;
}

export function findVisaRecord(
  passport: string,
  destination: string,
  purpose: VisaRecord["purpose"] = "tourism",
) {
  return visaRecordsForPassport(passport).find(
    (record) =>
      record.destination === destination.toUpperCase() && record.purpose === purpose,
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
