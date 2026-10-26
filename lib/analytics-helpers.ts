/**
 * Pure helpers for site-wide tracking: no DOM access, so they are unit tested
 * in node. The DOM wiring lives in components/analytics.
 */

export const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const;
export const POST_READ_MILESTONES = [50, 100] as const;
/** Seconds of visible time on one page that count as an engaged view. */
export const ENGAGED_MILESTONES = [30, 60, 180] as const;
export const LINK_TEXT_MAX = 60;

export type PageType =
  | "home"
  | "writing_post"
  | "writing_index"
  | "docs"
  | "about"
  | "contact"
  | "privacy"
  | "play"
  | "not_found"
  | "other";

const EXACT_PAGE_TYPES: Readonly<Record<string, PageType>> = {
  "/": "home",
  "/writing": "writing_index",
  "/docs": "docs",
  "/about": "about",
  "/contact": "contact",
  "/privacy": "privacy",
  "/privacy-policy": "privacy",
  "/play": "play",
};

function trimSlash(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function pageTypeForPath(pathname: string): PageType {
  const path = trimSlash(pathname);
  const exact = EXACT_PAGE_TYPES[path];
  if (exact) return exact;
  // Each world's homepage is prerendered under /w/<world>.
  if (/^\/w\/[^/]+$/.test(path)) return "home";
  if (/^\/writing\/[^/]+$/.test(path)) return "writing_post";
  if (path.startsWith("/docs/")) return "docs";
  return "other";
}

/** The post slug on /writing/<slug>, or null on any other path. */
export function postSlugForPath(pathname: string): string | null {
  const match = /^\/writing\/([^/]+)$/.exec(trimSlash(pathname));
  return match && match[1] !== "rss.xml" ? match[1] : null;
}

/**
 * How far down the page the viewport's bottom edge sits, 0-100. Null when the
 * page does not scroll, so a short page never reports "read to the end".
 */
export function scrollPercent(scrollTop: number, viewportHeight: number, documentHeight: number): number | null {
  if (documentHeight <= viewportHeight + 1) return null;
  const percent = ((scrollTop + viewportHeight) / documentHeight) * 100;
  return Math.max(0, Math.min(100, percent));
}

/**
 * How much of an element the reader has scrolled past, 0-100: 50 when the
 * viewport's bottom edge reaches the element's middle, 100 at its end.
 * `top` is the element's top relative to the viewport (getBoundingClientRect).
 */
export function readProgress(top: number, height: number, viewportHeight: number): number {
  if (height <= 0) return 0;
  const percent = ((viewportHeight - top) / height) * 100;
  return Math.max(0, Math.min(100, percent));
}

/** Milestones at or below `reached` that have not been sent yet, in order. */
export function newMilestones(
  reached: number,
  milestones: readonly number[],
  sent: ReadonlySet<number>,
): number[] {
  // Round to the nearest tenth first: a page whose last pixel lands at 99.97%
  // has been scrolled to the end.
  const value = Math.round(reached * 10) / 10;
  return milestones.filter((milestone) => value >= milestone - 0.5 && !sent.has(milestone));
}

/** Collapses whitespace and caps link text so it fits a GA4 dimension. */
export function cleanLinkText(text: string | null | undefined): string | undefined {
  const collapsed = (text ?? "").replace(/\s+/g, " ").trim();
  if (!collapsed) return undefined;
  return collapsed.length > LINK_TEXT_MAX ? collapsed.slice(0, LINK_TEXT_MAX) : collapsed;
}

function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

export type LinkClass =
  | { readonly kind: "outbound"; readonly domain: string; readonly url: string }
  | { readonly kind: "internal"; readonly path: string }
  | { readonly kind: "email" }
  | { readonly kind: "phone" }
  | { readonly kind: "other" };

/**
 * Classifies a resolved link URL against the page URL. Outbound URLs keep
 * only origin and path: query strings and fragments can carry prefilled
 * names, emails or tokens, so they are never sent.
 */
export function classifyLink(href: string, pageUrl: string): LinkClass {
  let url: URL;
  try {
    url = new URL(href, pageUrl);
  } catch {
    return { kind: "other" };
  }
  if (url.protocol === "mailto:") return { kind: "email" };
  if (url.protocol === "tel:") return { kind: "phone" };
  if (url.protocol !== "http:" && url.protocol !== "https:") return { kind: "other" };

  const page = new URL(pageUrl);
  if (bareHost(url.hostname) === bareHost(page.hostname)) {
    return { kind: "internal", path: url.pathname };
  }
  return { kind: "outbound", domain: url.hostname.toLowerCase(), url: `${url.origin}${url.pathname}` };
}

export const REPORTED_VITALS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;

export interface VitalInput {
  readonly name: string;
  readonly value: number;
  readonly rating?: string;
  readonly navigationType?: string;
}

/** A type alias, not an interface, so it is assignable to AnalyticsParams. */
export type VitalParams = {
  readonly metric_name: string;
  readonly metric_value: number;
  readonly rating: string | undefined;
  readonly navigation_type: string | undefined;
};

/**
 * GA4 params for one Core Web Vital, or null for metrics we do not report.
 * CLS is unitless and tiny, so it is sent multiplied by 1000 (Google's own
 * convention) to survive integer rounding; the rest are milliseconds.
 */
export function vitalParams(metric: VitalInput): VitalParams | null {
  if (!(REPORTED_VITALS as readonly string[]).includes(metric.name)) return null;
  const scaled = metric.name === "CLS" ? metric.value * 1000 : metric.value;
  return {
    metric_name: metric.name,
    metric_value: Math.round(scaled),
    rating: metric.rating,
    navigation_type: metric.navigationType,
  };
}

/**
 * `link_domain` and `link_url` for a link event. The URL keeps only origin and
 * path: query strings and fragments can carry tokens or personal data, and the
 * privacy policy promises they are never sent.
 */
export function linkEventParams(href: string, base = "https://www.arpitkhandelwal.com/"): { link_domain: string; link_url: string } {
  try {
    const url = new URL(href, base);
    if (url.protocol === "mailto:" || url.protocol === "tel:") return { link_domain: "", link_url: url.protocol };
    return { link_domain: url.hostname.toLowerCase(), link_url: `${url.origin}${url.pathname}` };
  } catch {
    return { link_domain: "", link_url: "" };
  }
}
