/**
 * Remembers, for one browser session, how a visitor arrived (landing page,
 * outside referrer, UTM tags) and the last call-to-action they pressed, so a
 * brief can carry that context to the inbox. Session storage only; nothing
 * leaves the browser until the visitor sends a brief.
 */
const KEY = "lead-touch";

interface Touch {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  startedAt?: number;
  cta?: string;
  section?: string;
}

function read(): Touch {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Touch;
  } catch {
    return {};
  }
}

function write(touch: Touch): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(touch));
  } catch {
    // Storage blocked: the brief goes out without this context.
  }
}

/** First page of the session only. Later pages keep the original landing. */
export function recordLanding(): void {
  if (typeof window === "undefined") return;
  const current = read();
  if (current.startedAt) return;
  const params = new URLSearchParams(window.location.search);
  let referrer: string | undefined;
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    referrer = ref && ref.hostname !== window.location.hostname ? `${ref.origin}${ref.pathname}` : undefined;
  } catch {
    referrer = undefined;
  }
  write({
    ...current,
    landingPage: window.location.pathname,
    referrer,
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    startedAt: Date.now(),
  });
}

export function recordCta(cta: string, section?: string): void {
  if (typeof window === "undefined") return;
  write({ ...read(), cta, section });
}

function cookie(name: string): string | undefined {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
}

/** The context sent with a brief. Values are plain strings; the server clips them. */
export function leadContext(extra: Readonly<Record<string, string | undefined>>): Record<string, string> {
  const touch = read();
  const raw: Record<string, string | undefined> = {
    world: document.documentElement.dataset.world,
    worldSource: cookie("world_src") ?? "default",
    abCohort: cookie("ab_cohort") ?? "none",
    page: window.location.pathname,
    landingPage: touch.landingPage,
    referrer: touch.referrer,
    utmSource: touch.utmSource,
    utmMedium: touch.utmMedium,
    utmCampaign: touch.utmCampaign,
    cta: touch.cta ?? "form",
    section: touch.section,
    secondsOnSite: touch.startedAt ? String(Math.round((Date.now() - touch.startedAt) / 1000)) : undefined,
    ...extra,
  };
  return Object.fromEntries(Object.entries(raw).filter((entry): entry is [string, string] => Boolean(entry[1])));
}
