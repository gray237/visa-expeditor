import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["en", "es", "fr"];
const MESSAGES_DIR = join(process.cwd(), "messages");

function readNamespaces(locale) {
  const dir = join(MESSAGES_DIR, locale);
  const files = readdirSync(dir).filter((file) => file.endsWith(".json")).sort();
  const namespaces = new Map();
  for (const file of files) {
    const namespace = file.replace(/\.json$/, "");
    const raw = readFileSync(join(dir, file), "utf8");
    namespaces.set(namespace, JSON.parse(raw));
  }
  return namespaces;
}

function flatten(value, prefix = "", out = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, out));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }
  out.set(prefix, value);
  return out;
}

const all = new Map(LOCALES.map((locale) => [locale, readNamespaces(locale)]));
const errors = [];
const allNamespaces = new Set();
for (const namespaces of all.values()) {
  for (const namespace of namespaces.keys()) allNamespaces.add(namespace);
}

const referenceLocale = "en";
const reference = new Map();

for (const namespace of [...allNamespaces].sort()) {
  const perLocale = new Map();
  for (const locale of LOCALES) {
    const namespaces = all.get(locale);
    if (!namespaces.has(namespace)) {
      errors.push(`[${locale}] missing namespace file: ${namespace}.json`);
      continue;
    }
    perLocale.set(locale, flatten(namespaces.get(namespace)));
  }

  const referenceKeys = perLocale.get(referenceLocale);
  if (!referenceKeys) continue;
  reference.set(namespace, referenceKeys);

  for (const [key, value] of referenceKeys) {
    if (typeof value === "string" && value.trim() === "") {
      errors.push(`[${referenceLocale}] empty string: ${namespace}.${key}`);
    }
  }

  for (const locale of LOCALES) {
    if (locale === referenceLocale) continue;
    const keys = perLocale.get(locale);
    if (!keys) continue;
    for (const key of referenceKeys.keys()) {
      if (!keys.has(key)) errors.push(`[${locale}] missing key: ${namespace}.${key}`);
    }
    for (const key of keys.keys()) {
      if (!referenceKeys.has(key)) errors.push(`[${locale}] extra key: ${namespace}.${key}`);
    }
    for (const [key, value] of keys) {
      if (typeof value === "string" && value.trim() === "") {
        errors.push(`[${locale}] empty string: ${namespace}.${key}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`i18n check failed with ${errors.length} problem(s):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const keyCount = [...reference.values()].reduce((total, keys) => total + keys.size, 0);
console.log(
  `i18n check passed: ${LOCALES.length} locales, ${allNamespaces.size} namespaces, ${keyCount} keys each.`,
);
