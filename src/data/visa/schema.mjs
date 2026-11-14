import { z } from "zod";

const nullablePositiveInteger = z.number().int().positive().nullable();

const sourceTypeSchema = z.enum(["government", "igo", "official-airline-db"]);
const sourceLevelSchema = z.enum(["row", "policy"]);
const processingUnitSchema = z.enum(["calendar-days", "business-days", "minutes"]);

export const VisaRecordSchema = z
  .object({
    passport: z.string().regex(/^[A-Z]{2}$/),
    destination: z.string().regex(/^[A-Z]{2}$/),
    purpose: z.enum(["tourism", "business", "transit", "study", "work"]),
    status: z.enum([
      "visa_free",
      "evisa",
      "eta",
      "visa_on_arrival",
      "visa_required",
      "freedom_of_movement",
      "travel_permit",
      "not_admitted",
      "unknown",
    ]),
    maxStayDays: nullablePositiveInteger,
    stayWindowDays: nullablePositiveInteger,
    passportValidityMonths: nullablePositiveInteger,
    blankPagesRequired: nullablePositiveInteger,
    processing: z
      .union([
        z.literal("instant"),
        z
          .object({
            minDays: z.number().int().nonnegative(),
            maxDays: z.number().int().nonnegative(),
            unit: processingUnitSchema.optional(),
          })
          .refine((value) => value.minDays <= value.maxDays, {
            message: "minDays must be less than or equal to maxDays",
          }),
      ])
      .nullable(),
    govFeeUsd: z.number().nonnegative().nullable(),
    applyUrl: z.url().nullable(),
    sourceUrl: z.url().nullable(),
    lastVerified: z.iso.date().nullable(),
    confidence: z.enum(["verified", "imported", "sample"]),
    notesKey: z.string().min(1),
    sourceName: z.string().min(1).nullable().optional(),
    sourceType: sourceTypeSchema.nullable().optional(),
    sourceLevel: sourceLevelSchema.nullable().optional(),
    sourceRequirement: z.string().min(1).nullable().optional(),
    lastChanged: z.iso.date().nullable().optional(),
    datasetVersion: z.string().min(1).nullable().optional(),
    importedAt: z.iso.date().nullable().optional(),
    extendableDays: nullablePositiveInteger.optional(),
    validUntil: z.iso.date().nullable().optional(),
    stayWindow: z
      .object({
        basis: z.string().min(1),
        windowDays: nullablePositiveInteger,
        allowanceDays: nullablePositiveInteger,
        text: z.string().nullable(),
      })
      .nullable()
      .optional(),
    govFee: z
      .object({
        amount: z.number().nonnegative(),
        currency: z.string().length(3),
        notes: z.string().nullable(),
      })
      .nullable()
      .optional(),
    passportValidityRule: z
      .enum([
        "6-months-on-arrival",
        "6-months-beyond-stay",
        "3-months-beyond-departure",
        "valid-for-stay",
        "other",
      ])
      .nullable()
      .optional(),
    visaTypeId: z.string().min(1).nullable().optional(),
    visaTypeName: z.string().min(1).nullable().optional(),
    verification: z
      .object({
        reviewer: z.string().min(1),
        date: z.iso.date(),
        method: z.string().min(1),
        notes: z.string().optional(),
      })
      .nullable()
      .optional(),
  })
  .superRefine((record, context) => {
    if (record.confidence === "verified") {
      if (!record.sourceUrl) {
        context.addIssue({
          code: "custom",
          path: ["sourceUrl"],
          message: "Verified records require an official source URL.",
        });
      }
      if (!record.lastVerified) {
        context.addIssue({
          code: "custom",
          path: ["lastVerified"],
          message: "Verified records require a verification date.",
        });
      }
      if (!record.verification) {
        context.addIssue({
          code: "custom",
          path: ["verification"],
          message: "Verified records require reviewer, date and method.",
        });
      }
    }

    if (record.confidence === "imported") {
      if (!record.sourceUrl) {
        context.addIssue({
          code: "custom",
          path: ["sourceUrl"],
          message: "Imported records require a source URL.",
        });
      }
      if (!record.lastVerified) {
        context.addIssue({
          code: "custom",
          path: ["lastVerified"],
          message: "Imported records require a source verification date.",
        });
      }
      if (!record.datasetVersion) {
        context.addIssue({
          code: "custom",
          path: ["datasetVersion"],
          message: "Imported records require a dataset version.",
        });
      }
      if (!record.importedAt) {
        context.addIssue({
          code: "custom",
          path: ["importedAt"],
          message: "Imported records require an import date.",
        });
      }
    }
  });

export const VisaDatasetSchema = z
  .array(VisaRecordSchema)
  .min(1)
  .superRefine((records, context) => {
    const passportCodes = new Set(records.map((record) => record.passport));
    if (passportCodes.size > 1) {
      context.addIssue({
        code: "custom",
        message: "Each passport JSON file must contain only one passport code.",
      });
    }

    const seen = new Set();
    records.forEach((record, index) => {
      const key = `${record.passport}:${record.destination}:${record.purpose}`;
      if (seen.has(key)) {
        context.addIssue({
          code: "custom",
          path: [index],
          message: `Duplicate visa record: ${key}`,
        });
      }
      seen.add(key);
    });
  });
