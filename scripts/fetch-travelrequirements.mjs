import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMMIT = "a566cc4c396f5da50c9235ba48cac860f2fff525";
const CACHE = join(process.cwd(), ".cache/travelrequirements");
const LISTING = join(CACHE, "_listing.json");
const LOG = join(CACHE, "_fetch.log");
const CONCURRENCY = Number(process.env.TR_CONCURRENCY ?? 12);
const MAX_ATTEMPTS = 4;

mkdirSync(CACHE, { recursive: true });

function log(message) {
  const line = `${new Date().toISOString()} ${message}\n`;
  appendFileSync(LOG, line);
  process.stdout.write(line);
}

async function listSlugs() {
  if (existsSync(LISTING)) {
    try {
      const cached = JSON.parse(readFileSync(LISTING, "utf8"));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch {
      // re-fetch
    }
  }
  const url = `https://api.github.com/repos/travel-requirements/entry-requirements/contents/destinations?ref=${COMMIT}`;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "visa-expeditor-import" },
        signal: AbortSignal.timeout(300_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const entries = await response.json();
      const slugs = entries
        .filter((entry) => entry.type === "file" && entry.name.endsWith(".json"))
        .map((entry) => entry.name.slice(0, -5));
      writeFileSync(LISTING, JSON.stringify(slugs));
      return slugs;
    } catch (error) {
      log(`list attempt ${attempt} failed: ${error.message}`);
      if (attempt < 6) await new Promise((r) => setTimeout(r, 4_000));
    }
  }
  throw new Error("Could not list destination files.");
}

async function download(slug) {
  const target = join(CACHE, `${slug}.json`);
  if (existsSync(target)) {
    try {
      JSON.parse(readFileSync(target, "utf8"));
      return "cached";
    } catch {
      // fall through and re-download
    }
  }
  const url = `https://raw.githubusercontent.com/travel-requirements/entry-requirements/${COMMIT}/destinations/${slug}.json`;
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(300_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      JSON.parse(text);
      writeFileSync(target, text);
      return "ok";
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 3_000));
      }
    }
  }
  throw lastError;
}

async function pool(items, worker, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        try {
          results[index] = await worker(items[index]);
        } catch (error) {
          results[index] = `FAIL:${error.message}`;
        }
      }
    }),
  );
  return results;
}

const slugs = await listSlugs();
log(`Found ${slugs.length} destination files.`);

const results = await pool(slugs, download, CONCURRENCY);
const ok = slugs.filter((_, i) => results[i] === "ok").length;
const cached = slugs.filter((_, i) => results[i] === "cached").length;
const failed = slugs.filter((_, i) => typeof results[i] === "string" && results[i].startsWith("FAIL"));

log(`ok=${ok} cached=${cached} failed=${failed.length}`);
if (failed.length) {
  log(`failed slugs: ${failed.join(", ")}`);
}
