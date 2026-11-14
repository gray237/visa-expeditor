import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { VisaDatasetSchema } from "../src/data/visa/schema.mjs";

const dataDirectory = join(process.cwd(), "src/data/visa");
const files = readdirSync(dataDirectory).filter((file) => /^[A-Z]{2}\.json$/.test(file));

if (files.length === 0) {
  throw new Error("No passport visa datasets found in src/data/visa.");
}

let count = 0;
for (const file of files) {
  const rows = JSON.parse(readFileSync(join(dataDirectory, file), "utf8"));
  const parsed = VisaDatasetSchema.parse(rows);
  const passport = file.slice(0, 2);

  if (parsed.some((row) => row.passport !== passport)) {
    throw new Error(`${file} contains a record for a different passport.`);
  }
  count += parsed.length;
}

console.log(`Visa data valid: ${files.length} passport files, ${count} records.`);
