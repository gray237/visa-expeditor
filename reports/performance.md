# Performance opportunities

Generated 2026-11-16. Lighthouse 13.6.0, headless Chrome, against a local
production build (`next start -p 3000`). Localhost network, so treat numbers as
*relative* — field data (CrUX / RUM) is needed after launch.

## Scores (two runs each)

| Page | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/en` | 83 / 90 | 100 | 96 | 61 |
| `/en/tools/visa-checker?passport=US&to=JP` | 80 / 87 | 100 | 96 | 69 |

SEO 61/69 is expected: `SITE_IS_PREVIEW` is true on the `vercel.app` host, so
every page emits `robots: noindex` and `robots.txt` disallows `/`. Not a perf
issue.

## Core Web Vitals

| Metric | `/en` | `/en/tools/visa-checker` |
| --- | --- | --- |
| FCP | 1.4 s | 1.4 s |
| LCP | 1.4 s | 1.4 s |
| TBT | 420 ms | 520 ms |
| CLS | 0 | 0 |
| Speed Index | 1.4 s | 1.4 s |
| Time to Interactive | 7.0 s | 6.9 s |
| TTFB | 20 ms | 90 ms |
| Total byte weight | 1,116 KiB | 1,114 KiB |

## Findings (ranked)

### 1. Oversized logo and favicon — highest impact

`public/logo.svg` is **376 KB on disk / 274 KB transferred** and
`public/favicon.svg` is **224 KB / 163 KB**. Both are SVG files that wrap a
base64-encoded PNG, so they are effectively uncompressed raster art. The logo
loads on every page with `priority` (`src/components/logo.tsx`) and is displayed
at `h-10` (≈ 40 px tall), while `next/image` does not optimise SVG, so the full
376 KB is shipped. The favicon is referenced from
`src/app/[locale]/layout.tsx` (`icon: "/favicon.svg"`) and
`src/components/structured-data.tsx`.

**Fix:** export the brand mark as a real vector SVG, or a tightly cropped
PNG/WebP sized to ~2× the display box (≈ 160 px tall for the header). Target
< 20 KB. Replace the favicon with a 32/48 px `.ico`/`.png` or a compact SVG.
Expected saving ≈ 400+ KB and a direct LCP/byte-weight win.

### 2. Unused JavaScript (~218 KiB)

Lighthouse estimates **218 KiB** of unused JS on `/en`, concentrated in three
chunks (104 KB, 65 KB, 49 KB). The site has **25 client components**; several are
below the fold or only needed on interaction.

**Fix:** convert leaf components back to Server Components where possible, and
`next/dynamic`-import heavy interactive pieces that are not needed for first
paint (`cta-carousel.tsx`, `comparison.tsx`, `immigration-showcase.tsx`,
`document-checklist.tsx`, `passport-validity-calculator.tsx`). This also reduces
TBT and bootup time.

### 3. Main-thread work / TBT

Main-thread work is ~3.3 s with ~1.5 s of JS bootup; TBT is 420–520 ms. This
tracks the hydration cost of the client components above. Fixing #2 should pull
TBT toward the "good" threshold (< 200 ms).

### 4. Render-blocking CSS (minor)

One stylesheet (`/_next/static/chunks/*.css`, 12.2 KB) blocks first paint
(~173 ms wasted). Low priority; consider inlining critical CSS or splitting
per-route CSS if it persists on production hardware.

### 5. Fonts

Two self-hosted `woff2` files transfer 40 KB + 37 KB, loaded with
`display: "swap"` via `next/font/google` (Fraunces, IBM Plex Sans, IBM Plex
Mono). No external render-blocking request. Optional: subset to Latin and drop
unused weights to trim ~30–50 KB.

### 6. Network dependency tree (score 0)

The longest chain is document → CSS (~125 ms) locally. Re-check on production;
usually resolved by the CSS fix in #4.

## Recommended order

1. Optimise `logo.svg` and `favicon.svg` (biggest, easiest win).
2. Lazy-load below-the-fold client components to cut ~218 KB of JS.
3. Re-measure TBT after #2; target < 200 ms.
4. Optional: CSS/font trimming.
5. After launch, replace lab numbers with field data (CrUX / Vercel Speed
   Insights / Sentry RUM) — the `SITE_IS_PREVIEW` noindex also lifts SEO once the
   production host is set.
