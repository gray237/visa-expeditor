import type { LucideIcon } from "lucide-react";
import {
  FileText,
  RefreshCw,
  Pencil,
  ShieldAlert,
  Plane,
  Briefcase,
  GraduationCap,
  Building2,
  BadgeCheck,
  Landmark,
  TrendingUp,
  Users,
  Clock,
  ClipboardCheck,
  HelpCircle,
  BookOpen,
  Search,
  BarChart3,
  CalendarCheck,
  Newspaper,
} from "lucide-react";

export type MegaMenuItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
};

export type NavItem = {
  key: string;
  href: string;
  items: MegaMenuItem[];
  viewAllHref?: string;
  align?: "center" | "end";
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "passports",
    href: "/passports",
    items: [
      { key: "new", href: "/passports/new", icon: FileText },
      { key: "renewal", href: "/passports/renewal", icon: RefreshCw },
      { key: "nameChange", href: "/passports/name-change", icon: Pencil },
      { key: "lostStolen", href: "/passports/lost-stolen", icon: ShieldAlert },
    ],
  },
  {
    key: "visas",
    href: "/visas",
    items: [
      { key: "tourist", href: "/visas/tourist", icon: Plane },
      { key: "business", href: "/visas/business", icon: Briefcase },
      { key: "student", href: "/visas/student", icon: GraduationCap },
      { key: "work", href: "/visas/work", icon: Building2 },
    ],
  },
  {
    key: "immigration",
    href: "/immigration",
    items: [
      { key: "greenCards", href: "/immigration/green-cards", icon: BadgeCheck },
      { key: "citizenship", href: "/immigration/citizenship", icon: Landmark },
      { key: "investor", href: "/immigration/investor", icon: TrendingUp },
      { key: "family", href: "/immigration/family", icon: Users },
    ],
  },
  {
    key: "tools",
    href: "/tools",
    items: [
      { key: "visaChecker", href: "/tools/visa-checker", icon: Search },
      { key: "passportPower", href: "/tools/passport-power", icon: BarChart3, soon: true },
      { key: "checklist", href: "/tools/checklist", icon: ClipboardCheck },
      { key: "passportValidity", href: "/tools/passport-validity", icon: CalendarCheck },
    ],
    viewAllHref: "/tools",
    align: "end",
  },
  {
    key: "resources",
    href: "/resources",
    items: [
      { key: "processingTimes", href: "/resources/processing-times", icon: Clock, soon: true },
      { key: "guides", href: "/resources/guides", icon: BookOpen, soon: true },
      { key: "faqs", href: "/resources/faqs", icon: HelpCircle },
      { key: "insights", href: "/insights", icon: Newspaper, soon: true },
    ],
    viewAllHref: "/resources",
    align: "end",
  },
];