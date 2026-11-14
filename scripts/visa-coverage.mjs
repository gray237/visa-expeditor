import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataDirectory = join(process.cwd(), "src/data/visa");
const reportsDirectory = join(process.cwd(), "reports");
const sourcePath = join(dataDirectory, "source.json");
const staleAfterDays = Number(process.env.VISA_STALE_DAYS ?? 180);

const launchPassports = ["US", "GB", "CA", "AU"];
const priorityOrder = { high: 0, medium: 1, low: 2 };
const statusPriority = {
  not_admitted: "high",
  unknown: "high",
  visa_required: "high",
  travel_permit: "high",
  evisa: "medium",
  eta: "medium",
  visa_on_arrival: "medium",
  visa_free: "low",
  freedom_of_movement: "low",
};

function fail(message) {
  console.error(`Visa coverage failed: ${message}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function increment(target, key) {
  target[key] = (target[key] ?? 0) + 1;
}

function parseDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(from, to) {
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

function validSourceUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return ![
      "example.com",
      "www.example.com",
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
    ].includes(host);
  } catch {
    return false;
  }
}

function coverageRow(record) {
  return {
    passport: record.passport,
    destination: record.destination,
    purpose: record.purpose,
    status: record.status,
    confidence: record.confidence,
    sourceName: record.sourceName ?? null,
    sourceUrl: record.sourceUrl ?? null,
    sourceType: record.sourceType ?? null,
    sourceLevel: record.sourceLevel ?? null,
    lastVerified: record.lastVerified ?? null,
    lastChanged: record.lastChanged ?? null,
    datasetVersion: record.datasetVersion ?? null,
    importedAt: record.importedAt ?? null,
    visaTypeId: record.visaTypeId ?? null,
  };
}

if (!existsSync(sourcePath)) {
  fail(`missing ${sourcePath}; run the import first.`);
  process.exit();
}

const source = readJson(sourcePath);
const expectedPassports = Array.isArray(source.passports) ? source.passports : [];
const expectedDestinations = Array.isArray(source.destinations)
  ? source.destinations
  : [];
const expectedPassportSet = new Set(expectedPassports);
const expectedDestinationSet = new Set(expectedDestinations);
const asOf = parseDate(source.importedAt) ?? new Date();

const files = readdirSync(dataDirectory)
  .filter((file) => /^[A-Z]{2}\.json$/.test(file))
  .sort();
const actualPassportSet = new Set(files.map((file) => file.slice(0, 2)));

const records = [];
const errors = [];
const warnings = [];
const missing = {
  sourceUrl: [],
  sourceName: [],
  lastVerified: [],
  datasetVersion: [],
  importedAt: [],
};
const statusCounts = {};
const confidenceCounts = {};
const sourceLevelCounts = {};
const sourceTypeCounts = {};

for (const file of files) {
  const passport = file.slice(0, 2);
  const rows = readJson(join(dataDirectory, file));
  if (!Array.isArray(rows)) {
    errors.push(`${file}: expected an array`);
    continue;
  }
  if (rows.length !== expectedDestinations.length) {
    errors.push(
      `${file}: expected ${expectedDestinations.length} records, found ${rows.length}`,
    );
  }
  const destinationsInFile = new Set();
  for (const record of rows) {
    if (record.passport !== passport) {
      errors.push(`${file}: record passport is ${record.passport}`);
    }
    if (!expectedDestinationSet.has(record.destination)) {
      errors.push(`${file}: unsupported destination ${record.destination}`);
    }
    const key = `${record.destination}:${record.purpose}`;
    if (destinationsInFile.has(key)) {
      errors.push(`${file}: duplicate ${key}`);
    }
    destinationsInFile.add(key);

    if (!validSourceUrl(record.sourceUrl)) missing.sourceUrl.push(coverageRow(record));
    if (!record.sourceName) missing.sourceName.push(coverageRow(record));
    if (!parseDate(record.lastVerified)) missing.lastVerified.push(coverageRow(record));
    if (!record.datasetVersion) missing.datasetVersion.push(coverageRow(record));
    if (!parseDate(record.importedAt)) missing.importedAt.push(coverageRow(record));

    increment(statusCounts, record.status);
    increment(confidenceCounts, record.confidence);
    increment(sourceLevelCounts, record.sourceLevel ?? "unknown");
    increment(sourceTypeCounts, record.sourceType ?? "unknown");
    records.push(record);
  }
  for (const destination of expectedDestinations) {
    if (!destinationsInFile.has(`${destination}:tourism`)) {
      errors.push(`${file}: missing ${destination}:tourism`);
    }
  }
}

for (const passport of expectedPassportSet) {
  if (!actualPassportSet.has(passport)) {
    errors.push(`Missing passport file: ${passport}.json`);
  }
}
for (const passport of actualPassportSet) {
  if (!expectedPassportSet.has(passport)) {
    warnings.push(`Unexpected passport file: ${passport}.json`);
  }
}
if (records.length !== source.records) {
  errors.push(`source.json says ${source.records} records; found ${records.length}`);
}
if (expectedPassports.length !== actualPassportSet.size) {
  errors.push(
    `source.json says ${expectedPassports.length} passports; found ${actualPassportSet.size} files`,
  );
}

const staleRows = records
  .map((record) => {
    const checked = parseDate(record.lastVerified);
    if (!checked) return null;
    const ageDays = daysBetween(checked, asOf);
    return ageDays > staleAfterDays
      ? { ...coverageRow(record), ageDays }
      : null;
  })
  .filter(Boolean)
  .sort((a, b) => b.ageDays - a.ageDays);

if (staleRows.length > 0) {
  warnings.push(
    `${staleRows.length} rows have lastVerified older than ${staleAfterDays} days.`,
  );
}

const launchQueue = [];
for (const passport of launchPassports) {
  for (const destination of expectedDestinations) {
    const record = records.find(
      (item) =>
        item.passport === passport &&
        item.destination === destination &&
        item.purpose === "tourism",
    );
    const missingFields = record
      ? [
          !validSourceUrl(record.sourceUrl) ? "sourceUrl" : null,
          !parseDate(record.lastVerified) ? "lastVerified" : null,
          !record.sourceName ? "sourceName" : null,
          !record.datasetVersion ? "datasetVersion" : null,
          !parseDate(record.importedAt) ? "importedAt" : null,
        ].filter(Boolean)
      : ["record"];
    if (missingFields.length > 0) {
      errors.push(
        `Launch corridor ${passport}->${destination} is incomplete: ${missingFields.join(", ")}`,
      );
    }
    launchQueue.push({
      priority: record ? (statusPriority[record.status] ?? "medium") : "high",
      passport,
      destination,
      status: record?.status ?? "MISSING",
      confidence: record?.confidence ?? "missing",
      verificationStatus:
        record?.confidence === "verified" ? "verified" : "pending",
      sourceName: record?.sourceName ?? null,
      sourceUrl: record?.sourceUrl ?? null,
      sourceLevel: record?.sourceLevel ?? null,
      lastVerified: record?.lastVerified ?? null,
      lastChanged: record?.lastChanged ?? null,
      missingFields,
    });
  }
}
launchQueue.sort(
  (a, b) =>
    priorityOrder[a.priority] - priorityOrder[b.priority] ||
    launchPassports.indexOf(a.passport) - launchPassports.indexOf(b.passport) ||
    a.destination.localeCompare(b.destination),
);

const pendingLaunch = launchQueue.filter(
  (entry) => entry.verificationStatus !== "verified",
).length;
if (pendingLaunch > 0) {
  warnings.push(`${pendingLaunch} launch corridors still need independent verification.`);
}

for (const key of Object.keys(missing)) {
  if (missing[key].length > 0) {
    errors.push(`${missing[key].length} rows are missing ${key}.`);
  }
}

const coverage = {
  source: {
    name: source.name,
    publisher: source.publisher,
    repository: source.repository,
    commit: source.commit,
    version: source.version,
    license: source.license,
    attribution: source.attribution,
    importedAt: source.importedAt,
  },
  expected: {
    passports: expectedPassports.length,
    destinations: expectedDestinations.length,
    records: source.records,
    launchPassports: launchPassports.length,
    launchCorridors: launchPassports.length * expectedDestinations.length,
  },
  actual: {
    passportFiles: files.length,
    passports: actualPassportSet.size,
    destinations: new Set(records.map((record) => record.destination)).size,
    records: records.length,
  },
  counts: {
    statuses: statusCounts,
    confidence: confidenceCounts,
    sourceLevels: sourceLevelCounts,
    sourceTypes: sourceTypeCounts,
  },
  stale: {
    asOf: source.importedAt,
    thresholdDays: staleAfterDays,
    count: staleRows.length,
    rows: staleRows,
  },
  launch: {
    total: launchQueue.length,
    verified: launchQueue.filter((entry) => entry.verificationStatus === "verified")
      .length,
    pending: pendingLaunch,
  },
  missing,
  errors,
  warnings,
};

mkdirSync(reportsDirectory, { recursive: true });
writeFileSync(
  join(reportsDirectory, "visa-coverage.json"),
  `${JSON.stringify(coverage, null, 2)}\n`,
);
writeFileSync(
  join(reportsDirectory, "visa-verification-queue.json"),
  `${JSON.stringify(
    {
      source: coverage.source,
      generatedAt: source.importedAt,
      total: launchQueue.length,
      entries: launchQueue,
    },
    null,
    2,
  )}\n`,
);

const statusLines = Object.entries(statusCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([status, count]) => `| ${status} | ${count} |`)
  .join("\n");
const queueLines = launchQueue
  .map(
    (entry, index) =>
      `| ${index + 1} | ${entry.priority} | ${entry.passport} → ${entry.destination} | ${entry.status} | ${entry.sourceLevel ?? "—"} | ${entry.lastVerified ?? "—"} | [source](${entry.sourceUrl ?? "#"}) |`,
  )
  .join("\n");

const markdown = `# Visa coverage report

Generated from TravelRequirements.info dataset \`${source.version}\` at commit \`${source.commit}\` (imported ${source.importedAt}).

## Summary

- Expected: ${coverage.expected.passports} passports × ${coverage.expected.destinations} destinations = ${coverage.expected.records} rows.
- Actual: ${coverage.actual.passports} passport files, ${coverage.actual.records} rows, ${coverage.actual.destinations} destinations.
- Launch corridors: ${coverage.launch.total}; verified ${coverage.launch.verified}; pending ${coverage.launch.pending}.
- Stale rows: ${staleRows.length} (threshold ${staleAfterDays} days).
- Errors: ${errors.length}; warnings: ${warnings.length}.

## Status counts

| Status | Rows |
|---|---:|
${statusLines}

## Launch verification queue

| # | Priority | Corridor | Status | Source level | Last verified | Source |
|---:|---|---|---|---|---|---|
${queueLines}

## Errors

${errors.length > 0 ? errors.map((error) => `- ${error}`).join("\n") : "None."}

## Warnings

${warnings.length > 0 ? warnings.map((warning) => `- ${warning}`).join("\n") : "None."}
`;

writeFileSync(join(reportsDirectory, "visa-coverage.md"), markdown);

console.log(
  `Visa coverage: ${coverage.actual.passports} passports, ${coverage.actual.records} rows, ${coverage.launch.pending}/${coverage.launch.total} launch corridors pending verification.`,
);
if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Visa coverage checks passed.");
}
