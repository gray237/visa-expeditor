import type { HubPageConfig } from "./types";

export const passportsHubConfig: HubPageConfig = {
  slug: "passports",
  slot: "page.passports.hero",
  items: [
    { key: "new", href: "/passports/new" },
    { key: "renewal", href: "/passports/renewal" },
    { key: "nameChange", href: "/passports/name-change" },
    { key: "lostStolen", href: "/passports/lost-stolen" },
  ],
};
