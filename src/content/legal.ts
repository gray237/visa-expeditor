export interface LegalPageConfig {
  path: string;
  key: string;
}

export const LEGAL_DRAFT_BANNER = process.env.LEGAL_DRAFT_BANNER !== "false";

export const LEGAL_PAGES: LegalPageConfig[] = [
  { path: "/terms", key: "terms" },
  { path: "/privacy", key: "privacy" },
  { path: "/disclaimer", key: "disclaimer" },
  { path: "/cookies", key: "cookies" },
  { path: "/accessibility", key: "accessibility" },
];

export function legalByPath(path: string): LegalPageConfig {
  const found = LEGAL_PAGES.find((page) => page.path === path);
  if (!found) throw new Error(`Unknown legal route: ${path}`);
  return found;
}
