// Copy follows ISO 24495-1 plain language, with STE-style sentence rules (ASD-STE100).
import {
  Bot,
  Boxes,
  Braces,
  ClipboardCheck,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  Film,
  Github,
  GitPullRequest,
  Globe2,
  Linkedin,
  Mail,
  MessagesSquare,
  Network,
  Play,
  Server,
  ShieldCheck,
  Terminal,
  Timer,
  Twitter,
  Waypoints,
} from "lucide-react";
import type {
  ArchitectureNode,
  ArchiveItem,
  BuyerMode,
  CaseStudy,
  Experience,
  Faq,
  IconText,
  OpenSourcePr,
  Profile,
  ProofMetric,
  Skill,
  Social,
  SprintStep,
  WorkMode,
} from "./types";

export const profile: Profile = {
  name: "Arpit Khandelwal",
  role: "Backend and AI-systems engineer. Tech lead at Reskilll, open to select build sprints.",
  location: "Bengaluru, India",
  email: "ak@arpitkhandelwal.com",
  avatar: "https://avatars.githubusercontent.com/u/68700864?v=4",
  x: "https://x.com/ArpitKhandelwa3",
  github: "https://github.com/Arpit-Khandelwal",
  linkedin: "https://www.linkedin.com/in/arpit-khandelwal-0812aa1a3/",
  resume: "https://cv.arpitkhandelwal.com",
};

/**
 * No trailing periods: agent files render `${status}. ${reply}.`.
 * Do not publish a month or a slot count here; none is confirmed.
 */
export const availability = {
  status: "At Reskilll, open to select sprints",
  reply: "Reply within 24 hours",
};

export const workedWith = [
  "Hewlett Packard Enterprise",
  "Avici Money",
  "Reskilll",
] as const;

export const buyerModes = [
  {
    id: "founder",
    label: "Founder",
    eyebrow: "For founder-led teams",
    promise: "Get the AI or backend part built without hiring a full team.",
    body: "I scope and build APIs, agents, automations and dashboards in 2-6 week sprints. You get handoff docs at the end.",
    tags: ["Fast scope", "Weekly demos", "Production path"],
    briefGoal: "a founder-led AI or backend sprint",
  },
  {
    id: "ai-team",
    label: "AI team",
    eyebrow: "For AI product teams",
    promise: "Turn an agent demo into a system that holds up with real users.",
    body: "MCP servers, browser automation, retrieval, auth, data stores and workflow orchestration.",
    tags: ["MCP", "Browser ops", "RAG workflows"],
    briefGoal: "an AI agent or automation sprint",
  },
  {
    id: "crypto",
    label: "Crypto infra",
    eyebrow: "For protocol and infra teams",
    promise: "Add backend, agent and privacy rails around a crypto product.",
    body: "I turn Solana, Arcium, Helius, ZK, indexing and payment experiments into product systems.",
    tags: ["Solana", "Privacy infra", "Data pipelines"],
    briefGoal: "a crypto or backend infrastructure sprint",
  },
  {
    id: "recruiter",
    label: "Recruiter",
    eyebrow: "For teams hiring a hands-on engineer",
    promise: "An engineer who goes from infra limits to a shipped product.",
    body: "Tech lead at Reskilll. Before that: AI concierge work at Avici and security tooling at HPE. Plus public AI and crypto builds.",
    tags: ["Backend", "AI agents", "Security-minded"],
    briefGoal: "a conversation about a senior AI or backend role",
  },
] as const satisfies readonly BuyerMode[];

export type BuyerModeId = (typeof buyerModes)[number]["id"];

export const workModes = [
  { id: "operator", label: "Light" },
  { id: "terminal", label: "Dark" },
] as const satisfies readonly WorkMode[];

export type WorkModeId = (typeof workModes)[number]["id"];

export const focusAreas: readonly IconText[] = [
  {
    label: "AI agents and automation",
    icon: Bot,
    text: "MCP servers, RAG, browser automation, tool calls, and workflows that have no clean API.",
  },
  {
    label: "Backend systems and APIs",
    icon: Server,
    text: "Auth, dashboards, ingestion, API orchestration, Postgres and MongoDB, and the glue between them.",
  },
  {
    label: "Privacy and crypto infra",
    icon: ShieldCheck,
    text: "Solana, Arcium, ZK, Helius, vaults, micropayments and privacy experiments.",
  },
];

export const sprintSteps: readonly SprintStep[] = [
  {
    title: "Scope the path",
    label: "Week 0",
    icon: ClipboardCheck,
    text: "Turn the loose request into interfaces, risks and one sprint target.",
  },
  {
    title: "Build the core",
    label: "Weeks 1-4",
    icon: GitPullRequest,
    text: "Build the APIs, agents, integrations, data stores and product screens.",
  },
  {
    title: "Demo every week",
    label: "Cadence",
    icon: MessagesSquare,
    text: "A working demo, notes on tradeoffs, and the next steps.",
  },
  {
    title: "Hand off cleanly",
    label: "Close",
    icon: Timer,
    text: "Merged PRs, setup notes, operating context and next steps.",
  },
];

export const proofMetrics: readonly ProofMetric[] = [
  {
    value: "50k+",
    label: "registrations",
    detail: "The Reskilll platform took them for a national hackathon on one t3.micro.",
  },
  {
    value: "200+",
    label: "posts, day one",
    detail: "Gossip DAO launch: a privacy-first community app with 50+ users in 24 hours.",
  },
  {
    value: "5+",
    label: "years shipping",
    detail: "AI agents, backend APIs, automation and crypto infra since 2021.",
  },
  {
    value: "10+",
    label: "case-grade builds",
    detail: "From the Reskilll platform to Dark Payroll, the Helius indexer and the Arcium privacy suite.",
  },
];

export const selectedWork: readonly CaseStudy[] = [
  {
    title: "Reskilll Platform",
    type: "Product backend",
    href: "https://reskilll.com",
    period: "2025 - Present",
    status: "shipped",
    problem: "Event and community software needed auth, profiles, judging, submissions and dashboards.",
    shipped:
      "I built the platform end to end: OTP and Google OAuth login, profile APIs, a CMS console, judging, submissions and organiser dashboards.",
    stack: ["Next.js", "Express", "MongoDB", "Auth"],
    credibility: "50k+ registrations on one t3.micro",
    proof: [
      "Took 50k+ registrations for a national hackathon",
      "Ran on one t3.micro instance",
      "Zero deployments after the dev close",
      "Held off spam and attacks",
    ],
    parts: ["OTP and OAuth", "CMS console", "Judging engine", "Organiser dashboards", "t3.micro host"],
  },
  {
    title: "Swiggy MCP Server",
    type: "AI automation",
    href: "https://avici.money",
    period: "2025",
    status: "shipped",
    problem: "An AI concierge had to operate inside a closed consumer app.",
    shipped: "A Playwright-backed MCP server that operates a controlled browser session.",
    stack: ["MCP", "Playwright", "LLMs", "Backend"],
    credibility: "AI concierge ran on a closed consumer app",
    proof: ["Tool layer for an AI concierge", "Browser-session automation", "Backend control around a third-party UI"],
    parts: ["AI concierge", "MCP server", "Playwright session", "Closed consumer app"],
  },
  {
    title: "Gossip DAO",
    type: "Product launch",
    href: "https://gossip-dao.vercel.app",
    period: "2025",
    status: "shipped",
    problem: "A residency community needed a fast, anonymous social product that people would use.",
    shipped: "A privacy-focused community app. It reached 50+ users and 200+ posts within 24 hours.",
    stack: ["Next.js", "Solana", "Prisma", "TypeScript"],
    credibility: "50+ users, 200+ posts in 24h",
    proof: ["Fast product launch", "Privacy-focused social flow", "Community use from day one"],
    parts: ["Anonymous feed", "Next.js app", "Prisma store", "Solana integration"],
  },
  {
    title: "Helius Indexer",
    type: "Data infra",
    href: "https://helius-indexer.arpitkhandelwal.com",
    period: "2024",
    status: "shipped",
    problem: "Solana teams needed to query chain activity without custom webhook plumbing.",
    shipped: "A webhook-to-Postgres indexer. Teams can inspect on-chain events with SQL.",
    stack: ["Solana", "Helius", "Postgres", "Node.js"],
    credibility: "Chain events to queryable Postgres, live",
    proof: ["Webhook ingestion", "SQL query layer", "Chain data that a product can read"],
    parts: ["Helius webhooks", "Ingest service", "Postgres tables", "SQL queries"],
  },
  {
    title: "Dark Payroll",
    type: "Privacy infra",
    href: "https://github.com/Arpit-Khandelwal/dark-payroll",
    period: "2026",
    status: "shipped",
    problem: "Payroll products must keep salaries private and still prove compliance.",
    shipped: "A Solana payroll app with hidden salary data and ZK compliance proofs. It has a live demo.",
    stack: ["Solana", "ZK proofs", "Privacy", "TypeScript"],
    credibility: "Live demo: ZK payroll and compliance proofs",
    proof: ["Private payroll", "Compliance proofs", "Built for the Solana Privacy Hackathon 2026"],
    parts: ["Payroll app", "Hidden salary data", "ZK proofs", "Solana chain"],
  },
  {
    title: "Arcium Privacy Suite",
    type: "Confidential compute",
    href: "https://github.com/Arpit-Khandelwal?tab=repositories",
    period: "2025 - 2026",
    status: "experiment",
    problem: "On-chain apps leak their inputs. Most teams cannot compute on encrypted data.",
    shipped:
      "Five Arcium confidential-compute apps: private voting, a sealed tip jar, an encrypted message board, a secure lottery and an encrypted calculator.",
    stack: ["Arcium", "Rust", "Solana", "MPC"],
    credibility: "5 confidential-compute apps on Arcium",
    proof: ["Hands-on MPC and encrypted compute", "Privacy parts that other apps can reuse", "Backs the privacy-infra work"],
    parts: ["Encrypted inputs", "Arcium MPC", "Solana programs", "Five apps"],
  },
  {
    title: "AgentPay",
    type: "Agent protocol",
    href: "https://github.com/Arpit-Khandelwal/agentpay",
    period: "2026",
    status: "experiment",
    problem: "Autonomous agents need a way to pay for services they use machine to machine.",
    shipped: "A hackathon build. It explores streaming Solana micropayments, so agents pay per request over HTTP 402.",
    stack: ["Solana", "Agents", "Payments", "TypeScript"],
    credibility: "Agent payment protocol (hackathon)",
    proof: ["Payment model for agent services", "Streaming settlement", "Thinks at the protocol level"],
    parts: ["Agent client", "HTTP 402 paywall", "Payment stream", "Solana settlement"],
  },
  {
    title: "sold.",
    type: "Privacy demo",
    href: "https://sold.arpitkhandelwal.com",
    period: "2026",
    status: "experiment",
    problem: "Ad tech profiles you and puts a price on you from browser signals, before you consent.",
    shipped:
      "A page that reads the signals your browser leaks on arrival. An LLM profiles you and sets your price. Then the page tells you exactly what it did, and it stores nothing.",
    stack: ["LLMs", "OpenRouter", "Fingerprinting", "Next.js"],
    credibility: "A privacy demo that prices you on arrival",
    proof: ["Live browser-signal profiling", "LLM persona and price", "Stores nothing, discloses everything"],
    parts: ["Browser signals", "LLM profiler", "Price tag", "Zero storage"],
  },
  {
    title: "x402 Web Services",
    type: "Agent payments",
    href: "https://x402.arpitkhandelwal.com",
    period: "2026",
    status: "experiment",
    problem: "Agents and APIs need pay-per-use access without subscriptions or accounts.",
    shipped:
      "A live pay-as-you-go app on the x402 protocol. It has a per-message AI chat and a pay-once URL shortener. Micropayments settle each call.",
    stack: ["x402", "Solana", "Payments", "Next.js"],
    credibility: "Live pay-per-use services on x402",
    proof: ["HTTP 402 paywall", "Micropayment for each call", "Extends the AgentPay work"],
    parts: ["x402 paywall", "Per-message chat", "URL shortener", "Solana micropayments"],
  },
  {
    title: "Leash",
    type: "Agent spend control",
    href: "https://github.com/Arpit-Khandelwal/leash",
    period: "2026",
    status: "experiment",
    problem: "You cannot give an AI agent a credit card without limits that the agent cannot change.",
    shipped:
      "An agent that renews, downgrades or cancels subscriptions inside a spend limit you approve once with a passkey. The Visa network declines any charge over the limit.",
    stack: ["Prava", "Visa Intelligent Commerce", "TypeScript", "Passkeys"],
    credibility: "Over-limit charges declined by Visa",
    proof: [
      "Built at the Agentic Commerce Hackathon, August 2026",
      "Reads live vendor pricing pages",
      "A pure policy engine decides; the LLM only explains",
    ],
    parts: ["Live pricing pages", "Policy engine", "Prava mandate", "Visa network", "LLM narrator"],
  },
  {
    title: "Slop Filter for LinkedIn",
    type: "Browser extension",
    href: "https://github.com/Arpit-Khandelwal/jev-linkedin-slop-filter",
    period: "2026",
    status: "experiment",
    problem: "LinkedIn feeds are full of engagement bait, corporate PR and bragging.",
    shipped:
      "A Chrome extension that stamps BAIT, CORP or BRAG on posts as they scroll into view. Jev, a typed model from TypeSafe, judges each post live.",
    stack: ["Chrome extension", "Jev", "LLMs", "Node.js"],
    credibility: "Zero false positives on 14 labelled samples",
    proof: [
      "Local keyword rules settle the obvious posts for free",
      "API key stays on a local server, not in the extension",
      "5 GitHub stars and about 530 views on the launch post",
    ],
    parts: ["Chrome extension", "Keyword rules", "Local proxy", "Jev model", "Post cache"],
  },
  {
    title: "GraveShift",
    type: "Cross-chain migration",
    href: "https://graveshift.arpitkhandelwal.com",
    period: "2026",
    status: "experiment",
    problem: "Owners of dead Ethereum and Polygon assets want to bring them back on Solana.",
    shipped:
      "A live app that checks you own a dead ERC-721, ERC-20 or ERC-1155 asset. You sign a proof, and it writes a migration record on Solana devnet.",
    stack: ["Solana", "Anchor", "EVM", "TypeScript"],
    credibility: "Built for the Solana Graveyard Hackathon",
    proof: ["EVM ownership check", "Signed ownership proof", "Migration record on Solana devnet"],
    parts: ["EVM wallet scan", "Ownership proof", "Anchor program", "Solana devnet"],
  },
];

export const projectArchive: readonly ArchiveItem[] = [
  ["XOXO", "All 255,168 tic-tac-toe games as one branching tree, with game counts and a minimax oracle.", "https://xoxo.arpitkhandelwal.com"],
  ["Atlas", "An AI chatbot for the Solana ecosystem, with answers from RAG.", "https://solchat.arpitkhandelwal.com"],
  ["Sage Aadit", "An AI therapist that checks in each week, using indexed journal entries.", "https://sage-aadit.arpitkhandelwal.com"],
  ["Ion", "A Solana voting dApp, plus a vault for native-SOL deposits and withdrawals.", "https://ion.arpitkhandelwal.com"],
  ["WhatsApp Automation", "AI-assisted property and messaging workflows over WhatsApp.", "https://github.com/Arpit-Khandelwal/whatsapp-api"],
  ["Video Trimmer", "Trims and merges video to the exact frame, across mixed resolutions.", "https://video-trimmer.arpitkhandelwal.com"],
  ["100xNFT", "Gated Solana NFT minting for the 100x Devs cohort.", "https://nft.arpitkhandelwal.com"],
  ["GitHub Leaderboard", "Ranks open-source contributions with the GitHub API.", "https://leaderboard.arpitkhandelwal.com"],
  ["Blinks", "Solana Actions for bets, gated NFTs and quizzes.", "https://actions.arpitkhandelwal.com/api/actions"],
  ["YouTube Downloader", "An FFmpeg pipeline that exports audio and video.", "https://yt.arpitkhandelwal.com"],
  ["Poop Tracker (MicrobiomeDAO)", "A microbiome tracking app, built for an external DAO.", "https://github.com/MicrobiomeDAO/poop-tracker"],
  ["CPP Practice", "A competitive-programming archive with 494 commits.", "https://github.com/Arpit-Khandelwal/CPP-Practice"],
];

const pr = (repo: string, number: number, title: string, state: OpenSourcePr["state"]): OpenSourcePr => ({
  repo,
  number,
  title,
  href: `https://github.com/${repo}/pull/${number}`,
  state,
});

/** Mirrors the `oss:start` block of github.com/Arpit-Khandelwal/Arpit-Khandelwal. */
export const openSource: readonly OpenSourcePr[] = [
  pr("anmolkapil/plexo", 159, 'Show "No peers found yet" and stop DHT retries after 30 s', "merged"),
  pr("anmolkapil/plexo", 140, "Add a Linux .tar.gz next to the AppImage, .deb and .rpm", "merged"),
  pr("anmolkapil/plexo", 153, "Group body chunks into fewer, larger disk writes", "merged"),
  pr("anmolkapil/plexo", 158, "Download from servers that give each byte range its own ETag (pCloud)", "merged"),
  pr("GopeedLab/gopeed", 1588, "Use 64 KiB read buffers on HTTP connections", "merged"),
  pr("neuralink/tsui", 30, "Load libX11 at runtime instead of linking it", "merged"),
  pr("anmolkapil/plexo", 150, "Keep the end-date calendar mounted; wait for history in a file-move test", "merged"),
  pr("anmolkapil/plexo", 151, "Re-render only the changed parts on each progress update", "merged"),
  pr("anmolkapil/plexo", 148, "At the DST jump, start and stop schedules whose time is skipped", "merged"),
  pr("anmolkapil/plexo", 149, 'Show "1m 0s", not "60s", when just under a minute is left', "merged"),
  pr("anmolkapil/plexo", 142, "Open the Linux tab before the download page tests use its panel", "merged"),
  pr("anmolkapil/plexo", 139, "Fall back to plain GET when a server refuses ranges with 403", "merged"),
  pr("anmolkapil/plexo", 144, "Shorten long names that have an early dot, not refuse the download", "merged"),
  pr("anmolkapil/plexo", 146, 'Show neither 100% before the last byte nor "undefined" for sub-byte speeds', "merged"),
  pr("Anil-matcha/open-spaces", 60, "Add Slop Filter for LinkedIn to the independent implementations", "merged"),
  pr("AbdelStark/awesome-typesafe-jev", 91, "Add Slop Filter for LinkedIn to the list", "merged"),
  pr("TryCaspian/caspian-sdk", 167, "Expose chat_type on Message so handlers can tell DMs from groups", "merged"),
  pr("ayghri/i-have-adhd", 63, "Remove the manifest hooks key that blocked the SessionStart hook", "merged"),
  pr("code100x/job-board", 499, "Add more sorting options for jobs", "merged"),
  pr("Reskilll/sdsi-demo", 2, "Add a prod-doc-triage productivity demo for a second persona", "in-review"),
  pr("Reskilll/sdsi-demo", 1, "Add a prod-doc-triage productivity demo for a first persona", "in-review"),
  pr("anmolkapil/plexo", 166, "Get a fresh signed URL from the original link when one expires", "in-review"),
  pr("GopeedLab/gopeed", 1597, "Replace the per-read goroutine in TimeoutReader with a timer", "in-review"),
  pr("neuralink/tsui", 37, "Add a help screen", "in-review"),
  pr("neuralink/tsui", 36, "Explain the NeedsMachineAuth state", "in-review"),
  pr("mlc-ai/xgrammar", 987, "Keep an escaped ^ at the start of a character class literal", "in-review"),
  pr("anmolkapil/plexo", 154, "Split the last blocks between free streams; stop the holder there", "in-review"),
  pr("sgl-project/sglang", 44240, "trinity: keep think tags inside tool-call arguments", "in-review"),
  pr("CopilotKit/CopilotKit", 7810, "Omit A2UI component schemas from catalog context when includeSchema is false", "in-review"),
  pr("neuralinkcorp/datarepo", 82, "Show a placeholder for unrenderable values in the SQL-filter catalog snippet", "in-review"),
  pr("XiaoMiku01/TetherKit", 12, "Do not chown -R the shared PrivilegedHelperTools directory on install", "in-review"),
];

export const community = [
  "I contribute to Superteam India.",
  "In May 2026, I judged more than 20 projects at a hackathon.",
  "I ran a Reskilll enterprise bootcamp in Spain.",
] as const;

export const experience: readonly Experience[] = [
  {
    company: "Reskilll",
    title: "Tech lead",
    period: "2025 - Present",
    text: "Built the platform end to end: auth, CMS, judging, submissions and dashboards. It took 50k+ hackathon registrations on one t3.micro.",
  },
  {
    company: "Freelance",
    title: "Software Developer",
    period: "2021 - Present",
    text: "Automation pipelines, social bots, scrapers, creator tools, LLM workflows and crypto experiments.",
  },
  {
    company: "Avici Money",
    title: "AI and Backend Engineer",
    period: "Jan 2025 - Jul 2025",
    text: "Agent orchestration for an AI concierge: tool calls, task routing and multi-step state for orders, bookings and tasks.",
  },
  {
    company: "Hewlett Packard Enterprise",
    title: "Software Developer 1",
    period: "2023 - 2024",
    text: "DAST microservices that join WebInspect, Burp Suite, OWASP ZAP and OpenVAS output into one pipeline.",
  },
];

export const skills: readonly Skill[] = [
  { name: "TypeScript", label: "Product code", icon: FileCode2 },
  { name: "Next.js", label: "App framework", icon: Code2 },
  { name: "Node.js", label: "Backend runtime", icon: Server },
  { name: "Python", label: "Automation", icon: Terminal },
  { name: "LLMs", label: "Agent brains", icon: Bot },
  { name: "MCP", label: "Tool protocol", icon: Network },
  { name: "Playwright", label: "Browser ops", icon: Play },
  { name: "Postgres", label: "Data layer", icon: Database },
  { name: "Hono", label: "API layer", icon: Server },
  { name: "Docker", label: "Shipping", icon: Container },
  { name: "Kubernetes", label: "Infra", icon: Container },
  { name: "AWS", label: "Cloud", icon: Cloud },
  { name: "Cloudflare Workers", label: "Edge runtime", icon: Cloud },
  { name: "Solana", label: "Onchain apps", icon: Braces },
  { name: "Arcium", label: "Encrypted compute", icon: ShieldCheck },
  { name: "ZK proofs", label: "Privacy layer", icon: Network },
  { name: "Rust", label: "Programs", icon: Boxes },
  { name: "Prisma", label: "ORM", icon: Waypoints },
  { name: "FFmpeg", label: "Media pipeline", icon: Film },
  { name: "Web scraping", label: "No-API work", icon: Globe2 },
];

export const goodFits = [
  "AI tools, browsers, memory, retrieval or automation.",
  "A backend or API prototype that needs a production path.",
  "Auth, data, dashboards, payments, agents or infra glue.",
] as const;

export const badFits = [
  "Landing-page polish only.",
  "A vague idea with no scope, users or decisions.",
  "Discovery that is mostly meetings and little code.",
] as const;

export const sprintTypes = ["AI agent", "Backend API", "Browser automation", "Crypto/privacy infra"] as const;
export const sprintTimelines = ["2 weeks", "4 weeks", "6 weeks"] as const;
export const sprintStages = ["Idea to spec", "Prototype exists", "Broken integration", "Scaling/handoff"] as const;

export const architectureNodes: readonly ArchitectureNode[] = [
  {
    id: "llm",
    label: "LLM",
    icon: Bot,
    text: "Tool contracts, memory, retrieval and product limits around the model.",
    projects: ["Swiggy MCP Server", "Leash"],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Network,
    text: "MCP servers, browser sessions, APIs, queues and guarded actions.",
    projects: ["Swiggy MCP Server", "AgentPay"],
  },
  {
    id: "browser",
    label: "Browser",
    icon: Globe2,
    text: "Closed workflows that I make controllable when no API exists.",
    projects: ["Swiggy MCP Server", "WhatsApp Automation"],
  },
  {
    id: "api",
    label: "API",
    icon: Server,
    text: "Auth, orchestration, permissions, storage and predictable state.",
    projects: ["Reskilll Platform", "Helius Indexer"],
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    text: "Clean paths between chain events, tables, logs and user actions.",
    projects: ["Helius Indexer", "Reskilll Platform"],
  },
  {
    id: "ship",
    label: "Ship",
    icon: GitPullRequest,
    text: "Merged PRs, demos, handoff notes, and an owner who can continue the work.",
    projects: ["Gossip DAO", "Reskilll Platform"],
  },
];

export const proofTimeline = [
  ["HPE", "Enterprise security tooling: DAST microservices for WebInspect, Burp Suite, OWASP ZAP and OpenVAS."],
  ["Avici", "Agent orchestration for an AI concierge that orders, books and runs tasks."],
  ["Reskilll", "Tech lead. Auth, CMS, judging, submissions and dashboards. 50k+ registrations on one t3.micro."],
  ["Public labs", "Agent payments, private payroll, encrypted apps, indexing, browser extensions and automation."],
  ["Now", "Tech lead at Reskilll. Select outside build sprints, one at a time."],
] as const;

export const engagementGet = [
  "Merged code with a production path, not slides.",
  "A working demo and tradeoff notes every week.",
  "Auth, data and logging done properly.",
  "Handoff docs, so your team can keep shipping.",
] as const;

export const engagementTerms = [
  ["Model", "Fixed-scope sprints of 2-6 weeks, one at a time."],
  ["Pricing", "A flat price per sprint, tied to a shipped result. No hourly billing."],
  ["Start", "A scoping call within 48h. The sprint starts after you sign off the written scope."],
  ["Reply", "Within 24 hours, every time."],
] as const;

export const faqs: readonly Faq[] = [
  {
    q: "How does pricing work?",
    a: "Each sprint has a fixed scope and a fixed length of 2-6 weeks. After a short scoping call, I send one flat price tied to a clear shipped result. I do not bill by the hour. Send the goal, the stack and the deadline, and I will quote the smallest useful slice.",
  },
  {
    q: "What do you actually ship?",
    a: "Working, merged code: APIs, AI agents and MCP servers, browser automations, dashboards and data pipelines. You also get a demo every week and handoff notes, so your team can continue the work.",
  },
  {
    q: "Can you join an existing codebase?",
    a: "Yes. Most sprints finish the awkward middle of a product. That can be a broken integration, a demo that needs a production path, or an agent that must hold up with real users.",
  },
  {
    q: "What is the fastest way to start?",
    a: "Use the sprint configurator to write a brief, then send it. I reply within 24 hours. The reply says if the work is a fit and names the smallest scope that can ship.",
  },
  {
    q: "Full-time or sprints only?",
    a: "I lead tech at Reskilll. Outside that, I take a small number of build sprints, one at a time. I am also open to a conversation about a senior AI or backend role.",
  },
];

export const checklistItems = [
  "Name the result the user will see.",
  "List the external systems.",
  "Demo the riskiest workflow first.",
  "Define auth, data and logs.",
  "Ship PRs, demos and notes every week.",
] as const;

export const socials: readonly Social[] = [
  { label: "GitHub", href: profile.github, icon: Github },
  { label: "X", href: profile.x, icon: Twitter },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];
