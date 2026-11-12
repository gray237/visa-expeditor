import type { ImageSlot } from "@/lib/image-slots";

export interface HubItemConfig {
  key: string;
  href: string;
}

export interface HubPageConfig {
  slug: string;
  slot: ImageSlot;
  items: HubItemConfig[];
}

export interface ContentPageConfig {
  slug: string;
  slot: ImageSlot;
  ctaHref: string;
}
