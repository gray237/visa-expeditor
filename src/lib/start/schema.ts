import { z } from "zod";
import { COUNTRY_CODES } from "@/lib/countries";

const countryCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}$/)
  .refine((code) => COUNTRY_CODES.some((countryCode) => countryCode === code));

const optionalDateSchema = z
  .string()
  .transform((value) => (value === "" ? null : value))
  .pipe(z.iso.date().nullable());

export const applicationSchema = z
  .object({
    service: z.enum(["passport", "visa", "immigration"]),
    purpose: z.enum(["tourism", "business", "transit", "study", "work"]),
    passport: countryCodeSchema,
    destination: countryCodeSchema,
    name: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .regex(/^[\p{L}\p{M} .'-]+$/u),
    email: z.email().max(254),
    phone: z.string().trim().max(40),
    travelStart: optionalDateSchema,
    travelEnd: optionalDateSchema,
    message: z.string().trim().max(3000),
    privacyConsent: z.literal(true),
  })
  .superRefine((data, context) => {
    if (Boolean(data.travelStart) !== Boolean(data.travelEnd)) {
      context.addIssue({
        code: "custom",
        path: ["travelEnd"],
        message: "Both travel dates must be supplied together.",
      });
    }

    if (data.travelStart && data.travelEnd && data.travelEnd < data.travelStart) {
      context.addIssue({
        code: "custom",
        path: ["travelEnd"],
        message: "The return date must not be before the departure date.",
      });
    }
  });

export type ApplicationInput = z.infer<typeof applicationSchema>;
