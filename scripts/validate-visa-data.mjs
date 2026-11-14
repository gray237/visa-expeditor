import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { VisaDatasetSchema } from "../src/data/visa/schema.mjs";

const dataDirectory = join(process.cwd(), "src/data/visa");
const sourcePath = join(dataDirectory, "source.json");
const files = readdirSync(dataDirectory)
  .filter((file) => /^[A-Z]{2}\.json$/.test(file))
  .sort();

if (files.length === 0) {
  throw new Error("No passport visa datasets found in src/data/visa.");
}
if (!existsSync(sourcePath)) {
  throw new Error("Missing src/data/visa/source.json.");
}

const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const expectedPassports = Array.isArray(source.passports) ? source.passports : [];
const expectedDestinations = Array.isArray(source.destinations)
  ? source.destinations
  : [];
const expectedDestinationSet = new Set(expectedDestinations);
const expectedPassportSet = new Set(expectedPassports);
const expectedDatasetVersion = `travelrequirements@${source.version}+${source.commit.slice(0, 7)}`;
const blockedHosts = new Set([
  "example.com",
  "www.example.com",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
]);

function fail(message) {
  throw new Error(message);
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

function isAllowedSourceUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !blockedHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const seen = new Set();
const confidenceCounts = {};
const statusCounts = {};
let count = 0;

for (const file of files) {
  const rows = JSON.parse(readFileSync(join(dataDirectory, file), "utf8"));
  const parsed = VisaDatasetSchema.parse(rows);
  const passport = file.slice(0, 2);
  const destinationsInFile = new Set();

  if (parsed.some((row) => row.passport !== passport)) {
    fail(`${file} contains a record for a different passport.`);
  }
  if (parsed.length !== expectedDestinations.length) {
    fail(
      `${file} has ${parsed.length} records; expected ${expectedDestinations.length}.`,
    );
  }

  for (const row of parsed) {
    const key = `${row.passport}:${row.destination}:${row.purpose}`;
    if (seen.has(key)) fail(`Duplicate visa record across files: ${key}`);
    seen.add(key);

    if (!expectedDestinationSet.has(row.destination)) {
      fail(`${file} contains unsupported destination ${row.destination}.`);
    }
    const destinationKey = `${row.destination}:${row.purpose}`;
    if (destinationsInFile.has(destinationKey)) {
      fail(`${file} contains duplicate ${destinationKey}.`);
    }
    destinationsInFile.add(destinationKey);

    if (!isAllowedSourceUrl(row.sourceUrl)) {
      fail(`${file}: ${row.destination} has an invalid or blocked sourceUrl.`);
    }
    if (!row.sourceName) {
      fail(`${file}: ${row.destination} is missing sourceName.`);
    }
    if (!row.sourceType) {
      fail(`${file}: ${row.destination} is missing sourceType.`);
    }
    if (!row.sourceLevel) {
      fail(`${file}: ${row.destination} is missing sourceLevel.`);
    }
    if (!isIsoDate(row.lastVerified)) {
      fail(`${file}: ${row.destination} has an invalid lastVerified.`);
    }

    if (row.confidence === "imported") {
      if (row.datasetVersion !== expectedDatasetVersion) {
        fail(
          `${file}: ${row.destination} datasetVersion is ${row.datasetVersion ?? "missing"}; expected ${expectedDatasetVersion}.`,
        );
      }
      if (!isIsoDate(row.importedAt)) {
        fail(`${file}: ${row.destination} has an invalid importedAt.`);
      }
    }
    if (row.confidence === "verified" && !row.verification) {
      fail(`${file}: ${row.destination} is verified without a verification object.`);
    }

    confidenceCounts[row.confidence] =
      (confidenceCounts[row.confidence] ?? 0) + 1;
    statusCounts[row.status] = (statusCounts[row.status] ?? 0) + 1;
  }

  for (const destination of expectedDestinations) {
    if (!destinationsInFile.has(`${destination}:tourism`)) {
      fail(`${file}: missing ${destination}:tourism.`);
    }
  }

  count += parsed.length;
}

if (count !== source.records) {
  fail(`source.json records=${source.records}; found ${count}.`);
}
if (expectedPassports.length !== files.length) {
  fail(
    `source.json passports=${expectedPassports.length}; found ${files.length} files.`,
  );
}
for (const passport of expectedPassportSet) {
  if (!files.includes(`${passport}.json`)) {
    fail(`Missing passport file: ${passport}.json.`);
  }
}
for (const file of files) {
  const passport = file.slice(0, 2);
  if (!expectedPassportSet.has(passport)) {
    fail(`Unexpected passport file: ${file}.`);
  }
}

console.log(
  `Visa data valid: ${files.length} passport files, ${count} records, ${expectedDestinations.length} destinations.`,
);
console.log(
  `Confidence: ${Object.entries(confidenceCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join(", ")}.`,
);
console.log(
  `Statuses: ${Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key}=${value}`)
    .join(", ")}.`,
);
