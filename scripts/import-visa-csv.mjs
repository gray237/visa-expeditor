import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VisaDatasetSchema, VisaRecordSchema } from "../src/data/visa/schema.mjs";

const input = process.argv[2];
if (!input) {
  throw new Error("Usage: node scripts/import-visa-csv.mjs <input.csv>");
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"' && value.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  if (value !== "" || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }
  return rows;
}

function nullableInteger(value, field, line) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Line ${line}: ${field} must be an integer or blank.`);
  }
  return parsed;
}

function nullableNumber(value, field, line) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Line ${line}: ${field} must be a number or blank.`);
  }
  return parsed;
}

const rows = parseCsv(readFileSync(input, "utf8").replace(/^\uFEFF/, ""));
const headers = rows.shift();
const requiredHeaders = [
  "passport",
  "destination",
  "purpose",
  "status",
  "maxStayDays",
  "stayWindowDays",
  "passportValidityMonths",
  "blankPagesRequired",
  "processing",
  "govFeeUsd",
  "applyUrl",
  "sourceUrl",
  "lastVerified",
  "confidence",
  "notesKey",
];

if (!headers || requiredHeaders.some((header) => !headers.includes(header))) {
  throw new Error(`CSV must include these headers: ${requiredHeaders.join(", ")}.`);
}

const grouped = new Map();
for (const [index, cells] of rows.entries()) {
  const line = index + 2;
  const row = Object.fromEntries(headers.map((header, i) => [header, cells[i]?.trim() ?? ""]));
  const processing = row.processing
    ? row.processing === "instant"
      ? "instant"
      : (() => {
          const match = /^(\d+)-(\d+)$/.exec(row.processing);
          if (!match) {
            throw new Error(`Line ${line}: processing must be blank, "instant", or min-max days.`);
          }
          return { minDays: Number(match[1]), maxDays: Number(match[2]) };
        })()
    : null;

  let record;
  try {
    record = VisaRecordSchema.parse({
      passport: row.passport.toUpperCase(),
      destination: row.destination.toUpperCase(),
      purpose: row.purpose,
      status: row.status,
      maxStayDays: nullableInteger(row.maxStayDays, "maxStayDays", line),
      stayWindowDays: nullableInteger(row.stayWindowDays, "stayWindowDays", line),
      passportValidityMonths: nullableInteger(row.passportValidityMonths, "passportValidityMonths", line),
      blankPagesRequired: nullableInteger(row.blankPagesRequired, "blankPagesRequired", line),
      processing,
      govFeeUsd: nullableNumber(row.govFeeUsd, "govFeeUsd", line),
      applyUrl: row.applyUrl || null,
      sourceUrl: row.sourceUrl || null,
      lastVerified: row.lastVerified || null,
      confidence: row.confidence,
      notesKey: row.notesKey,
    });
  } catch (error) {
    throw new Error(`Line ${line}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const records = grouped.get(record.passport) ?? [];
  records.push(record);
  grouped.set(record.passport, records);
}

const outputDirectory = join(process.cwd(), "src/data/visa");
for (const [passport, records] of grouped) {
  const validated = VisaDatasetSchema.parse(records);
  writeFileSync(join(outputDirectory, `${passport}.json`), `${JSON.stringify(validated, null, 2)}\n`);
}

console.log(`Imported ${rows.length} visa records across ${grouped.size} passport files.`);
