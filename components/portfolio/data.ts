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
  Profile,
  ProofMetric,
  Skill,
  Social,
  SprintStep,
  WorkMode,
} from "./types";

export const profile: Profile = {
  name: "Arpit Khandelwal",
  role: "Fractional AI & backend engineer for build sprints.",
  location: "Bengaluru, India",
  email: "ak@arpitkhandelwal.com",
  avatar: "https://avatars.githubusercontent.com/u/68700864?v=4",
  x: "https://x.com/ArpitKhandelwa3",
  github: "https://github.com/Arpit-Khandelwal",
  linkedin: "https://www.linkedin.com/in/arpit-khandelwal-0812aa1a3/",
  resume: "https://cv.arpitkhandelwal.com",
};

export const availability = {
  status: "1 sprint slot open for July",
  reply: "Replies within 24 hours",
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
    eyebrow: "For founder-led build sprints",
    promise: "Ship the AI/backend piece without hiring a full team.",
    body: "Scoped APIs, agents, automations, dashboards, and handoff docs in 2-6 week sprints.",
    tags: ["Fast scope", "Weekly demos", "Production path"],
    briefGoal: "a founder-led AI/backend sprint",
  },
  {
    id: "ai-team",
    label: "AI team",
    eyebrow: "For AI product teams",
    promise: "Turn agent demos into systems that survive real users.",
    body: "MCP servers, browser automation, retrieval, auth, data stores, and workflow orchestration.",
    tags: ["MCP", "Browser ops", "RAG workflows"],
    briefGoal: "an AI agent or automation sprint",
  },
  {
    id: "crypto",
    label: "Crypto infra",
    eyebrow: "For protocol and infra teams",
    promise: "Add backend, agent, and privacy rails around crypto products.",
    body: "Solana, Arcium, Helius, ZK, indexing, and payment experiments turned into product systems.",
    tags: ["Solana", "Privacy infra", "Data pipelines"],
    briefGoal: "a crypto/backend infrastructure sprint",
  },
  {
    id: "recruiter",
    label: "Recruiter",
    eyebrow: "For teams hiring a hands-on engineer",
    promise: "A builder who moves from infra constraints to shipped product.",
    body: "HPE security tooling, Avici AI concierge work, Reskilll platform execution, and public AI/crypto builds.",
    tags: ["Backend", "AI agents", "Security-minded"],
    briefGoal: "a fractional or full-time engineering conversation",
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
    text: "MCP servers, RAG, browser automation, tool use, and messy workflow execution.",
  },
  {
    label: "Backend systems and APIs",
    icon: Server,
    text: "Auth, dashboards, ingestion, API orchestration, Postgres/MongoDB, and production glue.",
  },
  {
    label: "Privacy and crypto infra",
    icon: ShieldCheck,
    text: "Solana, Arcium, ZK, Helius, vaults, micropayments, and privacy experiments.",
  },
];

export const sprintSteps: readonly SprintStep[] = [
  {
    title: "Scope the path",
    label: "Week 0",
    icon: ClipboardCheck,
    text: "Turn the fuzzy ask into interfaces, risks, and a sprint target.",
  },
  {
    title: "Build the core",
    label: "Weeks 1-4",
    icon: GitPullRequest,
    text: "Ship APIs, agents, integrations, data stores, and product surfaces.",
  },
  {
    title: "Demo every week",
    label: "Cadence",
    icon: MessagesSquare,
    text: "Working demos, tradeoff notes, and clear next moves.",
  },
  {
    title: "Handoff cleanly",
    label: "Close",
    icon: Timer,
    text: "Merged PRs, setup notes, operating context, and next steps.",
  },
];

export const proofMetrics: readonly ProofMetric[] = [
  {
    value: "2-6",
    label: "week build sprints",
    detail: "A fuzzy ask or broken integration turned into a demoable, merged system.",
  },
  {
    value: "200+",
    label: "posts, day one",
    detail: "Gossip DAO launch: a privacy-first community app with 50+ users in 24 hours.",
  },
  {
    value: "5+",
    label: "years shipping",
    detail: "AI agents, backend APIs, automation, and crypto infra since 2021.",
  },
  {
    value: "10+",
    label: "case-grade builds",
    detail: "From the Reskilll platform to Dark Payroll, Helius indexing, and the Arcium privacy suite.",
  },
];

export const selectedWork: readonly CaseStudy[] = [
  {
    title: "Reskilll Platform",
    type: "Product backend",
    href: "https://reskilll.com",
    period: "2025 - 2026",
    status: "shipped",
    problem: "Event/community software needed auth, profiles, judging, dashboards, and submissions.",
    shipped:
      "OTP login, Google OAuth, profile APIs, dashboards, CMS console, judging, and submissions.",
    stack: ["Next.js", "Express", "MongoDB", "Auth"],
    credibility: "Live platform: auth, CMS, judging, dashboards",
    proof: ["Owned auth and profile surfaces", "Built operational dashboard flows", "Moved across frontend, backend, and CMS logic"],
  },
  {
    title: "Swiggy MCP Server",
    type: "AI automation",
    href: "https://avici.money",
    period: "2025",
    status: "shipped",
    problem: "An AI concierge needed to operate inside a closed consumer surface.",
    shipped:
      "A Playwright-backed MCP server for controlled browser-session operation.",
    stack: ["MCP", "Playwright", "LLMs", "Backend"],
    credibility: "AI concierge ran on a closed consumer app",
    proof: ["Tool layer for an AI concierge", "Browser-session automation", "Backend control surface around a third-party UI"],
  },
  {
    title: "Gossip DAO",
    type: "Product launch",
    href: "https://gossip-dao.vercel.app",
    period: "2025",
    status: "shipped",
    problem: "A residency community needed a fast anonymous social product people would use.",
    shipped:
      "A privacy-focused community app that hit 50+ users and 200+ posts within 24 hours.",
    stack: ["Next.js", "Solana", "Prisma", "TypeScript"],
    credibility: "50+ users, 200+ posts in 24h",
    proof: ["Fast product launch", "Privacy-focused social flow", "Immediate community usage"],
  },
  {
    title: "Helius Indexer",
    type: "Data infra",
    href: "https://helius-indexer.arpitkhandelwal.com",
    period: "2024",
    status: "shipped",
    problem: "Solana teams needed queryable chain activity without custom webhook plumbing.",
    shipped:
      "A webhook-to-Postgres indexer for faster on-chain event inspection.",
    stack: ["Solana", "Helius", "Postgres", "Node.js"],
    credibility: "Chain events to queryable Postgres, live",
    proof: ["Webhook ingestion", "SQL query layer", "Chain data made product-readable"],
  },
  {
    title: "Dark Payroll",
    type: "Privacy infra",
    href: "https://github.com/Arpit-Khandelwal/dark-payroll",
    period: "2026",
    status: "shipped",
    problem: "Payroll products need salary privacy without losing compliance proof.",
    shipped:
      "A Solana payroll app with hidden salary data and ZK compliance proofs, with a live demo.",
    stack: ["Solana", "ZK proofs", "Privacy", "TypeScript"],
    credibility: "Live demo: ZK payroll + compliance proofs",
    proof: ["Privacy-preserving payroll", "Compliance proof framing", "Solana Privacy Hackathon 2026 build"],
  },
  {
    title: "Arcium Privacy Suite",
    type: "Confidential compute",
    href: "https://github.com/Arpit-Khandelwal?tab=repositories",
    period: "2025 - 2026",
    status: "experiment",
    problem: "On-chain apps leak their inputs; most teams cannot compute on encrypted data.",
    shipped:
      "Five Arcium confidential-compute apps: private voting, a sealed tip jar, an encrypted message board, a secure lottery, and an encrypted calculator.",
    stack: ["Arcium", "Rust", "Solana", "MPC"],
    credibility: "5 confidential-compute apps on Arcium",
    proof: ["Hands-on MPC / encrypted compute", "Reusable privacy primitives", "Backs the privacy-infra positioning"],
  },
  {
    title: "AgentPay",
    type: "Agent protocol",
    href: "https://github.com/Arpit-Khandelwal/agentpay",
    period: "2026",
    status: "experiment",
    problem: "Autonomous agents need payment rails for streamed machine-to-machine services.",
    shipped:
      "A Solana streaming micropayment protocol exploration for agent services (hackathon build).",
    stack: ["Solana", "Agents", "Payments", "TypeScript"],
    credibility: "Agent payment protocol (hackathon)",
    proof: ["Payment model for agent services", "Streaming settlement direction", "Protocol-shaped product thinking"],
  },
  {
    title: "sold.",
    type: "Privacy demo",
    href: "https://sold.arpitkhandelwal.com",
    period: "2026",
    status: "experiment",
    problem: "Ad-tech profiles and prices you from browser signals before you ever consent.",
    shipped:
      "A page that reads the signals your browser leaks on arrival, sends them to an LLM that profiles and prices you, then confesses exactly what it did and stores nothing.",
    stack: ["LLMs", "OpenRouter", "Fingerprinting", "Next.js"],
    credibility: "Priced-on-arrival privacy provocation",
    proof: ["Live browser-signal profiling", "LLM persona and price generation", "Zero-storage, full-disclosure design"],
  },
  {
    title: "x402 Web Services",
    type: "Agent payments",
    href: "https://x402.arpitkhandelwal.com",
    period: "2026",
    status: "experiment",
    problem: "Agents and APIs need pay-per-use access without subscriptions or accounts.",
    shipped:
      "A live pay-as-you-go app on the x402 protocol: per-message AI chat and a pay-once URL shortener, settled with micropayments.",
    stack: ["x402", "Solana", "Payments", "Next.js"],
    credibility: "Live pay-per-use services on x402",
    proof: ["HTTP-402 paywall integration", "Per-call micropayment settlement", "Reinforces the AgentPay direction"],
  },
];

export const projectArchive: readonly ArchiveItem[] = [
  ["Atlas", "AI chatbot for the Solana ecosystem with RAG-backed answers.", "https://solchat.arpitkhandelwal.com"],
  ["Sage Aadit", "AI therapist with weekly check-ins over indexed journal entries.", "https://sage-aadit.arpitkhandelwal.com"],
  ["Ion", "Solana voting dApp plus a native-SOL deposit/withdraw vault.", "https://ion.arpitkhandelwal.com"],
  ["100xNFT", "Gated Solana NFT minting for the 100x Devs cohort.", "https://nft.arpitkhandelwal.com"],
  ["Video Trimmer", "Frame-accurate trim and merge across mixed resolutions.", "https://video-trimmer.arpitkhandelwal.com"],
  ["XOXO", "Every tic-tac-toe game (all 255,168) as a branching, censused game tree with a minimax oracle.", "https://xoxo.arpitkhandelwal.com"],
  ["YouTube Downloader", "FFmpeg pipeline for audio and video exports.", "https://yt.arpitkhandelwal.com"],
  ["GitHub Leaderboard", "Open-source contribution ranking via the GitHub API.", "https://leaderboard.arpitkhandelwal.com"],
  ["WhatsApp Automation", "AI-assisted property and messaging workflows over WhatsApp.", "https://github.com/Arpit-Khandelwal/whatsapp-api"],
  ["Blinks", "Solana Actions for betting, gated NFTs, and quizzes.", "https://actions.arpitkhandelwal.com/api/actions"],
  ["Poop Tracker (MicrobiomeDAO)", "Microbiome tracking app shipped for an external DAO.", "https://github.com/MicrobiomeDAO/poop-tracker"],
  ["CPP Practice", "494-commit competitive-programming archive.", "https://github.com/Arpit-Khandelwal/CPP-Practice"],
];

export const experience: readonly Experience[] = [
  {
    company: "Freelance",
    title: "Software Developer",
    period: "2021 - Present",
    text: "Automation pipelines, social bots, scrapers, creator tooling, LLM workflows, and crypto experiments.",
  },
  {
    company: "Avici Money",
    title: "AI and Backend Engineer",
    period: "Jan 2025 - Jul 2025",
    text: "AI concierge infrastructure for ordering, booking, and task execution.",
  },
  {
    company: "Hewlett Packard Enterprise",
    title: "Software Developer 1",
    period: "2023 - 2024",
    text: "Microservice integrations for WebInspect, Burp Suite, OWASP ZAP, and OpenVAS.",
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
  "AI tools, browsers, memory, retrieval, or automation.",
  "Backend/API prototypes that need a production path.",
  "Auth, data, dashboards, payments, agents, or infra glue.",
] as const;

export const badFits = [
  "Pure landing-page polish.",
  "Vague ideas without scope, users, or decisions.",
  "Meeting-heavy discovery with little shipped code.",
] as const;

export const sprintTypes = ["AI agent", "Backend API", "Browser automation", "Crypto/privacy infra"] as const;
export const sprintTimelines = ["2 weeks", "4 weeks", "6 weeks"] as const;
export const sprintStages = ["Idea to spec", "Prototype exists", "Broken integration", "Scaling/handoff"] as const;

export const architectureNodes: readonly ArchitectureNode[] = [
  {
    id: "llm",
    label: "LLM",
    icon: Bot,
    text: "Tool contracts, memory, retrieval, and product constraints around the model.",
    projects: ["Swiggy MCP Server", "Mouse Cursor AI"],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Network,
    text: "MCP servers, browser sessions, APIs, queues, and guarded actions.",
    projects: ["Swiggy MCP Server", "AgentPay"],
  },
  {
    id: "browser",
    label: "Browser",
    icon: Globe2,
    text: "Closed workflows made controllable when APIs do not exist.",
    projects: ["Swiggy MCP Server", "WhatsApp Automation"],
  },
  {
    id: "api",
    label: "API",
    icon: Server,
    text: "Auth, orchestration, permissions, storage, and predictable state.",
    projects: ["Reskilll Platform", "Helius Indexer"],
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    text: "Clean movement between chain events, tables, logs, and user actions.",
    projects: ["Helius Indexer", "Reskilll Platform"],
  },
  {
    id: "ship",
    label: "Ship",
    icon: GitPullRequest,
    text: "Merged PRs, demos, handoff notes, and an owner who can keep going.",
    projects: ["Gossip DAO", "Reskilll Platform"],
  },
];

export const proofTimeline = [
  ["HPE", "Enterprise security tooling and microservice integrations around DAST surfaces."],
  ["Avici", "AI concierge infrastructure for ordering, booking, and task execution."],
  ["Reskilll", "Auth, profiles, CMS, judging, submissions, and dashboards."],
  ["Public labs", "Agent payments, private payroll, encrypted games, indexing, and automation."],
  ["Now", "AI/backend build sprints for teams that need senior execution."],
] as const;

export const engagementGet = [
  "Merged, production-path code, not slideware.",
  "Weekly working demos and tradeoff notes.",
  "Auth, data, and logging done properly.",
  "Handoff docs so your team can keep shipping.",
] as const;

export const engagementTerms = [
  ["Model", "Fixed-scope sprints, 2-6 weeks."],
  ["Pricing", "Flat per-sprint, tied to a shipped outcome. No hourly billing."],
  ["Start", "Scoping call within 48h; the sprint begins once scope is signed off."],
  ["Reply", "Within 24 hours, always."],
] as const;

export const faqs: readonly Faq[] = [
  {
    q: "How does pricing work?",
    a: "Sprints are fixed-scope, fixed-window engagements (2-6 weeks). After a short scoping call I send a flat sprint price tied to a clear shipped outcome, no hourly billing. Send the goal, stack, and deadline and I will quote the smallest useful slice.",
  },
  {
    q: "What do you actually ship?",
    a: "Working, merged code: APIs, AI agents and MCP servers, browser automations, dashboards, and data pipelines, plus weekly demos and handoff notes so your team can keep going.",
  },
  {
    q: "Can you join an existing codebase?",
    a: "Yes. Most sprints are about finishing the awkward middle: a broken integration, a demo that needs a production path, or an agent that has to survive real users.",
  },
  {
    q: "What is the fastest way to start?",
    a: "Use the sprint configurator to generate a brief, then send it. I reply within 24 hours with whether it is a fit and the smallest shippable scope.",
  },
  {
    q: "Full-time or sprints only?",
    a: "Primarily fractional build sprints, but open to fractional-to-full-time conversations for AI and backend roles.",
  },
];

export const checklistItems = [
  "Name the user-facing outcome.",
  "List external systems.",
  "Demo the riskiest workflow first.",
  "Define auth, data, and logs.",
  "Ship weekly PRs, demos, and notes.",
] as const;

export const socials: readonly Social[] = [
  { label: "GitHub", href: profile.github, icon: Github },
  { label: "X", href: profile.x, icon: Twitter },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];
