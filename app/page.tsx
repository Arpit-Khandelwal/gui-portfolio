"use client";

import {
  ArrowUpRight,
  Bot,
  Boxes,
  Braces,
  Cloud,
  Code2,
  Container,
  Database,
  FileCode2,
  Film,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MapPin,
  Network,
  Play,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Twitter,
  Waypoints,
  Zap,
} from "lucide-react";
import Image from "next/image";

const profile = {
  name: "Arpit Khandelwal",
  role: "Software engineer building at the intersection of AI agents, crypto, and dev tooling.",
  location: "Bengaluru, India",
  email: "ak@arpitkhandelwal.com",
  avatar: "https://avatars.githubusercontent.com/u/68700864?v=4",
  socials: [
    { label: "GitHub", href: "https://github.com/arpit-khandelwal", icon: Github },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arpit-khandelwal-0812aa1a3/", icon: Linkedin },
    { label: "X", href: "https://x.com/ArpitKhandelwa3", icon: Twitter },
  ],
};

const focusAreas = [
  {
    label: "Agentic systems",
    icon: Bot,
    text: "MCP servers, browser automation, RAG workflows, and agents that can operate across messy real-world surfaces.",
  },
  {
    label: "Private crypto apps",
    icon: Braces,
    text: "Solana, Arcium, ZK proofs, vaults, micropayments, Blinks, and privacy-preserving product experiments.",
  },
  {
    label: "Security-minded infra",
    icon: ShieldCheck,
    text: "Microservices, DAST integrations, API orchestration, devops, and production instincts from enterprise security work.",
  },
];

const selectedWork = [
  {
    title: "Reskilll Platform",
    type: "Event infra",
    href: "https://reskilll.com",
    period: "2025 - 2026",
    summary:
      "Authored product and platform commits across Reskilll codebases, including OTP login, Google OAuth, profile APIs, dashboard/profile editing, CMS console, event judging, and submission flows.",
    stack: ["Next.js", "Express", "MongoDB", "Auth"],
    metric: "110 commits / 755 files",
  },
  {
    title: "Dark Payroll",
    type: "Privacy infra",
    href: "https://github.com/Arpit-Khandelwal/dark-payroll",
    period: "2026",
    summary:
      "A private payroll system on Solana that hides salary data on-chain while proving compliance with ZK proofs, built with ShadowWire and Range.",
    stack: ["Solana", "ZK proofs", "Privacy", "TypeScript"],
    metric: "Private payroll",
  },
  {
    title: "AgentPay",
    type: "Agent protocol",
    href: "https://github.com/Arpit-Khandelwal/agentpay",
    period: "2026",
    summary:
      "A streaming micropayment protocol for agent-to-agent services on Solana, exploring payment rails for autonomous software.",
    stack: ["Solana", "Agents", "Payments", "TypeScript"],
    metric: "Agent commerce",
  },
  {
    title: "Swiggy MCP Server",
    type: "AI automation",
    href: "https://avici.money",
    period: "2025",
    summary:
      "Built an MCP server for Avici Money that let an AI concierge operate inside Swiggy through Playwright-backed session automation.",
    stack: ["MCP", "Playwright", "LLMs", "Backend"],
    metric: "Closed API surface",
  },
  {
    title: "Gossip DAO",
    type: "Social product",
    href: "https://gossip-dao.vercel.app",
    period: "2025",
    summary:
      "A privacy-focused anonymous community app built during Zugrama residency, reaching 50+ users and 200+ posts in 24 hours.",
    stack: ["Next.js", "Solana", "Prisma", "TypeScript"],
    metric: "200+ posts day one",
  },
  {
    title: "Helius Indexer",
    type: "Data infra",
    href: "https://helius-indexer.arpitkhandelwal.com",
    period: "2024",
    summary:
      "A Solana indexing platform that pipes Helius webhook data into Postgres so teams can query chain activity without custom plumbing.",
    stack: ["Solana", "Helius", "Postgres", "Node.js"],
    metric: "Webhook to SQL",
  },
];

const proofMetrics = [
  {
    value: "85",
    label: "public GitHub repos",
    detail: "Across Arpit-Khandelwal, spanning AI, crypto, automation, dev tooling, and experiments.",
  },
  {
    value: "71",
    label: "original public repos",
    detail: "Non-fork public repositories on Arpit-Khandelwal, with TypeScript leading the stack.",
  },
  {
    value: "110",
    label: "authored work commits",
    detail: "Counted from local Reskilll repos across Arpit Khandelwal and eren-reskilll identities.",
  },
  {
    value: "503",
    label: "CP practice commits",
    detail: "Competitive-programming repository activity across Codeforces, CodeChef, LeetCode, and Striver-style practice.",
  },
];

const projectArchive = [
  ["CPP Practice", "503-commit competitive-programming practice archive across C++ problem solving tracks.", "https://github.com/Arpit-Khandelwal/CPP-Practice"],
  ["LinkPeek", "URL metadata previewer built during the Kiro v Claude hackathon cycle.", "https://github.com/Arpit-Khandelwal/linkpeek-metadata-previewer"],
  ["Encrypted Games", "Confidential on-chain games built on Arcium's encrypted computation layer.", "https://github.com/Arpit-Khandelwal/encrypted-games"],
  ["Mouse Cursor AI", "AI-powered pointer for guided accessibility and interface navigation.", "https://github.com/Arpit-Khandelwal/mouse-cursor-ai"],
  ["YouTube Downloader", "FFmpeg pipeline for audio and video exports.", "https://yt.arpitkhandelwal.com"],
  ["GitHub Leaderboard", "Ranks open-source contribution activity with GitHub API data.", "https://leaderboard.arpitkhandelwal.com"],
  ["Blinks", "Solana Actions for betting, gated NFTs, and quizzes.", "https://actions.arpitkhandelwal.com/api/actions"],
  ["100xNFT", "Solana NFT minting gate for the 100x Devs cohort.", "https://nft.arpitkhandelwal.com"],
  ["Video Trimmer", "Frame-aware video trimming and merge utility.", "https://github.com/arpit-khandelwal?tab=repositories&q=Video+Trimmer"],
  ["Real Estate WhatsApp Bot", "AI-assisted property workflow over WhatsApp.", "https://github.com/arpit-khandelwal?tab=repositories&q=Real+Estate+WhatsApp+Chatbot"],
];

const experience = [
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

const skills = [
  { name: "TypeScript", label: "Product code", icon: FileCode2 },
  { name: "Next.js", label: "App framework", icon: Code2 },
  { name: "Node.js", label: "Backend runtime", icon: Server },
  { name: "Python", label: "Automation", icon: Terminal },
  { name: "Solana", label: "Onchain apps", icon: Braces },
  { name: "Arcium", label: "Encrypted compute", icon: ShieldCheck },
  { name: "ZK proofs", label: "Privacy layer", icon: Network },
  { name: "Rust", label: "Programs", icon: Boxes },
  { name: "C++", label: "CP reps", icon: Code2 },
  { name: "LLMs", label: "Agent brains", icon: Bot },
  { name: "MCP", label: "Tool protocol", icon: Network },
  { name: "Hono", label: "API layer", icon: Server },
  { name: "Playwright", label: "Browser ops", icon: Play },
  { name: "Postgres", label: "Data layer", icon: Database },
  { name: "Prisma", label: "ORM", icon: Waypoints },
  { name: "Docker", label: "Shipping", icon: Container },
  { name: "Kubernetes", label: "Infra", icon: Container },
  { name: "AWS", label: "Cloud", icon: Cloud },
  { name: "Cloudflare Workers", label: "Edge runtime", icon: Cloud },
  { name: "FFmpeg", label: "Media pipeline", icon: Film },
  { name: "Web scraping", label: "No-API work", icon: Globe2 },
];

export default function Portfolio() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f1e8] text-[#15110d]">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-[#f6f1e8]/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
            Arpit K.
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-black/65 md:flex">
            <a href="#work" className="transition hover:text-black">Work</a>
            <a href="#experience" className="transition hover:text-black">Experience</a>
            <a href="#contact" className="transition hover:text-black">Contact</a>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#15110d] px-4 text-sm font-semibold text-white transition hover:bg-[#d84f2a]"
          >
            <Mail className="size-4" />
            Email
          </a>
        </div>
      </nav>

      <section className="relative min-h-svh border-b border-black/10 pt-20">
        <div className="absolute inset-0 hero-grid opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f6f1e8] to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-14 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr] md:px-8">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 border-y border-black/20 py-2 pr-4 font-mono text-xs uppercase tracking-[0.2em] text-black/62">
              <Sparkles className="size-4 text-[#d84f2a]" />
              Available for serious builds
            </div>
            <h1 className="max-w-4xl text-[clamp(3.35rem,6.2vw,6.9rem)] font-black uppercase leading-[0.8] tracking-normal">
              Arpit
              <span className="block text-[#d84f2a]">Khandelwal</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-black/68 md:text-2xl md:leading-9">
              {profile.role} I ship the glue between LLMs, browsers, Solana, privacy systems, and production backends.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#15110d] px-6 font-semibold text-white transition hover:bg-[#d84f2a]"
              >
                View selected work
                <ArrowUpRight className="size-5" />
              </a>
              <div className="flex items-center gap-3">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-12 place-items-center rounded-full border border-black/15 bg-white/45 transition hover:border-[#d84f2a] hover:text-[#d84f2a]"
                  >
                    <social.icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] lg:ml-auto lg:mr-0">
            <div className="absolute inset-0 rotate-[-4deg] rounded-[2rem] bg-[#15110d]" />
            <Image
              src={profile.avatar}
              alt="Arpit Khandelwal"
              fill
              priority
              sizes="(max-width: 768px) calc(100vw - 4.5rem), 488px"
              unoptimized
              className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-[1.45rem] object-cover saturate-110"
            />
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/15 bg-[#15110d]/92 p-5 text-white shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">Current stack</p>
                  <p className="mt-1 text-lg font-semibold">AI agents + private crypto + dev tooling</p>
                </div>
                <Terminal className="size-8 text-[#f0c15a]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-28">
        <div>
          <p className="section-kicker">What I build</p>
          <h2 className="section-title mt-4">Useful software at the edge of automation.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {focusAreas.map((area) => (
            <article key={area.label} className="border-t border-black/18 pt-6">
              <area.icon className="mb-8 size-8 text-[#d84f2a]" />
              <h3 className="text-xl font-bold">{area.label}</h3>
              <p className="mt-4 leading-7 text-black/62">{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#ede3d4] py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.72fr_1.28fr] md:px-8">
          <div>
            <p className="section-kicker">Operating proof</p>
            <h2 className="section-title mt-4">Signals from the workbench.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {proofMetrics.map((metric) => (
              <div key={metric.label} className="border-t border-black/18 pt-5">
                <p className="text-5xl font-black leading-none text-[#d84f2a] md:text-6xl">{metric.value}</p>
                <h3 className="mt-4 text-lg font-black uppercase tracking-normal">{metric.label}</h3>
                <p className="mt-3 leading-7 text-black/58">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="bg-[#15110d] py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-kicker text-[#f0c15a]">Selected work</p>
              <h2 className="section-title mt-4 text-white">Proof through shipped systems.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/62">
              A portfolio should make the bet obvious. Mine is that small teams can ship ambitious products when the engineer can move across AI agents, privacy infrastructure, product UI, and protocol constraints.
            </p>
          </div>

          <div className="divide-y divide-white/12 border-y border-white/12">
            {selectedWork.map((work, index) => (
              <a
                key={work.title}
                href={work.href}
                target="_blank"
                rel="noreferrer"
                className="work-row group grid gap-6 py-8 transition md:grid-cols-[0.18fr_0.34fr_0.34fr_0.14fr] md:items-center"
              >
                <div className="font-mono text-sm text-white/38">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#f0c15a]">{work.type} / {work.period}</p>
                  <h3 className="mt-3 text-3xl font-black tracking-normal text-white md:text-5xl">{work.title}</h3>
                </div>
                <div>
                  <p className="leading-7 text-white/62">{work.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {work.stack.map((item) => (
                      <span key={item} className="rounded-full border border-white/14 px-3 py-1 text-xs text-white/58">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 md:block md:text-right">
                  <p className="text-sm font-semibold text-white/72">{work.metric}</p>
                  <ArrowUpRight className="mt-3 size-7 text-[#d84f2a] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[0.85fr_1.15fr] md:px-8 md:py-28">
        <div>
          <p className="section-kicker">Archive</p>
          <h2 className="section-title mt-4">Smaller builds, sharp edges, useful reps.</h2>
        </div>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {projectArchive.map(([title, text, href]) => (
            <a key={title} href={href} target="_blank" rel="noreferrer" className="archive-link group border-t border-black/16 pt-5">
              <div className="flex items-start justify-between gap-5">
                <h3 className="text-xl font-bold">{title}</h3>
                <ArrowUpRight className="size-5 shrink-0 text-black/35 transition group-hover:text-[#d84f2a]" />
              </div>
              <p className="mt-3 leading-7 text-black/62">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="experience" className="border-y border-black/10 bg-[#ede3d4] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[0.72fr_1.28fr] md:px-8">
          <div>
            <p className="section-kicker">Experience</p>
            <h2 className="section-title mt-4">From enterprise security to agentic product work.</h2>
          </div>
          <div className="space-y-8">
            {experience.map((item) => (
              <article key={item.company} className="grid gap-4 border-t border-black/18 pt-6 md:grid-cols-[0.35fr_0.65fr]">
                <div>
                  <h3 className="text-2xl font-black">{item.company}</h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-black/45">{item.period}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="mt-3 leading-7 text-black/62">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="section-kicker">Toolbox</p>
            <h2 className="section-title mt-4">Fast across agents, crypto, and infra.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {skills.map((skill) => (
              <div key={skill.name} className="toolbox-card group">
                <div className="grid size-10 place-items-center rounded-xl bg-[#15110d] text-[#f0c15a] transition group-hover:bg-[#d84f2a] group-hover:text-white">
                  <skill.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#15110d] md:text-base">{skill.name}</p>
                  <p className="mt-1 truncate font-mono text-[0.68rem] uppercase tracking-[0.14em] text-black/42">{skill.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#d84f2a] px-5 py-16 text-[#15110d] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="section-kicker text-[#15110d]/65">Contact</p>
            <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-8xl">
              Bring me in when the product needs to move.
            </h2>
          </div>
          <div className="md:text-right">
            <div className="mb-6 flex items-center gap-2 md:justify-end">
              <MapPin className="size-5" />
              <span className="font-semibold">{profile.location}</span>
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex h-14 items-center gap-3 rounded-full bg-[#15110d] px-7 text-lg font-bold text-white transition hover:bg-white hover:text-[#15110d]"
            >
              {profile.email}
              <Zap className="size-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
