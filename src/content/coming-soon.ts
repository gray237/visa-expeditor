import type { ImageSlot } from "@/lib/image-slots";

export interface ComingSoonRoute {
  /** Route path without the locale prefix. */
  path: string;
  /** Key under `items` in the comingSoon namespace. */
  key: string;
  /** Hero image slot. */
  slot: ImageSlot;
}

/**
 * Routes that exist and must return HTTP 200 with a noindex ComingSoon page
 * (P1-2). They are intentionally excluded from the sitemap.
 */
export const COMING_SOON_ROUTES: ComingSoonRoute[] = [
  { path: "/start", key: "start", slot: "page.about.hero" },
  { path: "/tools/idp", key: "toolsIdp", slot: "page.tools.hero" },
  { path: "/tools/checklist", key: "toolsChecklist", slot: "page.tools.hero" },
  { path: "/tools/passport-power", key: "toolsPassportPower", slot: "page.tools.hero" },
  { path: "/resources/guides", key: "resourcesGuides", slot: "page.resources.hero" },
  { path: "/resources/processing-times", key: "resourcesProcessingTimes", slot: "page.resources.hero" },
  { path: "/insights", key: "insights", slot: "page.insights.hero" },
  { path: "/immigration/united-states", key: "immigrationUnitedStates", slot: "page.immigration.hero" },
  { path: "/immigration/canada", key: "immigrationCanada", slot: "page.immigration.hero" },
  { path: "/immigration/united-kingdom", key: "immigrationUnitedKingdom", slot: "page.immigration.hero" },
  { path: "/immigration/australia", key: "immigrationAustralia", slot: "page.immigration.hero" },
  { path: "/immigration/portugal", key: "immigrationPortugal", slot: "page.immigration.hero" },
  { path: "/immigration/new-zealand", key: "immigrationNewZealand", slot: "page.immigration.hero" },
  { path: "/immigration/united-states/green-card-lottery", key: "immigrationGreenCardLottery", slot: "page.immigration.hero" },
  { path: "/immigration/skilled-worker", key: "immigrationSkilledWorker", slot: "page.immigration.hero" },
  { path: "/immigration/digital-nomad", key: "immigrationDigitalNomad", slot: "page.immigration.hero" },
];

const BY_PATH = new Map(COMING_SOON_ROUTES.map((route) => [route.path, route]));

export function comingSoonRouteForPath(path: string): ComingSoonRoute | undefined {
  return BY_PATH.get(path);
}

export function comingSoonRouteForSlug(slug: string[]): ComingSoonRoute | undefined {
  if (slug.length === 0) return undefined;
  return BY_PATH.get(`/${slug.join("/")}`);
}

export function comingSoonSlugs(): string[][] {
  return COMING_SOON_ROUTES.map((route) => route.path.replace(/^\//, "").split("/"));
}
