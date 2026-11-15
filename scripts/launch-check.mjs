import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const strict = process.env.LAUNCH_STRICT === "1";
const errors = [];
const warnings = [];
const passed = [];

function pass(message) {
  passed.push(message);
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function walk(directory, extensionPattern, files = []) {
  if (!existsSync(directory)) return files;
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      walk(path, extensionPattern, files);
    } else if (extensionPattern.test(entry)) {
      files.push(path);
    }
  }
  return files;
}

function flattenEntries(value, prefix = "", output = []) {
  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flattenEntries(child, next, output);
    } else {
      output.push({ key: next, value: child });
    }
  }
  return output;
}

function checkLocaleParity() {
  const locales = ["en", "es", "fr"];
  const messagesRoot = join(root, "messages");
  if (!existsSync(messagesRoot)) {
    fail("messages/ directory is missing.");
    return;
  }

  const keySets = new Map();
  for (const locale of locales) {
    const directory = join(messagesRoot, locale);
    if (!existsSync(directory)) {
      fail(`messages/${locale}/ is missing.`);
      continue;
    }

    const keys = new Set();
    for (const file of readdirSync(directory).filter((entry) => entry.endsWith(".json"))) {
      const namespace = file.replace(/\.json$/, "");
      const content = readJson(join(directory, file));
      for (const { key, value } of flattenEntries(content)) {
        const fullKey = `${namespace}.${key}`;
        keys.add(fullKey);
        if (typeof value === "string" && value.trim() === "") {
          fail(`Empty ${locale} string: ${fullKey}`);
        }
      }
    }
    keySets.set(locale, keys);
  }

  const reference = keySets.get("en");
  if (!reference) return;
  for (const locale of locales.filter((code) => code !== "en")) {
    const keys = keySets.get(locale);
    if (!keys) continue;
    const missing = [...reference].filter((key) => !keys.has(key));
    const extra = [...keys].filter((key) => !reference.has(key));
    if (missing.length > 0) {
      fail(`${locale} is missing ${missing.length} keys, e.g. ${missing.slice(0, 3).join(", ")}`);
    }
    if (extra.length > 0) {
      fail(`${locale} has ${extra.length} unexpected keys, e.g. ${extra.slice(0, 3).join(", ")}`);
    }
  }

  if (errors.length === 0) pass(`Locale parity: ${reference.size} keys in en/es/fr.`);
}

function checkVisaValidation() {
  const result = spawnSync(process.execPath, ["scripts/validate-visa-data.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (result.status !== 0) {
    fail(`Visa data validation failed: ${output.split("\n").at(-1) ?? "unknown error"}`);
  } else {
    pass(output.split("\n")[0] ?? "Visa data valid.");
  }
}

function checkStatusKeys() {
  const dataDirectory = join(root, "src/data/visa");
  const files = readdirSync(dataDirectory).filter((file) => /^[A-Z]{2}\.json$/.test(file));
  const statuses = new Set();
  const confidenceCounts = {};
  const unbadegable = [];

  for (const file of files) {
    const rows = readJson(join(dataDirectory, file));
    for (const row of rows) {
      statuses.add(row.status);
      confidenceCounts[row.confidence] = (confidenceCounts[row.confidence] ?? 0) + 1;
      if (row.confidence !== "verified" && row.confidence !== "imported") {
        unbadegable.push(`${row.passport}:${row.destination}`);
      }
    }
  }

  for (const locale of ["en", "es", "fr"]) {
    const messages = readJson(join(root, "messages", locale, "visaChecker.json"));
    const labelKeys = messages.statuses ?? {};
    const missing = [...statuses].filter((status) => !labelKeys[status]);
    if (missing.length > 0) {
      fail(`${locale} is missing status labels: ${missing.join(", ")}`);
    }
    if (!messages.notIndependentlyVerified || !messages.verifiedBadge) {
      fail(`${locale} is missing the provenance badge labels.`);
    }
  }
  pass(`Status labels: all ${statuses.size} dataset statuses localised.`);

  if (unbadegable.length > 0) {
    fail(
      `${unbadegable.length} displayed rows would render without a provenance badge (e.g. ${unbadegable.slice(0, 3).join(", ")}).`,
    );
  } else {
    const verified = confidenceCounts.verified ?? 0;
    const imported = confidenceCounts.imported ?? 0;
    pass(
      `Provenance badges: all ${verified + imported} displayed rows badged (${verified} independently verified, ${imported} not independently verified).`,
    );
  }
}

function checkCoverageReport() {
  const path = join(root, "reports/visa-coverage.json");
  if (!existsSync(path)) {
    warn("reports/visa-coverage.json is missing; run npm run visa:coverage.");
    return;
  }
  const report = readJson(path);
  if (report.errors?.length) {
    fail(`Coverage report has ${report.errors.length} errors.`);
  }
  if (report.launch?.pending > 0) {
    warn(
      `${report.launch.pending}/${report.launch.total} launch corridors are imported but not independently verified.`,
    );
  } else {
    pass("All launch corridors are independently verified.");
  }
  if (report.stale?.count > 0) {
    warn(`${report.stale.count} visa rows are stale.`);
  }
}

function checkImages() {
  const placeholderDirectory = join(root, "public/images/placeholders");
  const finalDirectory = join(root, "public/images/final");
  if (!existsSync(placeholderDirectory)) {
    fail("public/images/placeholders/ is missing.");
    return;
  }

  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
  const finals = existsSync(finalDirectory) ? readdirSync(finalDirectory) : [];
  const missing = [];
  let blocking = 0;

  const isBlockingSlot = (slot) =>
    !slot.startsWith("team.") &&
    !slot.startsWith("article.") &&
    !slot.startsWith("destination.") &&
    slot !== "hero.background" &&
    slot !== "og.default";

  for (const file of readdirSync(placeholderDirectory)) {
    if (!file.endsWith(".svg")) continue;
    const slot = file.replace(/\.svg$/, "");
    if (!isBlockingSlot(slot)) continue;
    blocking += 1;
    if (!extensions.some((extension) => finals.includes(`${slot}${extension}`))) {
      missing.push(slot);
    }
  }

  if (missing.length > 0) {
    warn(
      `${missing.length}/${blocking} launch-blocking image slots still use placeholders (e.g. ${missing.slice(0, 3).join(", ")}).`,
    );
  } else {
    pass(`All ${blocking} launch-blocking image slots have final files.`);
  }
}

function checkRoutes() {
  const routes = [
    "src/app/[locale]/page.tsx",
    "src/app/[locale]/about/page.tsx",
    "src/app/[locale]/contact/page.tsx",
    "src/app/[locale]/resources/page.tsx",
    "src/app/[locale]/passports/page.tsx",
    "src/app/[locale]/visas/page.tsx",
    "src/app/[locale]/immigration/page.tsx",
    "src/app/[locale]/tools/page.tsx",
    "src/app/[locale]/tools/checklist/page.tsx",
    "src/app/[locale]/tools/idp/page.tsx",
    "src/app/[locale]/tools/passport-validity/page.tsx",
    "src/app/[locale]/tools/visa-checker/page.tsx",
    "src/app/[locale]/start/page.tsx",
    "src/app/[locale]/dashboard/page.tsx",
    "src/app/[locale]/privacy/page.tsx",
    "src/app/[locale]/terms/page.tsx",
    "src/app/[locale]/disclaimer/page.tsx",
    "src/app/[locale]/cookies/page.tsx",
    "src/app/[locale]/accessibility/page.tsx",
    "src/app/api/health/route.ts",
    "src/app/robots.ts",
    "src/app/sitemap.ts",
  ];
  const missing = routes.filter((route) => !existsSync(join(root, route)));
  if (missing.length > 0) {
    fail(`Missing route files: ${missing.join(", ")}`);
  } else {
    pass(`Route manifest: ${routes.length} required routes present.`);
  }
}

function checkPlaceholderStrings() {
  const files = [
    ...walk(join(root, "src/app"), /\.(tsx|ts)$/),
    ...walk(join(root, "src/components"), /\.(tsx|ts)$/),
  ];
  const hits = [];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    if (/\bPLACEHOLDER\b/.test(content)) {
      hits.push(file.replace(`${root}/`, ""));
    }
  }
  if (hits.length > 0) {
    warn(`Placeholder marker strings remain in ${hits.length} source files: ${hits.slice(0, 3).join(", ")}`);
  } else {
    pass("No PLACEHOLDER marker strings in rendered source.");
  }
}

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    values[key] = value;
  }
  return values;
}

function checkEnvironment() {
  const required = [
    "NEXT_PUBLIC_SITE_URL",
    "NEON_AUTH_BASE_URL",
    "NEON_AUTH_COOKIE_SECRET",
    "DATABASE_URL",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "TEAM_EMAIL",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "TURNSTILE_SECRET_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "NEXT_PUBLIC_SENTRY_DSN",
  ];
  const fileValues = {
    ...parseEnvFile(join(root, ".env.example")),
    ...parseEnvFile(join(root, ".env.local")),
  };
  const missing = required.filter((key) => {
    const value = process.env[key] ?? fileValues[key];
    return !value || value.trim() === "";
  });
  if (missing.length > 0) {
    warn(`Environment values unset in this checkout: ${missing.join(", ")}.`);
  } else {
    pass("All launch-related environment values are set.");
  }
}

checkLocaleParity();
checkVisaValidation();
checkStatusKeys();
checkCoverageReport();
checkImages();
checkRoutes();
checkPlaceholderStrings();
checkEnvironment();

console.log(`\nLaunch check (${strict ? "strict" : "report-only"})\n`);
for (const message of passed) console.log(`  PASS  ${message}`);
for (const message of warnings) console.log(`  WARN  ${message}`);
for (const message of errors) console.log(`  FAIL  ${message}`);

const failed = errors.length > 0 || (strict && warnings.length > 0);
console.log(
  `\n${passed.length} passed, ${warnings.length} warnings, ${errors.length} errors.`,
);
if (failed) {
  console.log("Launch check failed.");
  process.exitCode = 1;
} else {
  console.log("Launch check passed.");
}
