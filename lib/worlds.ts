/**
 * The site ships four visual worlds over one set of content. The visitor picks
 * one with the world switcher; the choice lives in a cookie so the proxy can
 * serve the matching statically rendered homepage with no flash.
 *
 * Dependency-free on purpose: the proxy runs on the edge runtime.
 */
export const WORLDS = ["patent", "lid", "wall", "canon"] as const;

export type WorldId = (typeof WORLDS)[number];

export const DEFAULT_WORLD: WorldId = "patent";

export const WORLD_COOKIE = "world";

/** How the current world was set: assigned by the A/B test, chosen, or shared link. */
export const WORLD_SOURCE_COOKIE = "world_src";
export type WorldSource = "ab" | "chosen" | "shared";

/** The world the A/B test first assigned. Never changes after assignment. */
export const AB_COHORT_COOKIE = "ab_cohort";

/** Crawlers, link unfurlers and agents always see the default world. */
const NON_HUMAN_AGENT =
  /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|headless|python|curl|wget|httpclient|gpt|claude|anthropic|perplexity|bytespider|petal/i;

export function isNonHumanAgent(userAgent: string | null): boolean {
  return !userAgent || NON_HUMAN_AGENT.test(userAgent);
}

/** Uniform pick across all worlds for the A/B/C/D test. */
export function pickAbWorld(random: number = Math.random()): WorldId {
  const index = Math.min(WORLDS.length - 1, Math.floor(random * WORLDS.length));
  return WORLDS[index];
}

/** Query parameter that makes a world shareable: `/?world=lid`. */
export const WORLD_PARAM = "world";

/** One year, in seconds. */
export const WORLD_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const WORLD_LABELS: Readonly<Record<WorldId, string>> = {
  patent: "Patent",
  lid: "Laptop lid",
  wall: "Title wall",
  canon: "Plain",
};

const WORLD_SET: ReadonlySet<string> = new Set(WORLDS);

export function parseWorld(value: string | null | undefined): WorldId | null {
  return value && WORLD_SET.has(value) ? (value as WorldId) : null;
}

/** Path of the statically rendered homepage for a world. */
export function worldHomePath(world: WorldId): string {
  return world === DEFAULT_WORLD ? "/" : `/w/${world}`;
}

/**
 * Runs in <head> before first paint so every page carries the chosen world's
 * tokens without a flash. A direct /w/<world> URL wins over the cookie, so the
 * page chrome (background, scrollbar, consent banner) matches the page.
 * Kept as a string because it is inlined verbatim.
 */
export const WORLD_BOOT_SCRIPT = `(function(){try{var p=location.pathname.match(/^\\/w\\/(${WORLDS.join("|")})(?:\\/|$)/);var m=document.cookie.match(/(?:^|; )${WORLD_COOKIE}=(${WORLDS.join("|")})(?:;|$)/);document.documentElement.dataset.world=p?p[1]:m?m[1]:"${DEFAULT_WORLD}";}catch(e){}})();`;
