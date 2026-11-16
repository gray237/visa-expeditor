import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIRECTORY = join(process.cwd(), "src/data/visa");
const DESTINATIONS_PATH = join(DATA_DIRECTORY, "destinations.generated.json");
const OUTPUT_PATH = join(DATA_DIRECTORY, "destinations.aggregate.json");

const STATUS_BUCKETS = {
  visa_free: "visaFree",
  freedom_of_movement: "visaFree",
  evisa: "electronic",
  eta: "electronic",
  visa_on_arrival: "voa",
  visa_required: "embassy",
  travel_permit: "embassy",
  not_admitted: "embassy",
  unknown: "embassy",
};

const profiles = JSON.parse(readFileSync(DESTINATIONS_PATH, "utf8"));
const destinationCodes = Object.keys(profiles);

const aggregates = {};
for (const code of destinationCodes) {
  aggregates[code] = {
    name: profiles[code].name ?? null,
    region: profiles[code].region ?? null,
    summary: profiles[code].summary ?? null,
    visaFree: 0,
    electronic: 0,
    voa: 0,
    embassy: 0,
    totalPassports: 0,
  };
}

for (const file of readdirSync(DATA_DIRECTORY)) {
  const match = file.match(/^([A-Z]{2})\.json$/);
  if (!match) continue;
  const passport = match[1];
  if (!/^[A-Z]{2}$/.test(passport)) continue;

  let records;
  try {
    records = JSON.parse(readFileSync(join(DATA_DIRECTORY, file), "utf8"));
  } catch {
    continue;
  }

  for (const record of records) {
    const dest = record.destination;
    if (!aggregates[dest]) continue;
    aggregates[dest].totalPassports += 1;
    const bucket = STATUS_BUCKETS[record.status];
    if (bucket) aggregates[dest][bucket] += 1;
  }
}

mkdirSync(DATA_DIRECTORY, { recursive: true });
writeFileSync(OUTPUT_PATH, `${JSON.stringify(aggregates, null, 2)}\n`);

let totalDest = 0;
let totalRecords = 0;
for (const code of destinationCodes) {
  totalDest += 1;
  totalRecords += aggregates[code].totalPassports;
}
console.log(
  `Built destination aggregates: ${totalDest} destinations, ${totalRecords} passport rows.`,
);
console.log(`Wrote ${OUTPUT_PATH}`);
