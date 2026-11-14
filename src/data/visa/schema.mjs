import { z } from "zod";

const nullablePositiveInteger = z.number().int().positive().nullable();

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
    confidence: z.enum(["verified", "sample"]),
    notesKey: z.string().min(1),
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
