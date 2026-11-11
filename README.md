# Visa Expeditor

Trilingual (EN / ES / FR) passport, visa and immigration help site built with
Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, Clerk and
next-intl.

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
| `npm run launch-check` | Report launch blockers (warns; `LAUNCH_STRICT=1` fails) |
| `npm run images:placeholders` | Regenerate placeholder images |
| `npm run images:manifest` | Rebuild the image manifest |

## Project structure

```
messages/{locale}/{namespace}.json   All user-facing copy (en/es/fr)
src/app/[locale]/                    Routes (App Router)
src/components/                      UI components
src/content/                         Typed page content configs
src/i18n/                            next-intl routing, navigation, messages
src/lib/                             Data, helpers, image slots
src/proxy.ts                         Clerk + next-intl proxy (Next 16)
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
- Unknown facts stay hidden behind config/env vars. Sample visa data is labelled
  as sample in the UI.
- Run `rm -rf .next` after moving or renaming files.

See `BLOCKERS.md` for owner-only items and `ROADMAP` notes in the repo root.
