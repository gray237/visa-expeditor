import type { HubRouteConfig, ServiceDetailConfig } from "./types";

export const visasHubConfig: HubRouteConfig = {
  slug: "visas",
  namespace: "visas",
  breadcrumbKey: "visas",
  slot: "page.visas.hero",
  ctaHref: "/contact",
  items: [
    { key: "tourist", href: "/visas/tourist" },
    { key: "business", href: "/visas/business" },
    { key: "student", href: "/visas/student" },
    { key: "work", href: "/visas/work" },
  ],
};

export const immigrationHubConfig: HubRouteConfig = {
  slug: "immigration",
  namespace: "immigration",
  breadcrumbKey: "immigration",
  slot: "page.immigration.hero",
  ctaHref: "/contact",
  items: [
    { key: "greenCards", href: "/immigration/green-cards" },
    { key: "citizenship", href: "/immigration/citizenship" },
    { key: "family", href: "/immigration/family" },
    { key: "investorVisas", href: "/immigration/investor-visas" },
  ],
};

export const toolsHubConfig: HubRouteConfig = {
  slug: "tools",
  namespace: "tools",
  breadcrumbKey: "tools",
  slot: "page.tools.hero",
  ctaHref: "/contact",
  items: [
    { key: "visaChecker", href: "/tools/visa-checker" },
    { key: "passportValidity", href: "/tools/passport-validity" },
    { key: "checklist", href: "/tools/checklist" },
    { key: "passportPower", href: "/tools/passport-power", soon: true },
    { key: "idp", href: "/tools/idp" },
  ],
};

export const resourcesHubConfig: HubRouteConfig = {
  slug: "resources",
  namespace: "resources",
  breadcrumbKey: "resources",
  slot: "page.resources.hero",
  ctaHref: "/contact",
  items: [
    { key: "faqs", href: "/resources/faqs" },
    { key: "guides", href: "/resources/guides", soon: true },
    { key: "processingTimes", href: "/resources/processing-times", soon: true },
    { key: "insights", href: "/insights", soon: true },
  ],
};

export const HUB_CONFIGS: HubRouteConfig[] = [
  visasHubConfig,
  immigrationHubConfig,
  toolsHubConfig,
  resourcesHubConfig,
];

export const PASSPORT_DETAILS: ServiceDetailConfig[] = [
  { path: "/passports/new", namespace: "passports", key: "new", slot: "page.passports.hero", parentHref: "/passports", parentKey: "passports" },
  { path: "/passports/renewal", namespace: "passports", key: "renewal", slot: "page.passports.hero", parentHref: "/passports", parentKey: "passports" },
  { path: "/passports/name-change", namespace: "passports", key: "nameChange", slot: "page.passports.hero", parentHref: "/passports", parentKey: "passports" },
  { path: "/passports/lost-stolen", namespace: "passports", key: "lostStolen", slot: "page.passports.hero", parentHref: "/passports", parentKey: "passports" },
];

export const VISA_DETAILS: ServiceDetailConfig[] = [
  { path: "/visas/tourist", namespace: "visas", key: "tourist", slot: "page.visas.hero", parentHref: "/visas", parentKey: "visas" },
  { path: "/visas/business", namespace: "visas", key: "business", slot: "page.visas.hero", parentHref: "/visas", parentKey: "visas" },
  { path: "/visas/student", namespace: "visas", key: "student", slot: "page.visas.hero", parentHref: "/visas", parentKey: "visas" },
  { path: "/visas/work", namespace: "visas", key: "work", slot: "page.visas.hero", parentHref: "/visas", parentKey: "visas" },
];

export const IMMIGRATION_DETAILS: ServiceDetailConfig[] = [
  { path: "/immigration/green-cards", namespace: "immigration", key: "greenCards", slot: "page.immigration.hero", parentHref: "/immigration", parentKey: "immigration" },
  { path: "/immigration/citizenship", namespace: "immigration", key: "citizenship", slot: "page.immigration.hero", parentHref: "/immigration", parentKey: "immigration" },
  { path: "/immigration/family", namespace: "immigration", key: "family", slot: "page.immigration.hero", parentHref: "/immigration", parentKey: "immigration" },
  { path: "/immigration/investor-visas", namespace: "immigration", key: "investorVisas", slot: "page.immigration.hero", parentHref: "/immigration", parentKey: "immigration" },
];

export const TOOL_DETAILS: ServiceDetailConfig[] = [
  { path: "/tools/passport-validity", namespace: "tools", key: "passportValidity", slot: "page.tools.hero", parentHref: "/tools", parentKey: "tools" },
];

export const SERVICE_DETAILS: ServiceDetailConfig[] = [
  ...PASSPORT_DETAILS,
  ...VISA_DETAILS,
  ...IMMIGRATION_DETAILS,
  ...TOOL_DETAILS,
];

export function detailByPath(path: string): ServiceDetailConfig {
  const found = SERVICE_DETAILS.find((detail) => detail.path === path);
  if (!found) throw new Error(`Unknown detail route: ${path}`);
  return found;
}

export function hubBySlug(slug: string): HubRouteConfig {
  const found = HUB_CONFIGS.find((hub) => hub.slug === slug);
  if (!found) throw new Error(`Unknown hub route: ${slug}`);
  return found;
}
