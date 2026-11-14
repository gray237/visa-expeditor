import type { z } from "zod";

export type VisaStatus =
  | "visa_free"
  | "evisa"
  | "eta"
  | "visa_on_arrival"
  | "visa_required"
  | "freedom_of_movement"
  | "travel_permit"
  | "not_admitted"
  | "unknown";

export type VisaConfidence = "verified" | "imported" | "sample";
export type VisaSourceType = "government" | "igo" | "official-airline-db";
export type VisaSourceLevel = "row" | "policy";
export type VisaProcessingUnit = "calendar-days" | "business-days" | "minutes";

export interface VisaRecord {
  passport: string;
  destination: string;
  purpose: "tourism" | "business" | "transit" | "study" | "work";
  status: VisaStatus;
  maxStayDays: number | null;
  stayWindowDays: number | null;
  passportValidityMonths: number | null;
  blankPagesRequired: number | null;
  processing:
    | "instant"
    | { minDays: number; maxDays: number; unit?: VisaProcessingUnit }
    | null;
  govFeeUsd: number | null;
  applyUrl: string | null;
  sourceUrl: string | null;
  lastVerified: string | null;
  confidence: VisaConfidence;
  notesKey: string;
  sourceName?: string | null;
  sourceType?: VisaSourceType | null;
  sourceLevel?: VisaSourceLevel | null;
  sourceRequirement?: string | null;
  lastChanged?: string | null;
  datasetVersion?: string | null;
  importedAt?: string | null;
  extendableDays?: number | null;
  validUntil?: string | null;
  stayWindow?: {
    basis: string;
    windowDays: number | null;
    allowanceDays: number | null;
    text: string | null;
  } | null;
  govFee?: {
    amount: number;
    currency: string;
    notes: string | null;
  } | null;
  passportValidityRule?:
    | "6-months-on-arrival"
    | "6-months-beyond-stay"
    | "3-months-beyond-departure"
    | "valid-for-stay"
    | "other"
    | null;
  visaTypeId?: string | null;
  visaTypeName?: string | null;
  verification?: {
    reviewer: string;
    date: string;
    method: string;
    notes?: string;
  } | null;
}

export declare const VisaRecordSchema: z.ZodType<VisaRecord>;
export declare const VisaDatasetSchema: z.ZodType<VisaRecord[]>;
