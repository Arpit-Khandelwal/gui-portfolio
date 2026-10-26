// Copy follows ISO 24495-1 plain language, with STE-style sentence rules (ASD-STE100).
/**
 * Headlines and section headings for the four visual worlds. The facts are the
 * same in every world; only the voice changes. Body content (case studies,
 * terms, FAQs) still comes from `components/portfolio/data.ts` and `lib/copy.ts`.
 *
 * Keys of `patent.extra.figureCaptions` are `selectedWork` titles, verbatim.
 */

export type WorldCopyId = "patent" | "lid" | "wall" | "canon";

export type WorldSectionId =
  | "work"
  | "experiments"
  | "openSource"
  | "archive"
  | "process"
  | "terms"
  | "faq"
  | "brief"
  | "about"
  | "play";

export type WorldSectionCopy = {
  readonly title: string;
  readonly intro: string;
};

export type WorldExtraValue = string | readonly string[] | Readonly<Record<string, string>>;

export type WorldCopy = {
  readonly headline: string;
  readonly subline: string;
  readonly sections: Readonly<Record<WorldSectionId, WorldSectionCopy>>;
  readonly extra: Readonly<Record<string, WorldExtraValue>>;
};

export const worldCopy = {
  patent: {
    headline: "Apparatus and method for shipping the awkward middle of a product",
    subline:
      "Inventor: Arpit Khandelwal, Bengaluru. Backend and AI-systems engineer. Tech lead at Reskilll. Open to select build sprints of 2-6 weeks.",
    sections: {
      about: {
        title: "Abstract",
        intro:
          "A one-person practice that builds AI agents, backend APIs and automation in fixed sprints of 2-6 weeks. The inventor leads tech at Reskilll and takes outside sprints one at a time.",
      },
      work: {
        title: "Figures",
        intro: "Each figure shows one shipped system, its parts and its proof.",
      },
      experiments: {
        title: "Further embodiments",
        intro: "Hackathon builds and experiments. Each one tests one idea in public.",
      },
      openSource: {
        title: "Cited references",
        intro: "Pull requests to other projects. Some are merged. The rest are in review.",
      },
      archive: {
        title: "Description of prior work",
        intro: "Smaller builds since 2021. Most of them run live on a subdomain.",
      },
      process: {
        title: "Detailed description",
        intro: "How a sprint runs, from the first brief to the handoff.",
      },
      terms: {
        title: "Claims",
        intro: "What a sprint includes. Each claim is a fixed term.",
      },
      faq: {
        title: "Questions from the examiner",
        intro: "Direct answers to the common questions.",
      },
      brief: {
        title: "Application form",
        intro: "Write the brief here and send it. You get a reply within 24 hours.",
      },
      play: {
        title: "Appendix A: brick-breaker",
        intro: "A canvas game. Each wall spells one part of the CV and turns over cards. There are 42 cards.",
      },
    },
    extra: {
      claims: [
        "1. A build sprint with a fixed scope and a fixed length of two to six weeks, run one at a time.",
        "2. The sprint of claim 1, with one flat price tied to a shipped result and no hourly billing.",
        "3. The sprint of claim 1, where each brief gets a reply within 24 hours and a fit gets a scoping call within 48 hours.",
        "4. The sprint of claim 1, where code starts only after both sides sign off a written scope.",
        "5. The sprint of claim 1, with merged PRs, a working demo and tradeoff notes every week.",
        "6. The sprint of claim 1, which ends with handoff documents so the team can continue the work alone.",
      ],
      fig0Caption:
        "This page as an AI agent reads it. The agent uses /llms.txt, a markdown twin and the OpenAPI document. It needs no browser.",
      figureCaptions: {
        "Reskilll Platform": "Event platform that took 50k+ registrations on one t3.micro.",
        "Swiggy MCP Server": "MCP server that lets an AI concierge operate a closed consumer app.",
        "Gossip DAO": "Anonymous community app with 50+ users and 200+ posts in 24 hours.",
        "Helius Indexer": "Indexer that moves Helius webhook events into Postgres tables.",
        "Dark Payroll": "Solana payroll with hidden salaries and ZK compliance proofs.",
        "Arcium Privacy Suite": "Five apps that compute on encrypted inputs with Arcium MPC.",
        AgentPay: "Streaming micropayments that let agents pay per request over HTTP 402.",
        "sold.": "Page that profiles and prices a visitor, then discloses all of it.",
        "x402 Web Services": "Pay-per-use chat and URL shortener, settled with x402 micropayments.",
        Leash: "Agent spend limit that the Visa network enforces, not the agent.",
        "Slop Filter for LinkedIn": "Extension that stamps BAIT, CORP or BRAG on LinkedIn posts.",
        GraveShift: "Proof of a dead EVM asset, written as a migration record on Solana.",
      },
    },
  },

  lid: {
    headline: "Hello, my name is Arpit",
    subline:
      "I build backends, AI agents and small odd tools. I lead tech at Reskilll and take select build sprints.",
    sections: {
      work: { title: "Shipped", intro: "Systems with real users." },
      experiments: { title: "Hackathon builds", intro: "Built fast and in public." },
      openSource: { title: "Open source", intro: "Small pull requests to other people's projects." },
      archive: { title: "More stickers", intro: "Small builds since 2021. Most run on a subdomain." },
      process: { title: "How a sprint goes", intro: "Four steps, from the brief to the handoff." },
      terms: { title: "The deal", intro: "Fixed scope. Flat price. No hourly billing." },
      faq: { title: "Questions", intro: "Short answers." },
      brief: { title: "Say hi", intro: "Send a brief. I reply within 24 hours." },
      about: { title: "About me", intro: "Backend and AI-systems engineer in Bengaluru." },
      play: { title: "Coffee break", intro: "Break the wall to read the CV." },
    },
    extra: {
      badgeTop: "HELLO",
      badgeSub: "my name is",
      badgeName: "Arpit",
      stickers: [
        "50k+ signups",
        "One t3.micro",
        "MCP",
        "Playwright",
        "Solana",
        "x402",
        "BAIT / CORP / BRAG",
        "255,168 games",
        "Superteam India",
        "20+ projects judged",
      ],
    },
  },

  wall: {
    headline: "Now showing: builds by Arpit Khandelwal",
    subline:
      "Backend and AI-systems engineer in Bengaluru. Tech lead at Reskilll. Open to select sprints.",
    sections: {
      work: { title: "Shipped", intro: "Systems in production with real users." },
      experiments: { title: "Experiments", intro: "Hackathon builds and public tests." },
      openSource: { title: "Open source", intro: "Merged and in-review pull requests." },
      archive: { title: "Small builds", intro: "Tools and apps since 2021." },
      process: { title: "How a sprint works", intro: "Four steps, from the brief to the handoff." },
      terms: { title: "Terms", intro: "Fixed scope, flat price, one sprint at a time." },
      faq: { title: "Questions", intro: "Direct answers." },
      brief: { title: "Start a brief", intro: "Pick the options and send. Reply within 24 hours." },
      about: { title: "About", intro: "Who builds this, and how." },
      play: { title: "Play", intro: "A brick-breaker that turns over the CV, one card at a time." },
    },
    extra: {
      featuredTitle: "Reskilll Platform",
      featuredLine:
        "The platform behind a national hackathon. It took 50k+ registrations on one t3.micro and needed zero deployments after the dev close.",
      featuredMeta: "2025 - Present · Next.js · Express · MongoDB",
      featuredCta: "View the build",
    },
  },

  canon: {
    headline: "I build the awkward middle of a product.",
    subline:
      "Arpit Khandelwal, backend and AI-systems engineer in Bengaluru. I lead tech at Reskilll and take select build sprints of 2-6 weeks, one at a time.",
    sections: {
      work: { title: "Outcomes before adjectives.", intro: "Shipped systems, each with its proof." },
      experiments: { title: "Experiments", intro: "Hackathon builds and public tests of one idea each." },
      openSource: { title: "Open source", intro: "Pull requests to other projects, merged and in review." },
      archive: { title: "Archive", intro: "Smaller builds since 2021. Most are live." },
      process: { title: "Process", intro: "How a sprint runs, from brief to handoff." },
      terms: { title: "Terms", intro: "Fixed scope, flat price, no hourly billing." },
      faq: { title: "Straight answers.", intro: "The questions people ask first." },
      brief: { title: "Send a brief", intro: "Write what you need. I reply within 24 hours, also with a no." },
      about: { title: "About", intro: "Work today, background and community." },
      play: { title: "Play", intro: "A brick-breaker built from the CV." },
    },
    extra: {
      stack: "Auth, data models, integrations and AI agents that hold up with real users.",
    },
  },
} as const satisfies Readonly<Record<WorldCopyId, WorldCopy>>;
