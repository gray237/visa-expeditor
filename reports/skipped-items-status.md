# Status of the two previously-skipped items

Generated 2026-11-16. Both items were raised as "nice to have" and deferred;
both are now **implemented and enforced**, with evidence below.

## (a) launch-check fails if any displayed row lacks the "Not independently verified" badge

**Status: implemented and enforcing.**

`scripts/launch-check.mjs` (`checkStatusKeys`) iterates every row in
`src/data/visa/{ISO2}.json` and:

- fails when any row's `confidence` is outside `{verified, imported}` — the only
  two values the UI can badge — collecting the offending
  `passport:destination` pairs (`scripts/launch-check.mjs:126-128`,
  `:145-148`);
- fails when any locale's `visaChecker.json` is missing the
  `notIndependentlyVerified` / `verifiedBadge` labels (`:139-141`).

The UI renders a badge for both confidence values, so a row that could render
without a badge can only be one with an unknown confidence — which now fails the
gate. Current run output:

```
✓ Status labels: all 8 dataset statuses localised.
✓ Provenance badges: all 3383 displayed rows badged (0 independently verified, 3383 not independently verified).
```

Related: `scripts/validate-visa-data.mjs` (run on `predev` / `prebuild`) rejects
an `imported` row that carries `lastVerified`, and `reports/visa-coverage.json`
reports the launch corridors still awaiting independent verification.

## (b) "Coming soon" badge inside the link or via aria-describedby; launchBlocking false on unrendered image slots

**Status: implemented.**

Badge placement — every `ComingSoonBadge` is either a child of its link (so the
badge text is part of the link's accessible name) or the link points at it with
`aria-describedby`:

| Surface | Placement | Evidence |
| --- | --- | --- |
| Hub grid cards | inside `<Link>` | `src/components/kit/hub-grid.tsx:33` |
| Header sub-nav | inside `<Link>` | `src/components/layout/site-header.tsx:110` |
| Mega menu | inside `<Link>` | `src/components/mega-menu.tsx:92` |
| Immigration showcase | inside `<Link>` | `src/components/immigration-showcase.tsx:200` |
| CTA band | `aria-describedby` → badge `id` | `src/components/kit/cta-band.tsx:24,29` |

Image slots — `src/lib/image-slots.ts` sets `launchBlocking: false` for slots
that no page renders yet (`destination.*.card`, `destination.*.hero`,
`hero.background`, `og.default`, `team.*`, `article.*`) and `true` for the rest.
`scripts/launch-check.mjs` mirrors this with `isBlockingSlot`
(`:193-198`), so unrendered slots are excluded from the launch-blocking image
count. Current run output:

```
! 20/20 launch-blocking image slots still use placeholders (e.g. immigration.australia, immigration.canada, immigration.citizenship).
```

(20 warnings, not failures — final art is pending but not launch-blocking for the
unrendered slots.)
