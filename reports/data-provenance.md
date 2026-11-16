# Visa data provenance

Generated 2026-11-16. Source of truth: `src/data/visa/source.json`, `src/data/visa/SOURCE.md`, `src/data/visa/schema.mjs`, `scripts/validate-visa-data.mjs`, `scripts/launch-check.mjs`.

## Dataset

| Field | Value |
| --- | --- |
| Name | TravelRequirements.info — Entry Requirements Dataset |
| Publisher | AXG Sp. z o.o. |
| Repository | https://github.com/travel-requirements/entry-requirements |
| Pinned commit | `a566cc4c396f5da50c9235ba48cac860f2fff525` |
| Dataset version | `1.3.0` |
| Licence | CC BY 4.0 |
| Import date | `2026-11-14` |
| Coverage imported | 199 passports × 17 destinations = **3,383 rows** |

### Required attribution

> TravelRequirements.info — Entry Requirements Dataset, AXG Sp. z o.o., https://travelrequirements.info/data/ (CC BY 4.0)

Visa Expeditor maps this dataset into its own schema, subsets it to supported
destinations, and adds its own verification labels. Visa Expeditor is not
endorsed by AXG Sp. z o.o. or TravelRequirements.info.

### Upstream source and terms

The dataset does not own the entry rules; it compiles them from **official
government sources**. Every row carries a `source` whose `sourceLevel` is either
`row` (the fact comes from a specific official page) or `policy` (the fact comes
from a general policy statement). The provider's own terms (its `LICENSE` /
`NOTICE.md`) license the **compilation** — schema, matrix, editorial text, and
the source/verification trail — under **CC BY 4.0**. The underlying entry rules
are government facts and are not owned by the provider.

CC BY 4.0 requires credit to the creator, a link to the licence, and an
indication of changes. Visa Expeditor satisfies this with a **"Data source and
attribution"** block rendered in the visa-checker footer
(`src/components/data-source-attribution.tsx`) and on the `/disclaimer` page in
`en`, `es`, and `fr`. It names the dataset, the creator, the source link
(`https://travelrequirements.info/data/`) and the licence link
(`https://creativecommons.org/licenses/by/4.0/`), and states the changes made
(reformatted to our schema, subset to supported destinations, added verification
labels).

### Supported destinations

`AU, CA, CH, DE, ES, FR, GB, IE, IT, JP, KR, MX, NL, NZ, SG, TH, AE`

## Provenance model

Every displayed row carries provenance. Imported rows are **not** labelled as
independently verified.

| Field | Meaning |
| --- | --- |
| `confidence` | `imported` \| `verified` (row trust level) |
| `sourceUrl` | Official source the row is based on |
| `sourceName` | Human-readable source label |
| `sourceType` | e.g. `government` |
| `sourceLevel` | `row` \| `policy` (granularity of the source) |
| `sourceRequirement` | Source's own requirement code (e.g. `visa-on-arrival`) |
| `sourceVerifiedOn` | Date the **provider** last verified the row |
| `importedOn` | Date Visa Expeditor imported the row (`2026-11-14`) |
| `lastVerified` | Date Visa Expeditor **independently** verified the row — `null` for all imported rows |
| `datasetVersion` | e.g. `travelrequirements@1.3.0+a566cc4` |
| `lastChanged` | Date the provider last changed the row |

### Enforcement

- `src/data/visa/schema.mjs` rejects an `imported` row that carries
  `lastVerified`, and requires `sourceUrl`, `datasetVersion`, `sourceVerifiedOn`
  and `importedOn`. A `verified` row must carry a `verification` object.
- `scripts/validate-visa-data.mjs` re-checks these rules on every `predev` /
  `prebuild`, and reports the imported/verified split.
- `scripts/launch-check.mjs` fails the build if any displayed row has a
  confidence outside `{verified, imported}` or if the "not independently
  verified" badge copy is missing in any locale.
- The UI shows a **"Not independently verified"** badge for every non-verified
  row (`destination-grid.tsx`, `document-checklist.tsx`, visa-checker result and
  detail), with the provider `sourceVerifiedOn` shown as the date.

## Current verification status

| Metric | Value |
| --- | --- |
| Total rows | 3,383 |
| Independently verified | **0** |
| Not independently verified | **3,383** |
| Launch corridors awaiting verification | 68 |

All 68 launch corridors are `imported` but not independently verified (see
`reports/visa-verification-queue.json`). Until a human reviewer records a
`verification` object, every row displays the "Not independently verified"
badge. The official source remains the authority.

## Generated files

- `src/data/visa/{ISO2}.json`: deterministic per-passport records. Do not hand-edit.
- `src/data/visa/source.json`: machine-readable commit, licence, attribution, import metadata.
- `src/data/visa/summary.generated.json`: compact client summary. Do not hand-edit.
- `src/data/visa/datasets.generated.ts`: static server-side dataset imports. Do not hand-edit.
- `reports/visa-coverage.json`, `reports/visa-coverage.md`: coverage and staleness.
- `reports/visa-verification-queue.json`: the 68 launch corridors awaiting verification.

## Commands

```bash
node scripts/import-travelrequirements.mjs --passports all   # re-import full matrix
npm run visa:summary        # rebuild client summary + server dataset map
npm run visa:validate       # validate schema + provenance rules
npm run visa:coverage       # rebuild coverage + verification queue
npm run launch-check        # provenance gate + route/image/env checks
```
