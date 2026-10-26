/**
 * Optional context a browser sends with a sprint brief, so a lead arrives
 * with how it was captured: the world, the A/B cohort, the reader's answer,
 * the button and section, the landing page and the referrer.
 *
 * Best effort by design: unknown keys are dropped, values are clipped, and a
 * bad context never fails the brief. Agents calling the API may omit it.
 */
export const LEAD_CONTEXT_KEYS = [
  "world",
  "worldSource",
  "abCohort",
  "audience",
  "audienceSource",
  "cta",
  "section",
  "sprintType",
  "sprintTimeline",
  "sprintStage",
  "page",
  "landingPage",
  "referrer",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "secondsOnSite",
] as const;

export type LeadContextKey = (typeof LEAD_CONTEXT_KEYS)[number];

export type LeadContext = Partial<Record<LeadContextKey, string>>;

const MAX_VALUE = 300;

/** Strips control characters and clips; returns null for empty values. */
function clean(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, MAX_VALUE);
  return text === "" ? null : text;
}

export function parseLeadContext(raw: unknown): LeadContext | undefined {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return undefined;
  const record = raw as Record<string, unknown>;
  const entries = LEAD_CONTEXT_KEYS.flatMap((key) => {
    const value = clean(record[key]);
    return value === null ? [] : [[key, value] as const];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

/** Human labels for the email table, in reading order. */
export const LEAD_CONTEXT_LABELS: Readonly<Record<LeadContextKey, string>> = {
  world: "Site look",
  worldSource: "How the look was set",
  abCohort: "A/B cohort",
  audience: "Reader answer",
  audienceSource: "How the answer was set",
  cta: "Button that led here",
  section: "Section",
  sprintType: "Work type",
  sprintTimeline: "Timeline",
  sprintStage: "Current state",
  page: "Page",
  landingPage: "Landing page",
  referrer: "Referrer",
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  secondsOnSite: "Seconds on site",
};
