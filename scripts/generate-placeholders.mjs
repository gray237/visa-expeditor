import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "images", "placeholders");
mkdirSync(OUT_DIR, { recursive: true });

// Self-contained slot registry (mirrors src/lib/image-slots.ts so the
// generator has no dependency on the TS/React module graph).
const DESTINATION_KEYS = [
  "mexico", "canada", "unitedKingdom", "france", "italy", "japan", "germany",
  "spain", "thailand", "australia", "southKorea", "ireland", "switzerland",
  "netherlands", "singapore", "newZealand", "uae",
];
const IMMIGRATION_KEYS = [
  "unitedStates", "canada", "unitedKingdom", "australia", "portugal",
  "newZealand", "greenCardLottery", "investorVisas", "familySponsorship",
  "citizenship", "skilledWorker", "digitalNomad",
];

const slots = [
  { id: "hero.background", width: 2400, height: 1350 },
  { id: "og.default", width: 1200, height: 630 },
  ...["passports", "visas", "immigration", "tools", "resources", "about", "contact", "insights"].map(
    (route) => ({ id: `page.${route}.hero`, width: 2400, height: 900 })
  ),
  ...DESTINATION_KEYS.flatMap((key) => [
    { id: `destination.${key}.card`, width: 1200, height: 1600 },
    { id: `destination.${key}.hero`, width: 2400, height: 1000 },
  ]),
  ...IMMIGRATION_KEYS.map((key) => ({ id: `immigration.${key}`, width: 1200, height: 1600 })),
  ...[1, 2, 3, 4].map((n) => ({ id: `team.avatar.${n}`, width: 160, height: 160 })),
  ...["01", "02", "03", "04", "05", "06"].map((n) => ({ id: `team.member.${n}`, width: 800, height: 1000 })),
];

function svgPlaceholder(slot, width, height, decorative = false) {
  const fontSize = Math.min(24, width / 12);
  const label = decorative
    ? ""
    : `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
          font-size="${fontSize}" fill="#ffffffaa" letter-spacing="0.06em">
      PLACEHOLDER &middot; ${slot} &middot; ${width}&#215;${height}
    </text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f2444" />
        <stop offset="100%" stop-color="#4f5b72" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)" />
    ${label}
  </svg>`;
}

let generated = 0;
for (const slot of slots) {
  const file = join(OUT_DIR, `${slot.id}.svg`);
  const decorative = slot.id.startsWith("page.") && slot.id.endsWith(".hero");
  if (decorative || !existsSync(file)) {
    writeFileSync(file, svgPlaceholder(slot.id, slot.width, slot.height, decorative));
    generated += 1;
  }
}

console.log(`Generated ${generated} placeholder SVG(s) in public/images/placeholders/`);
