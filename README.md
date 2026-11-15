# Visa Expeditor

Trilingual (EN / ES / FR) passport, visa and immigration help site built with
Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Neon Auth
(Managed Better Auth), Resend and next-intl.

## Requirements

- Node.js 20+ (see `.nvmrc` if present)
- npm

## Local development

```bash
cp .env.example .env.local   # fill in what you have
npm install
npm run dev
```

Open http://localhost:3000 — the default locale (`en`) is served from `/`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run i18n:check` | Locale key parity + empty-string check |
| `npm run visa:validate` | Validate all passport visa-data JSON files |
| `npm run visa:coverage` | Rebuild coverage and the 68-corridor verification queue |
| `npm run visa:summary` | Rebuild the checker summary from the passport JSON files |
| `npm run visa:import -- ./visa-data.csv` | Validate a CSV and write one JSON file per passport |
| `npm run visa:import:travelrequirements` | Re-import the pinned TravelRequirements dataset |
| `npm run launch-check` | Report launch blockers (warns; `LAUNCH_STRICT=1` fails) |
| `npm run images:placeholders` | Regenerate placeholder images |
| `npm run images:manifest` | Rebuild the image manifest and `reports/image-shot-list.md` |

## Project structure

```
messages/{locale}/{namespace}.json   All user-facing copy (en/es/fr)
src/app/[locale]/                    Routes (App Router)
src/components/                      UI components
src/content/                         Typed page content configs
src/data/visa/                       Imported visa datasets + generated summaries
src/i18n/                            next-intl routing, navigation, messages
src/lib/                             Data, helpers, image slots
src/proxy.ts                         next-intl proxy (Next 16)
scripts/                             i18n, image and launch checks
public/images/                       Placeholders + final images
```

## Rules of the road

- Every user-facing string lives in `messages/{locale}/`, never in components.
  Add keys to all three locales in the same change; `npm run i18n:check` must
  pass.
- Import `Link`, `useRouter`, `usePathname` from `@/i18n/navigation`.
- Keep `src/i18n/request.ts` on static imports (Turbopack panics on dynamic
  template-literal imports).
- Never create `middleware.ts`; Next 16 uses `src/proxy.ts`.
- Images go through the slot system (`src/lib/image-slots.ts` +
  `getImage(slot)`), never hotlinked.
- Unknown facts stay hidden behind config/env vars. Imported visa rows are
  labelled source-verified; only independently reviewed rows may say verified.
- Run `rm -rf .next` after moving or renaming files.

See `BLOCKERS.md` for owner-only items and `ROADMAP` notes in the repo root.

## Visa data

The checker reads `src/data/visa/{PASSPORT}.json`: 199 passports x 17 supported
destinations (3,383 imported rows) from the pinned TravelRequirements.info
dataset. Provenance, attribution and refresh policy live in
`src/data/visa/SOURCE.md`. Imported rows always keep an official source URL, the
dataset verification date and `confidence: "imported"`; only a manual review may
upgrade a row to `"verified"`.

`scripts/build-visa-summary.mjs` writes `summary.generated.json` (compact data
used by the client selectors) and `datasets.generated.ts` (full server-side
data). Neither file is hand-edited. Validation and summary generation run before
`next dev` and `next build`.

The CSV importer expects the record field names plus `processing` as `instant`,
`min-max` days, or blank. Blank nullable fields are written as `null`; verified
rows must include `sourceUrl`, `lastVerified` and a `verification` object.

Before launch, verify the 68 launch corridors (US, GB, CA, AU x 17 destinations)
against official sources and update `reports/visa-verification-queue.json`.
`npm run launch-check` reports remaining gaps.
