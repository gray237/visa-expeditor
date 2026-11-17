import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "src", "data", "visa");
const source = JSON.parse(readFileSync(join(dataDir, "source.json"), "utf8"));
const destinationCodes = new Set(source.destinations);

const APPEAL = {
  GB: 100,
  FR: 99,
  IT: 98,
  US: 97,
  CA: 96,
  JP: 95,
  MX: 94,
  TH: 93,
  AE: 92,
  SG: 91,
  AU: 90,
  NZ: 89,
  ES: 88,
  DE: 87,
  KR: 86,
  NL: 85,
  IE: 84,
  CH: 83,
  PT: 82,
  TR: 81,
  MY: 80,
  ID: 79,
  VN: 78,
  PH: 77,
  IN: 76,
  BR: 75,
  AR: 74,
  ZA: 73,
  EG: 72,
  MA: 71,
  GR: 70,
  AT: 69,
  SE: 68,
  NO: 67,
  DK: 66,
  FI: 65,
  IS: 64,
  IL: 63,
  QA: 62,
  SA: 61,
  KZ: 60,
  GE: 59,
  RS: 58,
  HR: 57,
  CZ: 56,
  PL: 55,
  HU: 54,
  RO: 53,
  BG: 52,
  CN: 51,
  TW: 50,
  HK: 49,
};

const STATUS_SCORE = {
  freedom_of_movement: 4,
  visa_free: 3,
  evisa: 2,
  eta: 2,
  visa_on_arrival: 2,
  travel_permit: 1,
  visa_required: 0,
  not_admitted: -5,
  unknown: -2,
};

const passportFiles = readdirSync(dataDir).filter(
  (name) => /^[A-Z]{2}\.json$/.test(name) && name !== "US.json",
);
if (!passportFiles.includes("US.json")) passportFiles.push("US.json");
passportFiles.sort();

const result = {};

for (const file of passportFiles) {
  const passport = file.slice(0, 2);
  const records = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
  const tourism = records.filter(
    (record) => record.purpose === "tourism" && destinationCodes.has(record.destination),
  );

  result[passport] = tourism
    .map((record) => {
      const appeal = APPEAL[record.destination] ?? 0;
      const access = STATUS_SCORE[record.status] ?? -2;
      const stay = Math.min(record.maxStayDays ?? 0, 90) / 90;
      return {
        code: record.destination,
        score: appeal + access * 12 + stay * 2,
        appeal,
      };
    })
    .filter((item) => item.appeal > 0)
    .sort((a, b) => b.score - a.score || b.appeal - a.appeal || a.code.localeCompare(b.code))
    .slice(0, 10)
    .map((item) => item.code);
}

writeFileSync(
  join(dataDir, "popular-destinations.generated.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);

console.log(`Wrote popular destinations for ${Object.keys(result).length} passports.`);
