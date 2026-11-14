# Blockers (owner-only items)

Items below are stubbed so the build can continue. Do not invent the missing
value; replace the stub when the owner supplies the real thing.

| ID | Blocker | Current stub | Owner action |
| --- | --- | --- | --- |
| B-1 | Neon Auth production config | Dev credentials in `.env.local` | Enable Neon Auth, supply production env vars |
| B-2 | Vercel project, env vars, DNS | No Vercel project or preview deployment | Import `gray237/visa-expeditor` in Vercel, configure preview env vars, and create a preview deployment |
| B-3 | Database + auth (Neon) | Intake migration is not applied; production database/auth values are owner-supplied | Apply `db/migrations/001_create_visa_applications.sql`; set production database and Neon Auth env vars |
| B-4 | Email (Resend, verified sender) | Sending and signed-webhook verification are implemented; sender domain is unverified | Add the sending domain and publish its DNS records; set the API key/from address/webhook secret and test both email flows |
| B-5 | Payment provider | None at launch | Decide entity + provider |
| B-6 | Passport Power reference screenshot | Route scaffold only | Supply screenshot |
| B-7 | Licensed / verified visa dataset | Four passport files contain explicitly labelled sample rows with no verification dates or sources | Supply a licensed feed or verify each row against an official source before removing its sample badge |
| B-8 | Real team photos, bios, consent | Generated placeholders | Supply photos + consent |
| B-9 | Real reviews | Hidden | Supply review platform widget |
| B-10 | Legal review of Terms, Privacy, Disclaimer, Cookies | Draft banner is on by default | Keep `LEGAL_DRAFT_BANNER` unset or `"true"` in Vercel; set it to `"false"` only after counsel approves the pages |
| B-11 | WhatsApp, phone, support email, entity name/address | Env vars, hidden when unset | Supply values |
| B-12 | Pricing | Empty config, UI hidden | Supply pricing |
| B-13 | Hero/marquee photography | Generated placeholders | Supply licensed images |

| B-14 | Neon Auth preview smoke test | Neon Auth replaced Clerk with owner approval; no preview deployment exists yet | On the Vercel preview, test sign up, sign in, sign out, and that `/dashboard` redirects to sign-in when signed out |
| B-15 | Turnstile and rate limiting | Contact and intake forms fail closed in production when protection is not configured | Create Cloudflare Turnstile keys and configure both Turnstile and Upstash REST env vars in Vercel |
| B-16 | Error monitoring and uptime | Sentry and `/api/health` are wired; no Sentry project or external uptime monitor is configured | Set `NEXT_PUBLIC_SENTRY_DSN` in Vercel and monitor `/api/health` with an uptime service |

The roadmap assumes Clerk, but the owner approved using Neon Auth (Managed
Better Auth) instead. Vercel preview/production must set the Neon Auth and
Resend vars documented in `.env.example`, not Clerk keys. The auth flow still
requires the preview smoke test above; a passing build is not an auth test.
