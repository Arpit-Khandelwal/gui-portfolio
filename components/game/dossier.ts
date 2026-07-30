/**
 * The bio, cut into cards the game hands out while you play.
 *
 * Two things reveal cards, both of them frequent:
 *   - catching a powerup   -> the capability that powerup is a metaphor for
 *   - clearing a letter    -> the next card in the current chapter
 *
 * A perfect paddle needs about 150 seconds to clear one wall, so anything
 * gated on level-clear teaches almost nobody. Letters and powerups land every
 * few seconds instead, which is the whole point of this module.
 *
 * Ids are stable strings and are what gets persisted. Never renumber them:
 * reordering this file must not silently relabel a returning player's deck.
 */

import type { PowerupKind } from "./types";

export interface DossierCard {
  readonly id: string;
  /** Short, mono-caps, printed on the chip that pops out of the wall. */
  readonly label: string;
  readonly line: string;
  /** Turns the deck into real portfolio navigation. */
  readonly href?: string;
}

export interface Chapter {
  /** Rendered as the brick wall. */
  readonly word: string;
  /** Era caption shown under the wall while the chapter is live. */
  readonly era: string;
  /**
   * Indexed by letter position in `word`, including spaces. A null slot means
   * that letter drops no card — spaces must be null, they have no bricks.
   */
  readonly cards: readonly (string | null)[];
}

/**
 * Caught powerups. The mechanic is the claim: multiball really does fan out
 * into parallel work, sticky really does catch and hold.
 */
export const POWERUP_CARDS: Readonly<Record<PowerupKind, DossierCard>> = {
  multiball: {
    id: "pw-agents",
    label: "Agents",
    line: "Three balls at once. Same shape as the day job: agents, MCP servers and browser sessions running in parallel, unattended.",
  },
  sticky: {
    id: "pw-mcp",
    label: "MCP",
    line: "The paddle catches and holds. That is what a tool contract does for a model — grab it, hold it, release it on purpose.",
  },
  slow: {
    id: "pw-week-zero",
    label: "Week 0",
    line: "Everything slows down. That is scoping: turn the fuzzy ask into interfaces, risks and a target before anyone writes code.",
  },
  wide: {
    id: "pw-api",
    label: "API surface",
    line: "A wider paddle. Auth, dashboards, ingestion, orchestration — the surface that has to catch whatever arrives.",
  },
  life: {
    id: "pw-handoff",
    label: "Handoff",
    line: "An extra ball. Merged PRs, setup notes and operating context, so the work keeps going without me.",
  },
};

/**
 * Revealed by losing a ball, in order. A player who is bad at this loses lives
 * long before they clear a letter, so the miss is the only reliable teaching
 * moment they get — and how work recovers is worth saying out loud anyway.
 */
export const MISS_CARDS: readonly DossierCard[] = [
  { id: "miss-scope", label: "Scope first", line: "Week 0 is scoping: interfaces, risks and a target, before a line of code gets written." },
  { id: "miss-risk", label: "Risk first", line: "Demo the riskiest workflow first. Bad news is cheap early and expensive late." },
  { id: "miss-weekly", label: "Every week", line: "A working demo every week, so slippage shows up in days instead of months." },
  { id: "miss-recover", label: "Recover", line: "Broken integrations and stalled demos are most of the job. That part is normal." },
];

/** Revealed by clearing a letter. Order here is display order in the deck. */
const CHAPTER_CARDS: readonly DossierCard[] = [
  // ARPIT — who
  { id: "who-role", label: "Fractional", line: "Arpit Khandelwal. Fractional AI and backend engineer, out of Bengaluru." },
  { id: "who-years", label: "Since 2021", line: "Five years shipping agents, APIs, automation and crypto infra." },
  { id: "who-proof", label: "10+ builds", line: "Ten-plus case-grade builds. Three companies, and a lot of public labs." },
  { id: "who-reply", label: "24 hours", line: "Every message answered inside a day. That part is not negotiable." },
  { id: "who-stack", label: "Stack", line: "TypeScript, Node, Python, Postgres, Rust, Docker, AWS." },

  // HPE — 2023-24
  { id: "hpe-role", label: "HPE", line: "Software Developer at Hewlett Packard Enterprise, 2023 to 2024." },
  { id: "hpe-dast", label: "DAST", line: "Microservice integrations across WebInspect, Burp Suite, OWASP ZAP and OpenVAS." },
  { id: "hpe-lesson", label: "Security", line: "Two years of building as if the scanner is already pointed at you." },

  // AVICI — 2025
  { id: "avici-role", label: "Avici", line: "AI and Backend Engineer at Avici Money, Jan to Jul 2025.", href: "https://avici.money" },
  { id: "avici-concierge", label: "Concierge", line: "AI concierge infrastructure for ordering, booking and actually finishing the task." },
  { id: "avici-mcp", label: "Swiggy MCP", line: "A Playwright-backed MCP server driving an AI concierge inside a closed consumer app.", href: "https://avici.money" },
  { id: "avici-noapi", label: "No API", line: "When a product has no API, the browser is the API. That is a solvable problem." },
  { id: "avici-tools", label: "Playwright", line: "Browser-session automation as a first-class tool layer, not a scraping hack." },

  // RESKILL — the platform
  { id: "reskilll-role", label: "Reskilll", line: "Product backend for the live Reskilll events and community platform.", href: "https://reskilll.com" },
  { id: "reskilll-auth", label: "Auth", line: "OTP login, Google OAuth, profile APIs. The unglamorous half, done properly." },
  { id: "reskilll-console", label: "Console", line: "CMS console, judging flows, submissions and the dashboards operators live in." },
  { id: "reskilll-sweep", label: "Full sweep", line: "Frontend, backend or CMS logic — whichever the feature actually needed that week." },
  { id: "reskilll-stack", label: "Next + Mongo", line: "Next.js and Express over MongoDB, shipped and running in production." },
  { id: "reskilll-scope", label: "Ownership", line: "Owned the auth and profile surfaces end to end, not a ticket at a time." },
  { id: "reskilll-ship", label: "Shipped", line: "Not a prototype. A platform other people's events depend on." },

  // LABS — public builds
  { id: "labs-gossip", label: "Gossip DAO", line: "A privacy-first community app: 50+ users and 200+ posts in the first 24 hours.", href: "https://gossip-dao.vercel.app" },
  { id: "labs-payroll", label: "Dark Payroll", line: "Solana payroll with salaries hidden and compliance still provable, via ZK.", href: "https://github.com/Arpit-Khandelwal/dark-payroll" },
  { id: "labs-helius", label: "Helius Indexer", line: "Chain webhooks into queryable Postgres, so on-chain activity reads like a table.", href: "https://helius-indexer.arpitkhandelwal.com" },
  { id: "labs-sold", label: "sold.", line: "Reads what your browser leaks on arrival, prices you, then confesses and stores nothing.", href: "https://sold.arpitkhandelwal.com" },

  // NOW — current direction
  { id: "now-x402", label: "x402", line: "Live pay-per-use services: per-message AI chat and a pay-once shortener.", href: "https://x402.arpitkhandelwal.com" },
  { id: "now-agentpay", label: "AgentPay", line: "Streaming micropayment rails so agents can pay each other per call.", href: "https://github.com/Arpit-Khandelwal/agentpay" },
  { id: "now-arcium", label: "Arcium", line: "Five confidential-compute apps: private voting, a sealed tip jar, a secure lottery.", href: "https://github.com/Arpit-Khandelwal?tab=repositories" },

  // HIRE ME — the offer
  { id: "hire-sprints", label: "Sprints", line: "Fixed-scope build sprints, two to six weeks. Scope signed off before week one." },
  { id: "hire-demos", label: "Weekly demos", line: "A working demo and a tradeoff note every week. No status theatre." },
  { id: "hire-pricing", label: "No hourly", line: "Flat per-sprint price tied to a shipped outcome. Never billed by the hour." },
  { id: "hire-fit", label: "Good fit", line: "Agents, retrieval, browser automation, and backends that need a production path." },
  { id: "hire-nofit", label: "Bad fit", line: "Landing-page polish. Vague ideas without users. Meeting-heavy discovery." },
  { id: "hire-talk", label: "Talk", line: "Scoping call within 48 hours. The contact form is one click away.", href: "/#contact" },
];

/**
 * Walls read forward through the timeline. Word lengths stay between three and
 * seven letters; the engine centres and size-caps the wall so both extremes
 * keep square-ish blocks.
 */
export const CHAPTERS: readonly Chapter[] = [
  {
    word: "ARPIT",
    era: "Who you are playing against",
    cards: ["who-role", "who-years", "who-proof", "who-reply", "who-stack"],
  },
  {
    word: "HPE",
    era: "2023 - 2024 · enterprise security tooling",
    cards: ["hpe-role", "hpe-dast", "hpe-lesson"],
  },
  {
    word: "AVICI",
    era: "2025 · AI concierge infrastructure",
    cards: ["avici-role", "avici-concierge", "avici-mcp", "avici-noapi", "avici-tools"],
  },
  {
    word: "RESKILL",
    era: "2025 - 2026 · the platform",
    cards: [
      "reskilll-role",
      "reskilll-auth",
      "reskilll-console",
      "reskilll-sweep",
      "reskilll-stack",
      "reskilll-scope",
      "reskilll-ship",
    ],
  },
  {
    word: "LABS",
    era: "Public builds, shipped in the open",
    cards: ["labs-gossip", "labs-payroll", "labs-helius", "labs-sold"],
  },
  {
    word: "NOW",
    era: "Agent payments and encrypted compute",
    cards: ["now-x402", "now-agentpay", "now-arcium"],
  },
  {
    word: "HIRE ME",
    era: "The offer",
    // Index 4 is the space. It has no bricks, so it can never drop a card.
    cards: ["hire-sprints", "hire-demos", "hire-pricing", "hire-fit", null, "hire-nofit", "hire-talk"],
  },
];

/** Deck order: chapters, then the powerup capabilities, then the miss cards. */
export const ALL_CARDS: readonly DossierCard[] = [
  ...CHAPTER_CARDS,
  ...Object.values(POWERUP_CARDS),
  ...MISS_CARDS,
];

const CARDS_BY_ID = new Map(ALL_CARDS.map((card) => [card.id, card]));

export function cardById(id: string): DossierCard | null {
  return CARDS_BY_ID.get(id) ?? null;
}

export const LEVEL_WORDS: readonly string[] = CHAPTERS.map((chapter) => chapter.word);

/** level is 0-based and wraps, so endless play keeps cycling the timeline. */
export function chapterForLevel(level: number): Chapter {
  const count = CHAPTERS.length;
  return CHAPTERS[((level % count) + count) % count];
}

/** The card a given letter of a given wall hands over, if it carries one. */
export function cardForLetter(level: number, letterIndex: number): DossierCard | null {
  const id = chapterForLevel(level).cards[letterIndex];
  return id ? cardById(id) : null;
}

/** The next unseen miss card, or null once they have all been turned over. */
export function nextMissCard(found: ReadonlySet<string>): DossierCard | null {
  return MISS_CARDS.find((card) => !found.has(card.id)) ?? null;
}
