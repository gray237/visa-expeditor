import australia from "./AU.json";
import canada from "./CA.json";
import unitedKingdom from "./GB.json";
import unitedStates from "./US.json";
import { VisaDatasetSchema, type VisaRecord } from "./schema.mjs";
import { DESTINATIONS } from "@/lib/destinations";

export const VISA_DATASETS: Record<string, VisaRecord[]> = {
  US: VisaDatasetSchema.parse(unitedStates),
  GB: VisaDatasetSchema.parse(unitedKingdom),
  CA: VisaDatasetSchema.parse(canada),
  AU: VisaDatasetSchema.parse(australia),
};

export const VISA_RECORDS = Object.values(VISA_DATASETS).flat();
export const VISA_DESTINATIONS_COUNT = DESTINATIONS.length;

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
    visaFree: records.filter((record) => record.status === "visa_free").length,
    electronic: records.filter((record) =>
      ["evisa", "eta", "visa_on_arrival"].includes(record.status),
    ).length,
    paper: records.filter((record) => record.status === "visa_required").length,
  };
}

export function visaDestinationNameKey(code: string) {
  return DESTINATIONS.find((destination) => destination.countryCode === code)?.key;
}
