import type { z } from "zod";

export type VisaStatus =
  | "visa_free"
  | "evisa"
  | "eta"
  | "visa_on_arrival"
  | "visa_required"
  | "not_admitted"
  | "unknown";

export interface VisaRecord {
  passport: string;
  destination: string;
  purpose: "tourism" | "business" | "transit" | "study" | "work";
  status: VisaStatus;
  maxStayDays: number | null;
  stayWindowDays: number | null;
  passportValidityMonths: number | null;
  blankPagesRequired: number | null;
  processing: "instant" | { minDays: number; maxDays: number } | null;
  govFeeUsd: number | null;
  applyUrl: string | null;
  sourceUrl: string | null;
  lastVerified: string | null;
  confidence: "verified" | "sample";
  notesKey: string;
}

export declare const VisaRecordSchema: z.ZodType<VisaRecord>;
export declare const VisaDatasetSchema: z.ZodType<VisaRecord[]>;
