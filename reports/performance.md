# Performance opportunities

Generated 2026-11-16. Lighthouse 13.6.0, headless Chrome, against a local
production build (`next start -p 3000`). Localhost network, so treat numbers as
*relative* — field data (CrUX / RUM) is needed after launch.

## Scores

Measured over three runs each (localhost performance is noisy; medians below).

| Page | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/en` | 93 (79–96) | 100 | 96 | 61 |
| `/en/tools/visa-checker?passport=US&to=JP` | 87 (83–91) | 100 | 96 | 69 |

Best-practices intermittently reads 92 when the local auth backend
(`/api/auth/get-session`) returns 502 without a database — an environment
artifact, not a site defect.

SEO 61/69 is expected: `SITE_IS_PREVIEW` is true on the `vercel.app` host, so
every page emits `robots: noindex` and `robots.txt` disallows `/`. Not a perf
issue.

## Core Web Vitals

| Metric | `/en` | `/en/tools/visa-checker` |
| --- | --- | --- |
| FCP | 1.4 s | 1.4 s |
| LCP | 1.4 s | 1.4 s |
| TBT | ~360 ms | ~450 ms |
| CLS | 0 | 0 |
| Speed Index | 1.4 s | 1.4 s |
| Time to Interactive | ~6.5 s | ~6.7 s |
| TTFB | 20 ms | 90 ms |
| Total byte weight | **680 KiB** | **678 KiB** |

Byte weight fell from **1,116 / 1,114 KiB to 680 / 678 KiB** (≈ 435 KiB saved).

## Root cause of the drop (fixed)

The earlier regression (perf 87 → 83 on `/en`) had two compounding causes:

1. **The 508 KB dataset summary was shipped to the browser.**
   `src/data/visa/summary.generated.json` (508,946 bytes) was pulled into the
   client graph through `src/data/visa/index.ts`, imported by the client
   components `destination-grid.tsx` and `document-checklist.tsx`. The full
   dataset (`full.ts` → `datasets.generated.ts` → 199 JSON files) was already
   server-only, but the summary was not.
2. **Oversized logo and favicon.** `public/logo.svg` was **376 KB on disk /
   274 KB transferred** and `public/favicon.svg` was **224 KB / 163 KB**. Both
   were SVG wrappers around a base64 PNG, so `next/image` could not compress
   them.

## Fixes applied

### 1. Dataset kept out of client bundles (per-passport server fetch)

- New route `src/app/api/visa/[passport]/route.ts` — statically generated for
  every passport in `VISA_PASSPORT_CODES` (`generateStaticParams`,
  `dynamicParams = false`), served `public, max-age=31536000, immutable`.
- New hook `src/components/use-visa-records.ts` fetches `/api/visa/<code>` when
  the cookie-selected passport differs from the server-rendered one.
- `destination-grid.tsx` and `document-checklist.tsx` now take
  `initialPassport` / `initialRecords` props; the server pages
  (`src/app/[locale]/page.tsx`, `.../tools/checklist/page.tsx`) pass the US
  records, matching the `useSyncExternalStore` server snapshot (`US`), so there
  is no hydration mismatch.
- Verified: `generatedFrom` / `sourceVerifiedOn` markers are **absent** from
  every file in `.next/static/chunks` — the dataset is no longer in any client
  bundle. `curl /api/visa/GB` returns GB records.

### 2. Logo and favicon optimised

- `public/logo.png` (18 KB, 158×80), `public/favicon-32.png` (1.6 KB),
  `public/favicon-180.png` (32 KB) generated with `sharp`.
- Deleted `public/logo.svg` (376 KB) and `public/favicon.svg` (224 KB).
- `logo.tsx`, `layout.tsx` icons, and `structured-data.tsx` updated.

This is the fix responsible for the 435 KiB byte-weight reduction.

## Remaining opportunities (ranked)

### 1. Unused JavaScript (~218 KiB)

Lighthouse still estimates ~218 KiB of unused JS on `/en`, concentrated in three
shared chunks (≈ 138 KB / 118 KB / 57 KB transferred). The likely culprit is
`import * as Flags from "country-flag-icons/react/3x2"` in the destination grid,
which pulls in every flag even though only 17 destinations are supported.

**Fix:** import only the 17 destination flags by name (or `next/dynamic` the flag
component). Also `next/dynamic`-import below-the-fold interactive components
(`cta-carousel.tsx`, `comparison.tsx`, `immigration-showcase.tsx`,
`document-checklist.tsx`, `passport-validity-calculator.tsx`). This also reduces
TBT and bootup time.

### 2. Main-thread work / TBT

Main-thread work is ~3.3 s with ~1.5 s of JS bootup; TBT is 360–450 ms. Tracks
the hydration cost of the client components above. Fixing #1 should pull TBT
toward the "good" threshold (< 200 ms).

### 3. Render-blocking CSS (minor)

One stylesheet (`/_next/static/chunks/*.css`, ~12 KB) blocks first paint
(~173 ms wasted). Low priority.

### 4. Fonts

Two self-hosted `woff2` files transfer 40 KB + 37 KB, loaded with
`display: "swap"` via `next/font/google`. No external render-blocking request.
Optional: subset to Latin and drop unused weights to trim ~30–50 KB.

## Recommended order

1. Trim the flag import (cut ~150+ KB of JS; biggest remaining win).
2. Lazy-load below-the-fold client components to cut the rest of the unused JS.
3. Re-measure TBT after #1–2; target < 200 ms.
4. Optional: CSS/font trimming.
5. After launch, replace lab numbers with field data (CrUX / Vercel Speed
   Insights / Sentry RUM) — the `SITE_IS_PREVIEW` noindex also lifts SEO once the
   production host is set.
