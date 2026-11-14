# Visa data source and provenance

## Dataset

- Name: TravelRequirements.info — Entry Requirements Dataset
- Publisher: AXG Sp. z o.o.
- Repository: https://github.com/travel-requirements/entry-requirements
- Pinned commit: `a566cc4c396f5da50c9235ba48cac860f2fff525`
- Dataset version: `1.3.0`
- Licence: CC BY 4.0
- Import date: `2026-11-14`
- Coverage imported: 199 passports × 17 destinations = 3,383 rows

## Required attribution

> TravelRequirements.info — Entry Requirements Dataset, AXG Sp. z o.o., https://travelrequirements.info/data/ (CC BY 4.0)

Modification note: Visa Expeditor maps this dataset into its own schema, subsets it to supported destinations, and adds its own verification labels. Visa Expeditor is not endorsed by AXG Sp. z o.o. or TravelRequirements.info.

Licence: https://creativecommons.org/licenses/by/4.0/

## Confidence labels

- `imported`: the dataset provider recorded an official source and verification date. Visa Expeditor has not independently verified the row.
- `verified`: Visa Expeditor reviewed the official source and recorded a reviewer, date, method and notes in the row’s `verification` object.
- `sample`: placeholder data. Do not display sample rows as sourced data.

Imported rows are never labelled “independently verified.” The official source remains the authority.

## Supported destinations

`AU, CA, CH, DE, ES, FR, GB, IE, IT, JP, KR, MX, NL, NZ, SG, TH, AE`

## Generated files

- `src/data/visa/{ISO2}.json`: deterministic per-passport records. Do not hand-edit.
- `src/data/visa/source.json`: machine-readable commit, licence, attribution and import metadata.
- `reports/visa-coverage.json`: coverage, provenance and staleness report.
- `reports/visa-verification-queue.json`: the 68 launch corridors awaiting independent verification.
- `reports/visa-coverage.md`: human-readable coverage summary.

## Commands

```bash
# Re-import the full launch matrix from the pinned dataset
node scripts/import-travelrequirements.mjs --passports all

# Import only the four launch passports
node scripts/import-travelrequirements.mjs --passports US,GB,CA,AU

# Validate all passport files
npm run visa:validate

# Rebuild coverage and the verification queue
npm run visa:coverage
```

To use already-downloaded destination JSON, add `--source-dir <directory>`. The importer otherwise downloads files into `.cache/travelrequirements`.

## Refresh policy

- Re-import monthly and review the dataset changelog.
- Re-verify the 68 launch corridors against official sources before launch.
- Re-verify top corridors weekly after launch.
- Flag stale rows in coverage and in the UI.
- Reproduce a row’s source by opening `sourceUrl` and checking `lastVerified`, `lastChanged` and `sourceLevel`.

## Caveats

- About 39,391 rows rest on destination policy-level sources; about 210 rows are individually cited.
- A missing optional field means “not researched,” not “not required.”
- Some sources are official but second-hand: one government describing another country’s rules.
- Source verification dates are not import dates.
- Immigration rules change without notice. Border authorities make the final decision.
