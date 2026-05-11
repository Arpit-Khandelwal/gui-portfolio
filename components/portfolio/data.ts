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
  Waypoints,
} from "lucide-react";
import type {
  ArchitectureNode,
  ArchiveItem,
  BuyerMode,
  CaseStudy,
  Experience,
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
  role: "Fractional AI/backend engineer for build sprints.",
  location: "Bengaluru, India",
  email: "ak@arpitkhandelwal.com",
  avatar: "https://avatars.githubusercontent.com/u/68700864?v=4",
  x: "https://x.com/ArpitKhandelwa3",
  github: "https://github.com/arpit-khandelwal",
  linkedin: "https://www.linkedin.com/in/arpit-khandelwal-0812aa1a3/",
};

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
    promise: "A builder who can move from infra constraints to shipped product.",
    body: "HPE security tooling, Avici AI concierge work, Reskilll platform execution, and public AI/crypto builds.",
    tags: ["Backend", "AI agents", "Security-minded"],
    briefGoal: "a fractional or full-time engineering conversation",
  },
] as const satisfies readonly BuyerMode[];

export type BuyerModeId = (typeof buyerModes)[number]["id"];

export const workModes = [
  {
    id: "operator",
    label: "Operator",
    note: "Clean sales page for founders who need a finisher.",
  },
  {
    id: "terminal",
    label: "Terminal",
    note: "Darker, code-forward page for technical buyers.",
  },
  {
    id: "blueprint",
    label: "Blueprint",
    note: "Architecture-first mode for systems work.",
  },
  {
    id: "proof",
    label: "Proof",
    note: "Evidence-heavy mode for skeptical evaluators.",
  },
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
    detail: "Focused execution for startups that need a useful system shipped.",
  },
  {
    value: "110",
    label: "authored work commits",
    detail: "Local Reskilll repo activity across two author identities.",
  },
  {
    value: "85",
    label: "public GitHub repos",
    detail: "AI, crypto, automation, backend tooling, and experiments.",
  },
  {
    value: "503",
    label: "CP practice commits",
    detail: "Competitive-programming activity across major practice tracks.",
  },
];

export const selectedWork: readonly CaseStudy[] = [
  {
    title: "Reskilll Platform",
    type: "Product backend",
    href: "https://reskilll.com",
    period: "2025 - 2026",
    problem: "Event/community software needed auth, profiles, judging, dashboards, and submissions.",
    shipped:
      "OTP login, Google OAuth, profile APIs, dashboards, CMS console, judging, and submissions.",
    stack: ["Next.js", "Express", "MongoDB", "Auth"],
    credibility: "110 commits / 755 files",
    proof: ["Owned auth and profile surfaces", "Built operational dashboard flows", "Moved across frontend, backend, and CMS logic"],
  },
  {
    title: "Swiggy MCP Server",
    type: "AI automation",
    href: "https://avici.money",
    period: "2025",
    problem: "An AI concierge needed to operate inside a closed consumer surface.",
    shipped:
      "A Playwright-backed MCP server for controlled browser-session operation.",
    stack: ["MCP", "Playwright", "LLMs", "Backend"],
    credibility: "Closed API surface",
    proof: ["Tool layer for an AI concierge", "Browser-session automation", "Backend control surface around a third-party UI"],
  },
  {
    title: "Helius Indexer",
    type: "Data infra",
    href: "https://helius-indexer.arpitkhandelwal.com",
    period: "2024",
    problem: "Solana teams needed queryable chain activity without custom webhook plumbing.",
    shipped:
      "A webhook-to-Postgres indexer for faster on-chain event inspection.",
    stack: ["Solana", "Helius", "Postgres", "Node.js"],
    credibility: "Webhook to SQL",
    proof: ["Webhook ingestion", "SQL query layer", "Chain data made product-readable"],
  },
  {
    title: "AgentPay",
    type: "Agent protocol",
    href: "https://github.com/Arpit-Khandelwal/agentpay",
    period: "2026",
    problem: "Autonomous agents need payment rails for streamed machine-to-machine services.",
    shipped:
      "A Solana streaming micropayment protocol exploration for agent services.",
    stack: ["Solana", "Agents", "Payments", "TypeScript"],
    credibility: "Agent commerce",
    proof: ["Payment model for agent services", "Streaming settlement direction", "Protocol-shaped product thinking"],
  },
  {
    title: "Dark Payroll",
    type: "Privacy infra",
    href: "https://github.com/Arpit-Khandelwal/dark-payroll",
    period: "2026",
    problem: "Payroll products need salary privacy without losing compliance proof.",
    shipped:
      "A Solana payroll concept with hidden salary data and ZK compliance proofs.",
    stack: ["Solana", "ZK proofs", "Privacy", "TypeScript"],
    credibility: "Private payroll",
    proof: ["Privacy-preserving payroll concept", "Compliance proof framing", "ZK and Solana experimentation"],
  },
  {
    title: "Gossip DAO",
    type: "Product launch",
    href: "https://gossip-dao.vercel.app",
    period: "2025",
    problem: "A residency community needed a fast anonymous social product people would use.",
    shipped:
      "A privacy-focused community app with 50+ users and 200+ posts in 24 hours.",
    stack: ["Next.js", "Solana", "Prisma", "TypeScript"],
    credibility: "200+ posts day one",
    proof: ["Fast product launch", "Privacy-focused social flow", "Immediate community usage"],
  },
];

export const projectArchive: readonly ArchiveItem[] = [
  ["Mouse Cursor AI", "AI-guided pointer for accessibility and UI navigation.", "https://github.com/Arpit-Khandelwal/mouse-cursor-ai"],
  ["LinkPeek", "URL metadata previewer built during the Kiro v Claude hackathon cycle.", "https://github.com/Arpit-Khandelwal/linkpeek-metadata-previewer"],
  ["Encrypted Games", "Confidential on-chain games on Arcium.", "https://github.com/Arpit-Khandelwal/encrypted-games"],
  ["YouTube Downloader", "FFmpeg pipeline for audio and video exports.", "https://yt.arpitkhandelwal.com"],
  ["GitHub Leaderboard", "Open-source activity ranking with GitHub API data.", "https://leaderboard.arpitkhandelwal.com"],
  ["Real Estate WhatsApp Bot", "AI-assisted property workflow over WhatsApp.", "https://github.com/arpit-khandelwal?tab=repositories&q=Real+Estate+WhatsApp+Chatbot"],
  ["Blinks", "Solana Actions for betting, gated NFTs, and quizzes.", "https://actions.arpitkhandelwal.com/api/actions"],
  ["CPP Practice", "503-commit competitive-programming archive.", "https://github.com/Arpit-Khandelwal/CPP-Practice"],
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
    projects: ["Swiggy MCP Server", "Real Estate WhatsApp Bot"],
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

export const checklistItems = [
  "Name the user-facing outcome.",
  "List external systems.",
  "Demo the riskiest workflow first.",
  "Define auth, data, and logs.",
  "Ship weekly PRs, demos, and notes.",
] as const;

export const socials: readonly Social[] = [
  { label: "GitHub", href: profile.github, icon: Github },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];
