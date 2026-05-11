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
    body: "I turn ambiguous product bets into scoped APIs, agents, automations, dashboards, and handoff docs in focused 2-6 week sprints.",
    tags: ["Fast scope", "Weekly demos", "Production path"],
    briefGoal: "a founder-led AI/backend sprint",
  },
  {
    id: "ai-team",
    label: "AI team",
    eyebrow: "For AI product teams",
    promise: "Turn agent demos into systems that survive real users.",
    body: "I build the tool layer around LLMs: MCP servers, browser automation, retrieval, auth, data stores, and workflow orchestration.",
    tags: ["MCP", "Browser ops", "RAG workflows"],
    briefGoal: "an AI agent or automation sprint",
  },
  {
    id: "crypto",
    label: "Crypto infra",
    eyebrow: "For protocol and infra teams",
    promise: "Add backend, agent, and privacy rails around crypto products.",
    body: "I bring Solana, Arcium, Helius, ZK, indexing, and payment experiments into product-shaped backend systems.",
    tags: ["Solana", "Privacy infra", "Data pipelines"],
    briefGoal: "a crypto/backend infrastructure sprint",
  },
  {
    id: "recruiter",
    label: "Recruiter",
    eyebrow: "For teams hiring a hands-on engineer",
    promise: "A builder who can move from infra constraints to shipped product.",
    body: "My path runs through HPE security tooling, Avici AI concierge work, Reskilll platform execution, and public AI/crypto experiments.",
    tags: ["Backend", "AI agents", "Security-minded"],
    briefGoal: "a fractional or full-time engineering conversation",
  },
] as const satisfies readonly BuyerMode[];

export type BuyerModeId = (typeof buyerModes)[number]["id"];

export const workModes = [
  {
    id: "operator",
    label: "Operator",
    note: "Clean funnel for founders who need a finisher.",
  },
  {
    id: "terminal",
    label: "Terminal",
    note: "Darker, code-forward mode for technical buyers.",
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
    text: "MCP servers, RAG workflows, browser automation, LLM tool use, and product workflows that operate across messy real-world surfaces.",
  },
  {
    label: "Backend systems and APIs",
    icon: Server,
    text: "Auth, dashboards, data ingestion, API orchestration, Postgres/MongoDB flows, and the glue code that turns prototypes into usable systems.",
  },
  {
    label: "Privacy and crypto infra",
    icon: ShieldCheck,
    text: "Solana, Arcium, ZK proofs, Helius pipelines, vaults, micropayments, and privacy-preserving product experiments when the system needs it.",
  },
];

export const sprintSteps: readonly SprintStep[] = [
  {
    title: "Scope the path",
    label: "Week 0",
    icon: ClipboardCheck,
    text: "Convert a fuzzy AI/backend ask into interfaces, data flow, risks, milestones, and a shippable sprint target.",
  },
  {
    title: "Build the core",
    label: "Weeks 1-4",
    icon: GitPullRequest,
    text: "Ship production code across APIs, agents, automations, integrations, data stores, and the product surface around them.",
  },
  {
    title: "Demo every week",
    label: "Cadence",
    icon: MessagesSquare,
    text: "Keep the loop tight with working demos, tradeoff notes, and clear next moves instead of vague status updates.",
  },
  {
    title: "Handoff cleanly",
    label: "Close",
    icon: Timer,
    text: "Leave behind merged PRs, setup notes, operational context, and a system your team can keep improving.",
  },
];

export const proofMetrics: readonly ProofMetric[] = [
  {
    value: "2-6",
    label: "week build sprints",
    detail: "The offer: focused execution for startups that need a useful system shipped, not a long consulting loop.",
  },
  {
    value: "110",
    label: "authored work commits",
    detail: "Counted from local Reskilll repos across Arpit Khandelwal and eren-reskilll identities.",
  },
  {
    value: "85",
    label: "public GitHub repos",
    detail: "Across AI, crypto, automation, backend tooling, experiments, and open-source practice.",
  },
  {
    value: "503",
    label: "CP practice commits",
    detail: "Competitive-programming repository activity across Codeforces, CodeChef, LeetCode, and Striver-style practice.",
  },
];

export const selectedWork: readonly CaseStudy[] = [
  {
    title: "Reskilll Platform",
    type: "Product backend",
    href: "https://reskilll.com",
    period: "2025 - 2026",
    problem: "Event and community software needed reliable auth, profiles, judging, dashboards, and submission flows.",
    shipped:
      "OTP login, Google OAuth, profile APIs, dashboard/profile editing, CMS console, event judging, and submission workflows.",
    stack: ["Next.js", "Express", "MongoDB", "Auth"],
    credibility: "110 commits / 755 files",
    proof: ["Owned auth and profile surfaces", "Built operational dashboard flows", "Moved across frontend, backend, and CMS logic"],
  },
  {
    title: "Swiggy MCP Server",
    type: "AI automation",
    href: "https://avici.money",
    period: "2025",
    problem: "An AI concierge needed to complete ordering flows inside a closed consumer surface.",
    shipped:
      "A Playwright-backed MCP server that let the assistant operate browser sessions through a controlled backend interface.",
    stack: ["MCP", "Playwright", "LLMs", "Backend"],
    credibility: "Closed API surface",
    proof: ["Tool layer for an AI concierge", "Browser-session automation", "Backend control surface around a third-party UI"],
  },
  {
    title: "Helius Indexer",
    type: "Data infra",
    href: "https://helius-indexer.arpitkhandelwal.com",
    period: "2024",
    problem: "Solana teams needed queryable chain activity without building webhook plumbing from scratch.",
    shipped:
      "A webhook-to-Postgres indexing platform so product teams can inspect and query on-chain events faster.",
    stack: ["Solana", "Helius", "Postgres", "Node.js"],
    credibility: "Webhook to SQL",
    proof: ["Webhook ingestion", "SQL query layer", "Chain data made product-readable"],
  },
  {
    title: "AgentPay",
    type: "Agent protocol",
    href: "https://github.com/Arpit-Khandelwal/agentpay",
    period: "2026",
    problem: "Autonomous agents need payment rails that work for streamed services and machine-to-machine usage.",
    shipped:
      "A Solana streaming micropayment protocol exploration for agent-to-agent services and autonomous software commerce.",
    stack: ["Solana", "Agents", "Payments", "TypeScript"],
    credibility: "Agent commerce",
    proof: ["Payment model for agent services", "Streaming settlement direction", "Protocol-shaped product thinking"],
  },
  {
    title: "Dark Payroll",
    type: "Privacy infra",
    href: "https://github.com/Arpit-Khandelwal/dark-payroll",
    period: "2026",
    problem: "Payroll products need salary privacy without losing compliance proofs or operational auditability.",
    shipped:
      "A private payroll system on Solana that hides salary data on-chain while proving compliance with ZK proofs.",
    stack: ["Solana", "ZK proofs", "Privacy", "TypeScript"],
    credibility: "Private payroll",
    proof: ["Privacy-preserving payroll concept", "Compliance proof framing", "ZK and Solana experimentation"],
  },
  {
    title: "Gossip DAO",
    type: "Product launch",
    href: "https://gossip-dao.vercel.app",
    period: "2025",
    problem: "A residency community needed a fast anonymous social product with enough trust and UX to get used immediately.",
    shipped:
      "A privacy-focused anonymous community app built during Zugrama residency, reaching 50+ users and 200+ posts in 24 hours.",
    stack: ["Next.js", "Solana", "Prisma", "TypeScript"],
    credibility: "200+ posts day one",
    proof: ["Fast product launch", "Privacy-focused social flow", "Immediate community usage"],
  },
];

export const projectArchive: readonly ArchiveItem[] = [
  ["Mouse Cursor AI", "AI-powered pointer for guided accessibility and interface navigation.", "https://github.com/Arpit-Khandelwal/mouse-cursor-ai"],
  ["LinkPeek", "URL metadata previewer built during the Kiro v Claude hackathon cycle.", "https://github.com/Arpit-Khandelwal/linkpeek-metadata-previewer"],
  ["Encrypted Games", "Confidential on-chain games built on Arcium's encrypted computation layer.", "https://github.com/Arpit-Khandelwal/encrypted-games"],
  ["YouTube Downloader", "FFmpeg pipeline for audio and video exports.", "https://yt.arpitkhandelwal.com"],
  ["GitHub Leaderboard", "Ranks open-source contribution activity with GitHub API data.", "https://leaderboard.arpitkhandelwal.com"],
  ["Real Estate WhatsApp Bot", "AI-assisted property workflow over WhatsApp.", "https://github.com/arpit-khandelwal?tab=repositories&q=Real+Estate+WhatsApp+Chatbot"],
  ["Blinks", "Solana Actions for betting, gated NFTs, and quizzes.", "https://actions.arpitkhandelwal.com/api/actions"],
  ["CPP Practice", "503-commit competitive-programming practice archive across C++ problem solving tracks.", "https://github.com/Arpit-Khandelwal/CPP-Practice"],
];

export const experience: readonly Experience[] = [
  {
    company: "Freelance",
    title: "Software Developer",
    period: "2021 - Present",
    text: "Built automation pipelines, social bots, web scrapers, creator tooling, LLM-backed workflows, and privacy-focused crypto experiments.",
  },
  {
    company: "Avici Money",
    title: "AI and Backend Engineer",
    period: "Jan 2025 - Jul 2025",
    text: "Developed AI concierge infrastructure for ordering, booking, and task execution through natural language interfaces.",
  },
  {
    company: "Hewlett Packard Enterprise",
    title: "Software Developer 1",
    period: "2023 - 2024",
    text: "Integrated microservices for DAST tooling including WebInspect, Burp Suite, OWASP ZAP, and OpenVAS.",
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
  "AI features that need tools, browsers, memory, retrieval, or workflow automation.",
  "Backend/API work where the prototype exists but the production path is still unclear.",
  "Integration-heavy products across auth, data, dashboards, payments, agents, or infra.",
] as const;

export const badFits = [
  "Pure landing-page polish with no product or backend problem behind it.",
  "Vague app ideas where nobody owns scope, users, or decisions.",
  "Long discovery cycles where meetings matter more than shipped code.",
] as const;

export const sprintTypes = ["AI agent", "Backend API", "Browser automation", "Crypto/privacy infra"] as const;
export const sprintTimelines = ["2 weeks", "4 weeks", "6 weeks"] as const;
export const sprintStages = ["Idea to spec", "Prototype exists", "Broken integration", "Scaling/handoff"] as const;

export const architectureNodes: readonly ArchitectureNode[] = [
  {
    id: "llm",
    label: "LLM",
    icon: Bot,
    text: "Prompting is the smallest piece. I build the surrounding tool contracts, memory, retrieval, and product constraints.",
    projects: ["Swiggy MCP Server", "Mouse Cursor AI"],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Network,
    text: "Agents become useful when they can call real tools safely: MCP servers, browser sessions, APIs, queues, and guarded actions.",
    projects: ["Swiggy MCP Server", "AgentPay"],
  },
  {
    id: "browser",
    label: "Browser",
    icon: Globe2,
    text: "When APIs do not exist, browser automation can turn closed workflows into controllable product surfaces.",
    projects: ["Swiggy MCP Server", "Real Estate WhatsApp Bot"],
  },
  {
    id: "api",
    label: "API",
    icon: Server,
    text: "The backend layer makes the demo repeatable: auth, orchestration, permissions, storage, and predictable state.",
    projects: ["Reskilll Platform", "Helius Indexer"],
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    text: "Useful AI/backend products need data to move cleanly between chain events, product tables, logs, and user actions.",
    projects: ["Helius Indexer", "Reskilll Platform"],
  },
  {
    id: "ship",
    label: "Ship",
    icon: GitPullRequest,
    text: "The sprint only counts when there are merged PRs, demos, handoff notes, and a product owner who can keep going.",
    projects: ["Gossip DAO", "Reskilll Platform"],
  },
];

export const proofTimeline = [
  ["HPE", "Enterprise security tooling and microservice integrations around DAST surfaces."],
  ["Avici", "AI concierge infrastructure for ordering, booking, and task execution."],
  ["Reskilll", "Product and platform commits across auth, profiles, CMS, judging, and submissions."],
  ["Public labs", "Agent payments, private payroll, encrypted games, indexing, and AI automation experiments."],
  ["Now", "Focused AI/backend build sprints for teams that need senior execution without a slow hiring loop."],
] as const;

export const checklistItems = [
  "Write the user-facing outcome in one sentence.",
  "List every external system the sprint must touch.",
  "Identify the riskiest workflow and demo it first.",
  "Define the minimum auth, data, and logging needed for real use.",
  "Ship weekly proof through PRs, demos, and handoff notes.",
] as const;

export const socials: readonly Social[] = [
  { label: "GitHub", href: profile.github, icon: Github },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];
