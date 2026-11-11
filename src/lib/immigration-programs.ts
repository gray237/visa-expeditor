import type { LucideIcon } from "lucide-react";
import { Award, Landmark, Laptop, Ticket, TrendingUp, Users } from "lucide-react";

export type ImmigrationService = {
  key: string;
  href: string;
  countryCode?: string;
  icon?: LucideIcon;
  accent: string;
};

export const IMMIGRATION_SERVICES: ImmigrationService[] = [
  { key: "unitedStates", href: "/immigration/united-states", countryCode: "US", accent: "#2F5A8C" },
  { key: "canada", href: "/immigration/canada", countryCode: "CA", accent: "#C8384C" },
  { key: "unitedKingdom", href: "/immigration/united-kingdom", countryCode: "GB", accent: "#4A4E7A" },
  { key: "australia", href: "/immigration/australia", countryCode: "AU", accent: "#2F7A6E" },
  { key: "portugal", href: "/immigration/portugal", countryCode: "PT", accent: "#2E7D4F" },
  { key: "newZealand", href: "/immigration/new-zealand", countryCode: "NZ", accent: "#1A3A5C" },
  { key: "greenCardLottery", href: "/immigration/united-states/green-card-lottery", icon: Ticket, accent: "#B8925A" },
  { key: "investorVisas", href: "/immigration/investor-visas", icon: TrendingUp, accent: "#A88232" },
  { key: "familySponsorship", href: "/immigration/family", icon: Users, accent: "#8A6D3F" },
  { key: "citizenship", href: "/immigration/citizenship", icon: Landmark, accent: "#6B5B95" },
  { key: "skilledWorker", href: "/immigration/skilled-worker", icon: Award, accent: "#4C6B8C" },
  { key: "digitalNomad", href: "/immigration/digital-nomad", icon: Laptop, accent: "#3D8C7A" },
];