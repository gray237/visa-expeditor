# Visa coverage report

Generated from TravelRequirements.info dataset `1.3.0` at commit `a566cc4c396f5da50c9235ba48cac860f2fff525` (imported 2026-11-14).

## Summary

- Expected: 199 passports × 17 destinations = 3383 rows.
- Actual: 199 passport files, 3383 rows, 17 destinations.
- Launch corridors: 68; verified 0; pending 68.
- Stale rows: 0 (threshold 180 days).
- Errors: 0; warnings: 1.

## Status counts

| Status | Rows |
|---|---:|
| visa_required | 1383 |
| visa_free | 858 |
| evisa | 533 |
| eta | 320 |
| freedom_of_movement | 229 |
| visa_on_arrival | 57 |
| unknown | 2 |
| not_admitted | 1 |

## Launch verification queue

| # | Priority | Corridor | Status | Source level | Last verified | Source |
|---:|---|---|---|---|---|---|
| 1 | medium | US → AE | visa_on_arrival | row | 2026-10-13 | [source](https://www.uae-embassy.org/visas-us-citizens) |
| 2 | medium | US → AU | eta | row | 2026-10-13 | [source](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601) |
| 3 | medium | US → GB | eta | row | 2026-10-13 | [source](https://www.gov.uk/eta) |
| 4 | medium | US → NZ | eta | policy | 2026-10-13 | [source](https://www.immigration.govt.nz/visas/new-zealand-electronic-travel-authority-nzeta/) |
| 5 | medium | GB → AE | visa_on_arrival | row | 2026-10-13 | [source](https://www.visitdubai.com/en/plan-your-trip/visa-information) |
| 6 | medium | GB → AU | eta | row | 2026-10-13 | [source](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651) |
| 7 | medium | GB → CA | eta | row | 2026-10-13 | [source](https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/facts.html) |
| 8 | medium | GB → NZ | eta | policy | 2026-10-13 | [source](https://www.immigration.govt.nz/visas/new-zealand-electronic-travel-authority-nzeta/) |
| 9 | medium | CA → AE | visa_on_arrival | row | 2026-10-13 | [source](https://www.visitdubai.com/en/plan-your-trip/visa-information) |
| 10 | medium | CA → AU | eta | row | 2026-10-13 | [source](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601) |
| 11 | medium | CA → GB | eta | row | 2026-10-13 | [source](https://www.gov.uk/eta) |
| 12 | medium | CA → NZ | eta | policy | 2026-10-13 | [source](https://www.immigration.govt.nz/visas/new-zealand-electronic-travel-authority-nzeta/) |
| 13 | medium | AU → AE | visa_on_arrival | row | 2026-10-13 | [source](https://www.visitdubai.com/en/plan-your-trip/visa-information) |
| 14 | medium | AU → CA | eta | row | 2026-10-13 | [source](https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta/facts.html) |
| 15 | medium | AU → GB | eta | row | 2026-10-13 | [source](https://www.gov.uk/eta) |
| 16 | low | US → CA | visa_free | row | 2026-10-13 | [source](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2002-227/section-183.html) |
| 17 | low | US → CH | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 18 | low | US → DE | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 19 | low | US → ES | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 20 | low | US → FR | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 21 | low | US → IE | visa_free | row | 2026-10-13 | [source](https://www.irishimmigration.ie/coming-to-visit-ireland/visit-ireland-travel-path/) |
| 22 | low | US → IT | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 23 | low | US → JP | visa_free | row | 2026-10-13 | [source](https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html) |
| 24 | low | US → KR | visa_free | row | 2026-10-13 | [source](https://www.k-eta.go.kr/portal/guide/viewetaalification.do) |
| 25 | low | US → MX | visa_free | row | 2026-10-13 | [source](https://www.gob.mx/inm/documentos/paises-y-regiones-que-no-requieren-visa-para-viajar-a-mexico) |
| 26 | low | US → NL | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 27 | low | US → SG | visa_free | row | 2026-10-15 | [source](https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Singapore.html) |
| 28 | low | US → TH | visa_free | policy | 2026-10-13 | [source](https://washingtondc.thaiembassy.org/en/page/visaexempt-voajul2024) |
| 29 | low | GB → CH | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 30 | low | GB → DE | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 31 | low | GB → ES | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 32 | low | GB → FR | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 33 | low | GB → GB | freedom_of_movement | row | 2026-10-13 | [source](https://www.un.org/en/about-us/universal-declaration-of-human-rights) |
| 34 | low | GB → IE | freedom_of_movement | row | 2026-10-13 | [source](https://www.gov.uk/foreign-travel-advice/ireland/entry-requirements) |
| 35 | low | GB → IT | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 36 | low | GB → JP | visa_free | policy | 2026-10-13 | [source](https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html) |
| 37 | low | GB → KR | visa_free | row | 2026-10-13 | [source](https://www.k-eta.go.kr/portal/guide/viewetaalification.do) |
| 38 | low | GB → MX | visa_free | row | 2026-10-13 | [source](https://www.gob.mx/inm/documentos/paises-y-regiones-que-no-requieren-visa-para-viajar-a-mexico) |
| 39 | low | GB → NL | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 40 | low | GB → SG | visa_free | row | 2026-10-13 | [source](https://www.gov.uk/foreign-travel-advice/singapore/entry-requirements) |
| 41 | low | GB → TH | visa_free | policy | 2026-10-13 | [source](https://washingtondc.thaiembassy.org/en/page/visaexempt-voajul2024) |
| 42 | low | CA → CA | freedom_of_movement | row | 2026-10-13 | [source](https://www.un.org/en/about-us/universal-declaration-of-human-rights) |
| 43 | low | CA → CH | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 44 | low | CA → DE | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 45 | low | CA → ES | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 46 | low | CA → FR | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 47 | low | CA → IE | visa_free | row | 2026-10-13 | [source](https://www.irishimmigration.ie/coming-to-visit-ireland/visit-ireland-travel-path/) |
| 48 | low | CA → IT | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 49 | low | CA → JP | visa_free | row | 2026-10-13 | [source](https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html) |
| 50 | low | CA → KR | visa_free | row | 2026-10-13 | [source](https://www.k-eta.go.kr/portal/guide/viewetaalification.do) |
| 51 | low | CA → MX | visa_free | row | 2026-10-13 | [source](https://www.gob.mx/inm/documentos/paises-y-regiones-que-no-requieren-visa-para-viajar-a-mexico) |
| 52 | low | CA → NL | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 53 | low | CA → SG | visa_free | row | 2026-10-13 | [source](https://travel.gc.ca/destinations/singapore) |
| 54 | low | CA → TH | visa_free | policy | 2026-10-13 | [source](https://washingtondc.thaiembassy.org/en/page/visaexempt-voajul2024) |
| 55 | low | AU → AU | freedom_of_movement | row | 2026-10-13 | [source](https://www.un.org/en/about-us/universal-declaration-of-human-rights) |
| 56 | low | AU → CH | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 57 | low | AU → DE | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 58 | low | AU → ES | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 59 | low | AU → FR | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 60 | low | AU → IE | visa_free | row | 2026-10-13 | [source](https://www.irishimmigration.ie/coming-to-visit-ireland/visit-ireland-travel-path/) |
| 61 | low | AU → IT | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 62 | low | AU → JP | visa_free | row | 2026-10-13 | [source](https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html) |
| 63 | low | AU → KR | visa_free | row | 2026-10-13 | [source](https://www.k-eta.go.kr/portal/guide/viewetaalification.do) |
| 64 | low | AU → MX | visa_free | row | 2026-10-13 | [source](https://www.gob.mx/inm/documentos/paises-y-regiones-que-no-requieren-visa-para-viajar-a-mexico) |
| 65 | low | AU → NL | visa_free | policy | 2026-10-13 | [source](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02018R1806-20251230) |
| 66 | low | AU → NZ | visa_free | policy | 2026-10-13 | [source](https://www.immigration.govt.nz/visas/new-zealand-electronic-travel-authority-nzeta/) |
| 67 | low | AU → SG | visa_free | row | 2026-10-13 | [source](https://canberra.mfa.gov.sg/consular-services/visa-information/) |
| 68 | low | AU → TH | visa_free | policy | 2026-10-13 | [source](https://washingtondc.thaiembassy.org/en/page/visaexempt-voajul2024) |

## Errors

None.

## Warnings

- 68 launch corridors still need independent verification.
