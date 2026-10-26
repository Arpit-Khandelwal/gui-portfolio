/**
 * One entry point for product analytics. Every event goes to the GTM
 * dataLayer (GTM forwards it to GA4) and to Microsoft Clarity as a custom
 * event, so sessions can be filtered by it.
 *
 * Safe to call before consent or before GTM loads: the dataLayer is a plain
 * array that GTM replays once it starts, and Clarity calls wait in the
 * standard `clarity.q` queue that clarity.js drains when it loads. If the
 * visitor never consents, neither script loads and nothing leaves the page.
 * Never put personal data (names, emails, message text) in params.
 */
export const ANALYTICS_EVENTS = [
  "world_switch",
  "audience_select",
  "brief_option",
  "brief_copy",
  "brief_submit",
  "case_open",
  "case_link",
  "figure_part_focus",
  "sticker_flip",
  "row_scroll",
  "oss_link",
  "archive_link",
  "faq_open",
  "nav_click",
  "cta_click",
  "outbound_click",
  "scroll_depth",
  "section_view",
  "page_engaged",
  "copy",
  "post_read",
  "not_found",
  "play_start",
  "play_end",
  "play_card",
  "web_vital",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

/**
 * Every event-level param key the site sends. GTM maps each one to a Data
 * Layer Variable of the same name, so a key outside this list never reaches
 * GA4. Keep it in sync with the "In-depth analytics" GTM workspace.
 */
export const ANALYTICS_PARAM_KEYS = [
  "from",
  "to",
  "path",
  "audience",
  "field",
  "value",
  "result",
  "case_title",
  "surface",
  "part",
  "item",
  "section",
  "link_domain",
  "link_url",
  "link_text",
  "nav",
  "cta",
  "percent",
  "seconds",
  "slug",
  "card",
  "score",
  "level",
  "cards_collected",
  "cards_new",
  "duration_s",
  "cause",
  "metric_name",
  "metric_value",
  "rating",
  "navigation_type",
] as const;

export type AnalyticsParamKey = (typeof ANALYTICS_PARAM_KEYS)[number];

/** The params each event is expected to carry. Documentation and test fixture. */
export const ANALYTICS_EVENT_PARAMS: Readonly<Record<AnalyticsEventName, readonly AnalyticsParamKey[]>> = {
  world_switch: ["from", "to", "path"],
  audience_select: ["audience"],
  brief_option: ["field", "value"],
  brief_copy: ["audience"],
  brief_submit: ["result", "audience"],
  case_open: ["case_title", "surface"],
  case_link: ["case_title", "link_domain", "link_url"],
  figure_part_focus: ["part"],
  sticker_flip: ["item"],
  row_scroll: ["section"],
  oss_link: ["item", "link_domain", "link_url"],
  archive_link: ["item", "link_domain", "link_url"],
  faq_open: ["item"],
  nav_click: ["link_url", "link_text", "nav", "section"],
  cta_click: ["cta", "section"],
  outbound_click: ["link_domain", "link_url", "link_text", "section"],
  scroll_depth: ["percent"],
  section_view: ["section"],
  page_engaged: ["seconds"],
  copy: ["section"],
  post_read: ["slug", "percent"],
  not_found: ["path"],
  play_start: ["level"],
  play_end: ["score", "level", "cards_collected", "cards_new", "duration_s", "cause"],
  play_card: ["card"],
  web_vital: ["metric_name", "metric_value", "rating", "navigation_type"],
};

/** Session-level context keys. They persist in the dataLayer across events. */
export const ANALYTICS_CONTEXT_KEYS = ["site_world", "page_type"] as const;

export type AnalyticsContextKey = (typeof ANALYTICS_CONTEXT_KEYS)[number];

export type AnalyticsParams = Readonly<Record<string, string | number | boolean | undefined>>;

type DataLayerEntry = Record<string, unknown>;

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    clarity?: ClarityFn;
  }
}

/**
 * GTM's data model keeps every key ever pushed. Without a reset, `percent`
 * from a scroll event would ride along on the next click. Clearing every
 * known param on each push keeps events independent; context keys are not
 * in this list, so they persist on purpose.
 */
const PARAM_RESET: Readonly<Record<string, undefined>> = Object.fromEntries(
  ANALYTICS_PARAM_KEYS.map((key) => [key, undefined]),
);

/** Builds the dataLayer entry for one event. Pure, exported for tests. */
export function buildEventEntry(name: AnalyticsEventName, params: AnalyticsParams = {}): DataLayerEntry {
  const clean = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  return { ...PARAM_RESET, ...clean, event: name };
}

/** Latest context values, re-sent to Clarity if its function is swapped. */
const clarityContext = new Map<string, string>();
/** The Clarity function the context was last applied to. */
let clarityContextTarget: ClarityFn | null = null;

/**
 * The standard Clarity queue stub, so calls made before clarity.js loads are
 * kept. If a loader later replaces `window.clarity` (GTM's template API does
 * not document whether it keeps an existing function), the context is
 * applied again to the new function so session tags are never lost.
 */
function clarity(): ClarityFn {
  if (!window.clarity) {
    const stub: ClarityFn = (...args: unknown[]) => {
      (stub.q = stub.q ?? []).push(args);
    };
    window.clarity = stub;
    clarityContextTarget = stub;
  }
  const current = window.clarity;
  if (current !== clarityContextTarget) {
    clarityContextTarget = current;
    for (const [key, value] of clarityContext) current("set", key, value);
  }
  return current;
}

export function track(name: AnalyticsEventName, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(buildEventEntry(name, params));
  clarity()("event", name);
}

/**
 * Session-level context (world, page type). GA4 gets it as a dataLayer value
 * that the GTM event tag sends as a param and a user property; Clarity gets a
 * custom tag.
 */
export function setAnalyticsContext(key: string, value: string): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ [key]: value });
  clarityContext.set(key, value);
  clarity()("set", key, value);
}
