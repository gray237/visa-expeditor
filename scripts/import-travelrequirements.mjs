import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { VisaDatasetSchema, VisaRecordSchema } from "../src/data/visa/schema.mjs";

const SOURCE = {
  name: "TravelRequirements.info — Entry Requirements Dataset",
  publisher: "AXG Sp. z o.o.",
  repository: "https://github.com/travel-requirements/entry-requirements",
  commit: "a566cc4c396f5da50c9235ba48cac860f2fff525",
  version: "1.3.0",
  license: "CC-BY-4.0",
  attribution:
    "TravelRequirements.info — Entry Requirements Dataset, AXG Sp. z o.o., https://travelrequirements.info/data/ (CC BY 4.0)",
};

const DESTINATIONS = {
  AU: "australia",
  CA: "canada",
  CH: "switzerland",
  DE: "germany",
  ES: "spain",
  FR: "france",
  GB: "united-kingdom",
  IE: "ireland",
  IT: "italy",
  JP: "japan",
  KR: "south-korea",
  MX: "mexico",
  NL: "netherlands",
  NZ: "new-zealand",
  SG: "singapore",
  TH: "thailand",
  AE: "united-arab-emirates",
};

const DEFAULT_PASSPORTS = ["US", "GB", "CA", "AU"];
const CACHE_DIRECTORY = join(process.cwd(), ".cache/travelrequirements");
const OUTPUT_DIRECTORY = join(process.cwd(), "src/data/visa");

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) continue;
    const key = argument.slice(2);
    const value = argv[index + 1];
    if (value && !value.startsWith("--")) {
      args[key] = value;
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function splitList(value, fallback) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sourceUrlFor(slug) {
  return `https://raw.githubusercontent.com/travel-requirements/entry-requirements/${SOURCE.commit}/destinations/${slug}.json`;
}

async function downloadDestination(slug, destinationDirectory) {
  const target = join(destinationDirectory, `${slug}.json`);
  if (existsSync(target)) {
    try {
      JSON.parse(readFileSync(target, "utf8"));
      return target;
    } catch {
      // Re-download an incomplete cached file.
    }
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(sourceUrlFor(slug), {
        signal: AbortSignal.timeout(90_000),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${slug}`);
      }
      const text = await response.text();
      JSON.parse(text);
      writeFileSync(target, text);
      return target;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
      }
    }
  }

  throw new Error(
    `Could not download ${slug}.json: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}

function mapStatus(requirement) {
  const statuses = {
    "visa-free": "visa_free",
    evisa: "evisa",
    eta: "eta",
    "visa-on-arrival": "visa_on_arrival",
    "embassy-visa": "visa_required",
    "visa-required": "visa_required",
    "freedom-of-movement": "freedom_of_movement",
    "travel-permit": "travel_permit",
    banned: "not_admitted",
    unconfirmed: "unknown",
  };
  const status = statuses[requirement];
  if (!status) {
    throw new Error(`Unmapped TravelRequirements requirement: ${requirement}`);
  }
  return status;
}

function mapPassportValidity(rule) {
  switch (rule) {
    case "6-months-on-arrival":
    case "6-months-beyond-stay":
      return { rule, months: 6 };
    case "3-months-beyond-departure":
      return { rule, months: 3 };
    case "valid-for-stay":
    case "other":
      return { rule, months: null };
    default:
      return { rule: null, months: null };
  }
}

function visaTypeFor(destination, row, requirement) {
  if (
    ["visa-free", "freedom-of-movement", "banned", "unconfirmed"].includes(
      requirement,
    )
  ) {
    return null;
  }

  const byId = new Map((destination.visaTypes ?? []).map((type) => [type.id, type]));
  const referenced = Array.isArray(row.visaTypes)
    ? row.visaTypes.map((id) => byId.get(id)).filter(Boolean)
    : [];

  if (referenced.length > 0) {
    return (
      referenced.find((type) => type.category === "tourist") ??
      referenced.find((type) => type.category === "transit") ??
      referenced[0]
    );
  }

  const methods = {
    evisa: ["evisa"],
    eta: ["eta"],
    "visa-on-arrival": ["visa-on-arrival"],
    "embassy-visa": ["embassy"],
    "visa-required": ["embassy", "evisa"],
    "travel-permit": ["evisa", "eta", "embassy"],
  };
  const expectedMethods = methods[requirement] ?? [];
  return (
    (destination.visaTypes ?? []).find(
      (type) =>
        type.category === "tourist" && expectedMethods.includes(type.method),
    ) ??
    (destination.visaTypes ?? []).find(
      (type) => type.category === "tourist" && type.method !== "unstated",
    ) ??
    null
  );
}

function processingFor(visaType) {
  if (!visaType?.processing) return null;
  const { minDays, maxDays, unit } = visaType.processing;
  if (typeof minDays !== "number" || typeof maxDays !== "number") return null;
  return {
    minDays,
    maxDays,
    ...(unit ? { unit } : {}),
  };
}

function feeFor(visaType) {
  if (!visaType?.fee) return null;
  const { amount, currency, notes } = visaType.fee;
  if (typeof amount !== "number" || typeof currency !== "string") return null;
  return {
    amount,
    currency: currency.toUpperCase(),
    notes: notes ?? null,
  };
}

function sourceFor(destination, row) {
  const source = row.source ?? destination.visaPolicy?.defaultSource;
  if (!source?.url || !source?.lastVerified) {
    throw new Error(
      `${destination.iso2}: no row or policy source with a verification date.`,
    );
  }
  return {
    sourceUrl: source.url,
    sourceName: source.name,
    sourceType: source.type,
    sourceLevel: row.source ? "row" : "policy",
    lastVerified: source.lastVerified,
    lastChanged: source.lastChanged ?? null,
  };
}

function recordFor(destination, passport, importDate) {
  const row = destination.visaPolicy?.byPassport?.[passport];
  if (!row) {
    throw new Error(`${destination.iso2}: no row for passport ${passport}.`);
  }

  const source = sourceFor(destination, row);
  const visaType = visaTypeFor(destination, row, row.requirement);
  const validity = mapPassportValidity(
    destination.entryRequirements?.passportValidity?.rule,
  );
  const blankPages = destination.entryRequirements?.blankPages?.count;

  return VisaRecordSchema.parse({
    passport,
    destination: destination.iso2,
    purpose: "tourism",
    status: mapStatus(row.requirement),
    maxStayDays: row.maxStayDays ?? null,
    stayWindowDays: row.stayWindow?.windowDays ?? null,
    passportValidityMonths: validity.months,
    blankPagesRequired: typeof blankPages === "number" ? blankPages : null,
    processing: processingFor(visaType),
    govFeeUsd: null,
    applyUrl: visaType?.applyUrl ?? null,
    ...source,
    confidence: "imported",
    notesKey: "importedDataset",
    sourceRequirement: row.requirement,
    datasetVersion: `travelrequirements@${SOURCE.version}+${SOURCE.commit.slice(0, 7)}`,
    importedAt: importDate,
    extendableDays: row.extendableDays ?? null,
    validUntil: row.validUntil ?? null,
    stayWindow: row.stayWindow
      ? {
          basis: row.stayWindow.basis,
          windowDays: row.stayWindow.windowDays ?? null,
          allowanceDays: row.stayWindow.allowanceDays ?? null,
          text: row.stayWindow.text ?? null,
        }
      : null,
    govFee: feeFor(visaType),
    passportValidityRule: validity.rule,
    visaTypeId: visaType?.id ?? null,
    visaTypeName: visaType?.name ?? null,
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const importAllPassports = args.passports === "all";
  const requestedPassports = importAllPassports
    ? []
    : splitList(args.passports, DEFAULT_PASSPORTS).map((code) =>
        code.toUpperCase(),
      );
  const destinationCodes = splitList(
    args.destinations,
    Object.keys(DESTINATIONS),
  ).map((code) => code.toUpperCase());
  const sourceDirectory =
    typeof args["source-dir"] === "string"
      ? args["source-dir"]
      : CACHE_DIRECTORY;
  const importDate =
    typeof args["import-date"] === "string"
      ? args["import-date"]
      : new Date().toISOString().slice(0, 10);

  for (const code of requestedPassports) {
    if (!/^[A-Z]{2}$/.test(code)) {
      throw new Error(`Invalid passport code: ${code}`);
    }
  }
  for (const code of destinationCodes) {
    if (!DESTINATIONS[code]) {
      throw new Error(`Unsupported destination code: ${code}`);
    }
  }

  mkdirSync(sourceDirectory, { recursive: true });
  mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

  const destinations = [];
  for (const code of destinationCodes) {
    const slug = DESTINATIONS[code];
    const path = typeof args["source-dir"] === "string"
      ? join(sourceDirectory, `${slug}.json`)
      : await downloadDestination(slug, sourceDirectory);
    if (!existsSync(path)) {
      throw new Error(`Missing source file: ${path}`);
    }
    const destination = JSON.parse(readFileSync(path, "utf8"));
    if (destination.iso2 !== code) {
      throw new Error(
        `${path}: expected ${code}, found ${destination.iso2 ?? "no iso2"}.`,
      );
    }
    destinations.push(destination);
  }

  const passports = importAllPassports
    ? [
        ...new Set(
          destinations.flatMap((destination) =>
            Object.keys(destination.visaPolicy?.byPassport ?? {}),
          ),
        ),
      ].sort()
    : requestedPassports;

  for (const code of passports) {
    if (!/^[A-Z]{2}$/.test(code)) {
      throw new Error(`Invalid passport code: ${code}`);
    }
  }

  const grouped = new Map(passports.map((code) => [code, []]));
  for (const passport of passports) {
    for (const destination of destinations) {
      grouped.get(passport).push(recordFor(destination, passport, importDate));
    }
  }

  let total = 0;
  for (const [passport, records] of grouped) {
    records.sort((a, b) => a.destination.localeCompare(b.destination));
    const validated = VisaDatasetSchema.parse(records);
    writeFileSync(
      join(OUTPUT_DIRECTORY, `${passport}.json`),
      `${JSON.stringify(validated, null, 2)}\n`,
    );
    total += validated.length;
    console.log(`${passport}: ${validated.length} imported rows`);
  }

  const metadata = {
    ...SOURCE,
    importedAt: importDate,
    passports,
    destinations: destinationCodes,
    records: total,
    caveat:
      "Imported rows are source-verified by the dataset provider, not independently verified by Visa Expeditor. Some rows rest on the destination policy-level source. The official source is the authority.",
  };
  writeFileSync(
    join(OUTPUT_DIRECTORY, "source.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );

  console.log(
    `Imported ${total} rows from ${SOURCE.name} (${SOURCE.version}, ${SOURCE.commit.slice(0, 7)}).`,
  );
}

await main();
