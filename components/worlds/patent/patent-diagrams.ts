/**
 * Hand-drawn block diagrams for the patent world, one per build. Each node
 * whose label matches one of the case's `parts` gets that part's reference
 * numeral; `context` nodes (a visitor, a chain) are drawn dashed and carry no
 * numeral, as an external element does on a patent sheet.
 *
 * Every flow here restates a fact already in `components/portfolio/data.ts`
 * (problem / shipped / parts). Do not draw a connection the data cannot back.
 */

export type DiagramShape =
  | "box"
  | "store"
  | "handset"
  | "window"
  | "model"
  | "chain"
  | "rack"
  | "lock"
  | "doc"
  | "gate"
  | "card"
  | "tag"
  | "mpc"
  | "tiles";

/** Where the numeral's leader exits the node. */
export type NumeralSide = "t" | "b" | "l" | "r";

export interface DiagramNode {
  /** A part label from the case's `parts`, or free text for a context node. */
  label: string;
  shape: DiagramShape;
  x: number;
  y: number;
  w: number;
  h: number;
  context?: boolean;
  /** Drawn behind the others as an enclosure, with its label at the top left. */
  container?: boolean;
  /** Draw a cross through the node: "this does not exist / is not kept". */
  crossed?: boolean;
  n?: NumeralSide;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** Route around: "top" or "bottom" draws a U above or below both nodes. */
  via?: "top" | "bottom";
  /** The y of that U, when the default would cut through a container. */
  viaY?: number;
}

export interface Diagram {
  w: number;
  h: number;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  note?: string;
}

export const DIAGRAMS: Readonly<Record<string, Diagram>> = {
  "Swiggy MCP Server": {
    w: 780,
    h: 360,
    nodes: [
      { label: "AI concierge", shape: "model", x: 6, y: 110, w: 132, h: 96 },
      { label: "MCP server", shape: "rack", x: 226, y: 110, w: 130, h: 96 },
      { label: "Playwright session", shape: "window", x: 444, y: 100, w: 150, h: 116 },
      { label: "Closed consumer app", shape: "handset", x: 690, y: 88, w: 80, h: 140, n: "t" },
    ],
    edges: [
      { from: "AI concierge", to: "MCP server", label: "tool call" },
      { from: "MCP server", to: "Playwright session", label: "drives" },
      { from: "Playwright session", to: "Closed consumer app", label: "taps, reads" },
      { from: "Closed consumer app", to: "AI concierge", label: "result", dashed: true, via: "bottom" },
    ],
  },

  "Reskilll Platform": {
    w: 640,
    h: 380,
    nodes: [
      { label: "t3.micro host", shape: "box", x: 170, y: 40, w: 290, h: 320, container: true, n: "b" },
      { label: "Participants", shape: "box", x: 6, y: 150, w: 88, h: 80, context: true },
      { label: "OTP and OAuth", shape: "lock", x: 200, y: 90, w: 230, h: 90 },
      { label: "Judging engine", shape: "rack", x: 200, y: 230, w: 230, h: 96, n: "l" },
      { label: "CMS console", shape: "window", x: 510, y: 50, w: 124, h: 110, n: "t" },
      { label: "Organiser dashboards", shape: "window", x: 510, y: 230, w: 124, h: 110, n: "b" },
    ],
    edges: [
      { from: "Participants", to: "OTP and OAuth", label: "50k+ sign-ups" },
      { from: "OTP and OAuth", to: "Judging engine", label: "submissions" },
      { from: "CMS console", to: "t3.micro host", label: "content" },
      { from: "Judging engine", to: "Organiser dashboards", label: "scores" },
    ],
    note: "One t3.micro. Zero deployments after the dev close.",
  },

  "Gossip DAO": {
    w: 640,
    h: 360,
    nodes: [
      { label: "Residents", shape: "box", x: 6, y: 140, w: 100, h: 80, context: true },
      { label: "Next.js app", shape: "window", x: 160, y: 40, w: 260, h: 290, container: true, n: "t" },
      { label: "Anonymous feed", shape: "doc", x: 195, y: 120, w: 190, h: 170 },
      { label: "Prisma store", shape: "store", x: 480, y: 40, w: 140, h: 120, n: "r" },
      { label: "Solana integration", shape: "chain", x: 470, y: 230, w: 160, h: 90, n: "b" },
    ],
    edges: [
      { from: "Residents", to: "Anonymous feed", label: "post, read" },
      { from: "Next.js app", to: "Prisma store", label: "posts" },
      { from: "Next.js app", to: "Solana integration" },
    ],
    note: "50+ users and 200+ posts in the first 24 hours.",
  },

  "Helius Indexer": {
    w: 640,
    h: 380,
    nodes: [
      { label: "Solana chain", shape: "chain", x: 6, y: 50, w: 130, h: 80, context: true },
      { label: "Helius webhooks", shape: "box", x: 196, y: 50, w: 150, h: 80 },
      { label: "Ingest service", shape: "rack", x: 420, y: 44, w: 160, h: 92 },
      { label: "Postgres tables", shape: "store", x: 430, y: 220, w: 140, h: 130, n: "b" },
      { label: "SQL queries", shape: "doc", x: 196, y: 236, w: 150, h: 100, n: "b" },
      { label: "Solana team", shape: "box", x: 6, y: 246, w: 120, h: 80, context: true },
    ],
    edges: [
      { from: "Solana chain", to: "Helius webhooks", label: "events" },
      { from: "Helius webhooks", to: "Ingest service", label: "POST" },
      { from: "Ingest service", to: "Postgres tables", label: "rows" },
      { from: "Solana team", to: "SQL queries", label: "asks" },
      { from: "SQL queries", to: "Postgres tables", label: "SELECT" },
    ],
  },

  "Dark Payroll": {
    w: 680,
    h: 380,
    nodes: [
      { label: "Payroll app", shape: "window", x: 6, y: 130, w: 136, h: 120 },
      { label: "Hidden salary data", shape: "lock", x: 230, y: 30, w: 160, h: 110 },
      { label: "ZK proofs", shape: "doc", x: 230, y: 240, w: 160, h: 110, n: "b" },
      { label: "Solana chain", shape: "chain", x: 500, y: 145, w: 170, h: 90, n: "r" },
    ],
    edges: [
      { from: "Payroll app", to: "Hidden salary data", label: "salaries" },
      { from: "Payroll app", to: "ZK proofs", label: "compliance" },
      { from: "Hidden salary data", to: "Solana chain", label: "stored hidden" },
      { from: "ZK proofs", to: "Solana chain", label: "proof" },
    ],
  },

  "Arcium Privacy Suite": {
    w: 700,
    h: 360,
    nodes: [
      { label: "Five apps", shape: "tiles", x: 6, y: 110, w: 130, h: 110 },
      { label: "Encrypted inputs", shape: "lock", x: 200, y: 120, w: 110, h: 90 },
      { label: "Solana programs", shape: "chain", x: 370, y: 125, w: 140, h: 80 },
      { label: "Arcium MPC", shape: "mpc", x: 570, y: 100, w: 124, h: 130, n: "t" },
    ],
    edges: [
      { from: "Five apps", to: "Encrypted inputs", label: "encrypt" },
      { from: "Encrypted inputs", to: "Solana programs", label: "submit" },
      { from: "Solana programs", to: "Arcium MPC", label: "queue" },
      { from: "Arcium MPC", to: "Solana programs", label: "callback", dashed: true, via: "bottom" },
    ],
    note: "Voting, a tip jar, a message board, a lottery and a calculator.",
  },

  AgentPay: {
    w: 640,
    h: 380,
    nodes: [
      { label: "Agent client", shape: "model", x: 6, y: 140, w: 130, h: 96 },
      { label: "HTTP 402 paywall", shape: "gate", x: 250, y: 30, w: 160, h: 100 },
      { label: "Payment stream", shape: "box", x: 250, y: 250, w: 160, h: 90, n: "b" },
      { label: "Solana settlement", shape: "chain", x: 470, y: 250, w: 160, h: 90, n: "b" },
    ],
    edges: [
      { from: "Agent client", to: "HTTP 402 paywall", label: "request" },
      { from: "HTTP 402 paywall", to: "Agent client", label: "402: pay", dashed: true, via: "top" },
      { from: "Agent client", to: "Payment stream", label: "pay per call" },
      { from: "Payment stream", to: "Solana settlement", label: "settle" },
      { from: "Solana settlement", to: "HTTP 402 paywall", label: "paid" },
    ],
  },

  "sold.": {
    w: 730,
    h: 320,
    nodes: [
      { label: "Browser signals", shape: "window", x: 6, y: 100, w: 130, h: 110 },
      { label: "LLM profiler", shape: "model", x: 226, y: 107, w: 130, h: 96 },
      { label: "Price tag", shape: "tag", x: 426, y: 107, w: 120, h: 96 },
      { label: "Zero storage", shape: "store", x: 626, y: 100, w: 100, h: 110, crossed: true, n: "t" },
    ],
    edges: [
      { from: "Browser signals", to: "LLM profiler", label: "on arrival" },
      { from: "LLM profiler", to: "Price tag", label: "persona" },
      { from: "Price tag", to: "Zero storage", label: "not kept", dashed: true },
      { from: "Price tag", to: "Browser signals", label: "the page tells you all of it", dashed: true, via: "bottom" },
    ],
  },

  "x402 Web Services": {
    w: 640,
    h: 380,
    nodes: [
      { label: "Client", shape: "box", x: 6, y: 145, w: 96, h: 80, context: true },
      { label: "x402 paywall", shape: "gate", x: 170, y: 135, w: 150, h: 100, n: "b" },
      { label: "Per-message chat", shape: "window", x: 420, y: 20, w: 150, h: 110 },
      { label: "URL shortener", shape: "doc", x: 420, y: 250, w: 150, h: 100, n: "b" },
      { label: "Solana micropayments", shape: "chain", x: 150, y: 290, w: 170, h: 80, n: "r" },
    ],
    edges: [
      { from: "Client", to: "x402 paywall", label: "request" },
      { from: "x402 paywall", to: "Per-message chat", label: "per message" },
      { from: "x402 paywall", to: "URL shortener", label: "pay once" },
      { from: "x402 paywall", to: "Solana micropayments", label: "settles" },
    ],
  },

  Leash: {
    w: 740,
    h: 380,
    nodes: [
      { label: "Live pricing pages", shape: "doc", x: 6, y: 120, w: 120, h: 100 },
      { label: "Policy engine", shape: "rack", x: 190, y: 122, w: 130, h: 96 },
      { label: "Prava mandate", shape: "lock", x: 440, y: 122, w: 120, h: 96, n: "b" },
      { label: "Visa network", shape: "card", x: 620, y: 128, w: 114, h: 84 },
      { label: "LLM narrator", shape: "model", x: 190, y: 286, w: 130, h: 86, n: "r" },
    ],
    edges: [
      { from: "Live pricing pages", to: "Policy engine", label: "prices" },
      { from: "Policy engine", to: "Prava mandate", label: "renew / cancel" },
      { from: "Prava mandate", to: "Visa network", label: "charge" },
      { from: "Visa network", to: "Policy engine", label: "over the limit: declined", dashed: true, via: "top" },
      { from: "Policy engine", to: "LLM narrator", label: "reason" },
    ],
  },

  "Slop Filter for LinkedIn": {
    w: 680,
    h: 380,
    nodes: [
      { label: "Chrome extension", shape: "window", x: 6, y: 130, w: 150, h: 120 },
      { label: "Local proxy", shape: "box", x: 206, y: 40, w: 250, h: 300, container: true, n: "b" },
      { label: "Keyword rules", shape: "doc", x: 236, y: 100, w: 190, h: 96 },
      { label: "Jev model", shape: "model", x: 540, y: 100, w: 128, h: 96, n: "t" },
      { label: "Post cache", shape: "store", x: 540, y: 250, w: 128, h: 100, n: "b" },
    ],
    edges: [
      { from: "Chrome extension", to: "Keyword rules", label: "post text" },
      { from: "Keyword rules", to: "Jev model", label: "ambiguous only" },
      { from: "Jev model", to: "Chrome extension", label: "BAIT / CORP / BRAG + score", dashed: true, via: "top", viaY: 14 },
      { from: "Local proxy", to: "Post cache", label: "per post" },
    ],
    note: "The API key stays in the local proxy, never in the browser.",
  },

  GraveShift: {
    w: 820,
    h: 330,
    nodes: [
      { label: "EVM wallet scan", shape: "window", x: 6, y: 100, w: 140, h: 110 },
      { label: "Ownership proof", shape: "doc", x: 236, y: 105, w: 130, h: 100 },
      { label: "Anchor program", shape: "rack", x: 430, y: 107, w: 120, h: 96 },
      { label: "Solana devnet", shape: "chain", x: 690, y: 115, w: 124, h: 80, n: "t" },
    ],
    edges: [
      { from: "EVM wallet scan", to: "Ownership proof", label: "dead asset" },
      { from: "Ownership proof", to: "Anchor program", label: "signed" },
      { from: "Anchor program", to: "Solana devnet", label: "migration record" },
    ],
  },
};
