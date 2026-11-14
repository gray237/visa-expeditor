import type { ImageSlot } from "@/lib/image-slots";

export interface HubItemConfig {
  key: string;
  href: string;
  soon?: boolean;
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

/** A hub page driven entirely by the kit (P1-2). */
export interface HubRouteConfig extends HubPageConfig {
  /** Message namespace, also used for metadata and breadcrumbs. */
  namespace: string;
  /** Breadcrumb key inside the namespace (e.g. "visas"). */
  breadcrumbKey: string;
  ctaHref: string;
}

/** A detail page rendered by the shared ServiceDetailPage template. */
export interface ServiceDetailConfig {
  /** Route path without the locale, e.g. "/visas/tourist". */
  path: string;
  /** Message namespace, e.g. "visas". */
  namespace: string;
  /** Key under `detail` in the namespace, e.g. "tourist". */
  key: string;
  slot: ImageSlot;
  /** Hub route the detail belongs to, e.g. "/visas". */
  parentHref: string;
  /** Breadcrumb key inside the namespace for the parent, e.g. "visas". */
  parentKey: string;
}
