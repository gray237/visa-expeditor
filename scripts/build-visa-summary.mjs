import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataDirectory = join(process.cwd(), "src/data/visa");
const sourcePath = join(dataDirectory, "source.json");
const summaryPath = join(dataDirectory, "summary.generated.json");

if (!existsSync(sourcePath)) {
  throw new Error("Missing src/data/visa/source.json; run the import first.");
}

const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const files = readdirSync(dataDirectory)
  .filter((file) => /^[A-Z]{2}\.json$/.test(file))
  .sort();

if (files.length === 0) {
  throw new Error("No passport visa datasets found in src/data/visa.");
}

const passports = files.map((file) => file.slice(0, 2));
const destinations = Array.isArray(source.destinations) ? source.destinations : [];
const records = {};

for (const file of files) {
  const passport = file.slice(0, 2);
  const rows = JSON.parse(readFileSync(join(dataDirectory, file), "utf8"));
  const byDestination = {};

  for (const row of rows) {
    if (row.passport !== passport) {
      throw new Error(`${file} contains a record for passport ${row.passport}.`);
    }
    if (row.destination in byDestination) {
      throw new Error(`${file} contains duplicate destination ${row.destination}.`);
    }
    byDestination[row.destination] = {
      status: row.status,
      maxStayDays: row.maxStayDays ?? null,
      confidence: row.confidence,
      lastVerified: row.lastVerified ?? null,
      sourceVerifiedOn: row.sourceVerifiedOn ?? null,
      importedOn: row.importedOn ?? null,
    };
  }

  records[passport] = byDestination;
}

const summary = {
  generatedFrom: {
    dataset: source.name,
    version: source.version,
    commit: source.commit,
    importedAt: source.importedAt,
  },
  passports,
  destinations,
  records,
};

writeFileSync(summaryPath, `${JSON.stringify(summary)}\n`);

const rowCount = Object.values(records).reduce(
  (sum, byDestination) => sum + Object.keys(byDestination).length,
  0,
);

console.log(
  `Visa summary: ${passports.length} passports, ${destinations.length} destinations, ${rowCount} rows.`,
);
