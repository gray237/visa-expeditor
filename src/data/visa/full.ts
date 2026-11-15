import { VISA_DATASETS_GENERATED } from "./datasets.generated";
import sourceMetadata from "./source.json";
import type { VisaRecord } from "./schema.mjs";
import { DESTINATIONS } from "@/lib/destinations";

export const VISA_DATA_SOURCE = sourceMetadata;
export const VISA_DESTINATIONS_COUNT = DESTINATIONS.length;

export const VISA_DATASETS = VISA_DATASETS_GENERATED as unknown as Record<
  string,
  VisaRecord[]
>;

export const VISA_RECORDS = Object.values(VISA_DATASETS).flat();

export function visaRecordsForPassport(passport: string) {
  return VISA_DATASETS[passport.toUpperCase()] ?? [];
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
