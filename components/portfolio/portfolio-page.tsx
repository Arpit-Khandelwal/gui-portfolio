"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Copy,
  Mail,
  MapPin,
  Route,
  Send,
  Sparkles,
  Terminal,
  Twitter,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import {
  architectureNodes,
  badFits,
  buyerModes,
  checklistItems,
  experience,
  focusAreas,
  goodFits,
  profile,
  projectArchive,
  proofMetrics,
  proofTimeline,
  selectedWork,
  skills,
  socials,
  sprintStages,
  sprintSteps,
  sprintTimelines,
  sprintTypes,
  workModes,
} from "./data";
import { buildApiSnippet, buildChecklistText, buildSprintBrief, copyText, getAgentAnswer } from "./helpers";
import { CaseStudyDrawer } from "./case-study-drawer";
import { OptionGroup } from "./option-group";
import { ThemeSwitcher } from "./theme-switcher";

export function PortfolioPage() {
  const [buyerMode, setBuyerMode] = useState<(typeof buyerModes)[number]["id"]>("founder");
  const [workMode, setWorkMode] = useState<(typeof workModes)[number]["id"]>("operator");
  const [sprintType, setSprintType] = useState<string>(sprintTypes[0]);
  const [sprintTimeline, setSprintTimeline] = useState<string>(sprintTimelines[1]);
  const [sprintStage, setSprintStage] = useState<string>(sprintStages[1]);
  const [activeArchitecture, setActiveArchitecture] = useState<string>(architectureNodes[0].id);
  const [agentQuestion, setAgentQuestion] = useState("Can Arpit build an MCP server for a product workflow?");
  const [agentResponse, setAgentResponse] = useState(getAgentAnswer("Can Arpit build an MCP server for a product workflow?"));
  const [selectedCase, setSelectedCase] = useState<(typeof selectedWork)[number] | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);

  const activeBuyer = buyerModes.find((mode) => mode.id === buyerMode) ?? buyerModes[0];
  const activeMode = workModes.find((mode) => mode.id === workMode) ?? workModes[0];
  const architecture = architectureNodes.find((node) => node.id === activeArchitecture) ?? architectureNodes[0];

  const sprintBrief = useMemo(() => {
    return buildSprintBrief({
      briefGoal: activeBuyer.briefGoal,
      sprintStage,
      sprintTimeline,
      sprintType,
    });
  }, [activeBuyer.briefGoal, sprintStage, sprintTimeline, sprintType]);

  const mailHref = `mailto:${profile.email}?subject=${encodeURIComponent("AI/backend build sprint")}&body=${encodeURIComponent(sprintBrief)}`;
  const apiSnippet = buildApiSnippet({
    buyerLabel: activeBuyer.label,
    sprintTimeline,
    sprintType,
  });

  const copyBriefAndOpenX = async () => {
    await copyText(sprintBrief, setCopiedBrief);
    window.open(profile.x, "_blank", "noopener,noreferrer");
  };

  return (
    <main className={`portfolio-shell theme-${workMode} min-h-screen overflow-hidden pb-24 md:pb-0`}>
      <nav className="site-nav fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
            Arpit K.
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#offer" className="transition hover:opacity-100">Offer</a>
            <a href="#configurator" className="transition hover:opacity-100">Sprint</a>
            <a href="#work" className="transition hover:opacity-100">Proof</a>
            <a href="#contact" className="transition hover:opacity-100">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <ThemeSwitcher modes={workModes} value={workMode} onChange={setWorkMode} compact />
            </div>
            <a href={profile.x} target="_blank" rel="noreferrer" className="primary-button inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold">
              <Twitter className="size-4" />
              DM me
            </a>
          </div>
        </div>
      </nav>

      <section className="relative min-h-svh border-b border-[color:var(--line)] pt-20">
        <div className="absolute inset-0 hero-grid opacity-90" />
        <div className="hero-fade absolute inset-x-0 bottom-0 h-24" />

        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 border-y border-[color:var(--line-strong)] py-2 pr-4 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              <Sparkles className="size-4 text-[color:var(--accent-2)]" />
              {activeBuyer.eyebrow}
            </div>

            <div className="mb-7 flex flex-wrap gap-2">
              {buyerModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={buyerMode === mode.id}
                  onClick={() => setBuyerMode(mode.id)}
                  className={`mode-button ${buyerMode === mode.id ? "mode-button-active" : ""}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="mb-8 lg:hidden">
              <ThemeSwitcher modes={workModes} value={workMode} onChange={setWorkMode} />
            </div>

            <h1 className="text-[clamp(3.05rem,7.5vw,8rem)] font-black uppercase leading-[0.78] tracking-normal">
              Arpit
              <span className="block text-[color:var(--accent)]">Khandelwal</span>
            </h1>
            <p className="mt-8 max-w-3xl text-xl font-semibold leading-8 md:text-2xl md:leading-9">{activeBuyer.promise}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] md:text-lg">{activeBuyer.body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button type="button" onClick={copyBriefAndOpenX} className="primary-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                Copy brief + open X
                <Send className="size-5" />
              </button>
              <a href="#work" className="secondary-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                See shipped systems
                <ArrowRight className="size-5" />
              </a>
            </div>
            <p className="mt-3 min-h-6 font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]" aria-live="polite">
              {copiedBrief ? "Brief copied. Paste it into the X DM." : "Primary path: X DM."}
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {activeBuyer.tags.map((item) => (
                <div key={item} className="border-t border-[color:var(--line)] pt-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[430px] lg:ml-auto lg:mr-0">
            <div className="absolute inset-0 rotate-[-3deg] bg-[color:var(--ink)]" />
            <Image
              src={profile.avatar}
              alt="Arpit Khandelwal"
              fill
              priority
              sizes="(max-width: 768px) calc(100vw - 4.5rem), 460px"
              unoptimized
              className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-cover saturate-110"
            />
            <div className="photo-caption absolute -bottom-5 left-4 right-4 border border-white/15 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-50">Best fit</p>
                  <p className="mt-1 text-lg font-semibold">Ambiguous AI/backend work that needs to ship</p>
                </div>
                <Terminal className="size-8 text-[color:var(--accent-2)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--line)] px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Theme switcher</p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{activeMode.note}</p>
          </div>
          <ThemeSwitcher modes={workModes} value={workMode} onChange={setWorkMode} />
        </div>
      </section>

      <section id="offer" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-24">
        <div>
          <p className="section-kicker">What I build</p>
          <h2 className="section-title mt-4">Senior execution for the awkward middle.</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {focusAreas.map((area) => (
            <article key={area.label} className="border-t border-[color:var(--line)] pt-6">
              <area.icon className="mb-6 size-8 text-[color:var(--accent)]" />
              <h3 className="text-xl font-bold">{area.label}</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{area.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-section border-y border-[color:var(--line)] py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[0.62fr_1.38fr] md:px-8">
          <div>
            <p className="section-kicker">Good fit / bad fit</p>
            <h2 className="mt-4 max-w-md text-3xl font-black uppercase leading-[0.95] md:text-5xl">
              Stronger yes by making the no obvious.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border-l border-[color:var(--line)] pl-5">
              <h3 className="mb-5 text-xl font-black">Good fit</h3>
              <div className="space-y-4">
                {goodFits.map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-[color:var(--accent-2)]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-l border-[color:var(--line)] pl-5">
              <h3 className="mb-5 text-xl font-black">Bad fit</h3>
              <div className="space-y-4">
                {badFits.map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]">
                    <X className="mt-1 size-5 shrink-0 text-[color:var(--muted)]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="configurator" className="dark-section py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 grid gap-8 md:grid-cols-[0.74fr_1.26fr]">
            <div>
              <p className="section-kicker text-[color:var(--accent-2)]">Sprint configurator</p>
              <h2 className="section-title mt-4 text-[color:var(--dark-text)]">Turn the ask into a brief.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--dark-muted)] md:text-lg">
              Choose the sprint shape. Copy the DM.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <OptionGroup title="Work type" options={sprintTypes} value={sprintType} onChange={setSprintType} />
              <OptionGroup title="Timeline" options={sprintTimelines} value={sprintTimeline} onChange={setSprintTimeline} />
              <OptionGroup title="Current state" options={sprintStages} value={sprintStage} onChange={setSprintStage} />
            </div>
            <div className="border border-white/12 bg-white/[0.04] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">DM brief</p>
                <button type="button" onClick={() => copyText(sprintBrief, setCopiedBrief)} className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--dark-text)]">
                  <Copy className="size-4" />
                  {copiedBrief ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-7 text-[color:var(--dark-muted)]">{sprintBrief}</pre>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={copyBriefAndOpenX} className="light-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                  Copy brief + open X
                  <Twitter className="size-5" />
                </button>
                <a href={mailHref} className="dark-secondary-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                  Send by email
                  <Mail className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="dark-section border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 grid gap-8 md:grid-cols-[0.74fr_1.26fr]">
            <div>
              <p className="section-kicker text-[color:var(--accent-2)]">Build sprint</p>
              <h2 className="section-title mt-4 text-[color:var(--dark-text)]">A short loop around a shipped outcome.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--dark-muted)] md:text-lg">
              Built for teams that know the product direction and need the risky AI/backend piece shipped.
            </p>
          </div>

          <div className="grid gap-px bg-white/12 md:grid-cols-4">
            {sprintSteps.map((step) => (
              <article key={step.title} className="bg-[color:var(--dark)] p-6">
                <div className="mb-9 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">{step.label}</span>
                  <step.icon className="size-6 text-white/50" />
                </div>
                <h3 className="text-xl font-black">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[color:var(--dark-muted)]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--line)] py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.72fr_1.28fr] md:px-8">
          <div>
            <p className="section-kicker">Operating proof</p>
            <h2 className="section-title mt-4">Evidence before adjectives.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {proofMetrics.map((metric) => (
              <div key={metric.label} className="border-t border-[color:var(--line)] pt-5">
                <p className="text-5xl font-black leading-none text-[color:var(--accent)] md:text-6xl">{metric.value}</p>
                <h3 className="mt-4 text-lg font-black uppercase tracking-normal">{metric.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="dark-section py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-kicker text-[color:var(--accent-2)]">Case studies</p>
              <h2 className="section-title mt-4 text-[color:var(--dark-text)]">Proof through shipped work.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--dark-muted)] md:text-lg">
              Click a row for the deeper proof.
            </p>
          </div>

          <div className="divide-y divide-white/12 border-y border-white/12">
            {selectedWork.map((work, index) => (
              <article key={work.title} className="work-row grid gap-6 py-8 md:grid-cols-[0.1fr_0.34fr_0.36fr_0.2fr] md:items-start">
                <div className="font-mono text-sm text-white/38">{String(index + 1).padStart(2, "0")}</div>
                <button type="button" onClick={() => setSelectedCase(work)} className="group text-left">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent-2)]">{work.type} / {work.period}</p>
                  <h3 className="mt-3 text-3xl font-black tracking-normal text-[color:var(--dark-text)] md:text-5xl">{work.title}</h3>
                  <p className="mt-4 text-sm font-semibold text-[color:var(--dark-muted)]">{work.credibility}</p>
                </button>
                <button type="button" onClick={() => setSelectedCase(work)} className="text-left">
                  <p className="text-sm leading-6 text-[color:var(--dark-muted)]">
                    <span className="font-semibold text-[color:var(--dark-text)]">Shipped:</span> {work.shipped}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {work.stack.map((item) => (
                      <span key={item} className="rounded-full border border-white/14 px-3 py-1 text-xs text-white/58">
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
                <div className="flex flex-wrap items-center gap-3 md:justify-end md:text-right">
                  <button type="button" onClick={() => setSelectedCase(work)} className="secondary-dark-link inline-flex items-center gap-2 text-sm font-semibold">
                    View case
                    <ArrowRight className="size-4" />
                  </button>
                  <a href={work.href} target="_blank" rel="noreferrer" className="secondary-dark-link inline-flex items-center gap-2 text-sm font-semibold">
                    Open
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="soft-section border-y border-[color:var(--line)] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.74fr_1.26fr] md:px-8">
          <div>
            <p className="section-kicker">Architecture map</p>
            <h2 className="section-title mt-4">Where I plug into the stack.</h2>
          </div>
          <div>
            <div className="grid gap-px bg-[color:var(--line)] sm:grid-cols-3 lg:grid-cols-6">
              {architectureNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveArchitecture(node.id)}
                  className={`architecture-node ${activeArchitecture === node.id ? "architecture-node-active" : ""}`}
                >
                  <node.icon className="mx-auto mb-4 size-7" />
                  {node.label}
                </button>
              ))}
            </div>
            <div className="mt-6 border border-[color:var(--line)] bg-[color:var(--panel)] p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Selected layer</p>
                  <h3 className="mt-2 text-3xl font-black">{architecture.label}</h3>
                </div>
                <Route className="size-8 text-[color:var(--accent)]" />
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{architecture.text}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {architecture.projects.map((project) => (
                  <span key={project} className="rounded-full border border-[color:var(--line)] px-3 py-1 text-sm text-[color:var(--muted)]">
                    {project}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid border-b border-[color:var(--line)] lg:grid-cols-2">
        <div className="px-5 py-20 md:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <p className="section-kicker">Ask the portfolio</p>
          <h2 className="mt-4 max-w-xl text-4xl font-black uppercase leading-[0.9] md:text-6xl">
            A tiny local agent over the proof.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
            Local, fast answers from the proof on this page.
          </p>
        </div>
        <div className="soft-section border-t border-[color:var(--line)] px-5 py-20 md:px-8 lg:border-l lg:border-t-0 lg:pr-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <div className="border border-[color:var(--line)] bg-[color:var(--panel)] p-5">
            <textarea
              value={agentQuestion}
              onChange={(event) => setAgentQuestion(event.target.value)}
              className="min-h-28 w-full resize-none border border-[color:var(--line)] bg-transparent p-4 text-base outline-none focus:border-[color:var(--accent)]"
              aria-label="Ask about Arpit"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => setAgentResponse(getAgentAnswer(agentQuestion))} className="primary-button inline-flex h-11 items-center gap-2 rounded-full px-5 font-semibold">
                Ask
                <Bot className="size-5" />
              </button>
              {["Can he build backend APIs?", "What about Solana?", "How much does it cost?"].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => {
                    setAgentQuestion(question);
                    setAgentResponse(getAgentAnswer(question));
                  }}
                  className="secondary-button rounded-full px-4 text-sm font-semibold"
                >
                  {question}
                </button>
              ))}
            </div>
            <div className="mt-6 border-t border-[color:var(--line)] pt-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">Answer</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{agentResponse}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-28">
        <div>
          <p className="section-kicker">Proof timeline</p>
          <h2 className="section-title mt-4">The through-line.</h2>
        </div>
        <div className="space-y-0 border-y border-[color:var(--line)]">
          {proofTimeline.map(([label, text]) => (
            <div key={label} className="grid gap-4 border-b border-[color:var(--line)] py-6 last:border-b-0 md:grid-cols-[0.22fr_0.78fr]">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--accent)]">{label}</p>
              <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dark-section px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="section-kicker text-[color:var(--accent-2)]">Portfolio as API</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black uppercase leading-[0.9] text-[color:var(--dark-text)] md:text-6xl">
              A developer-native hire signal.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-6 text-[color:var(--dark-muted)]">
              Inputs, timeline, outputs, and proof in one static shape.
            </p>
          </div>
          <pre className="overflow-x-auto border border-white/12 bg-white/[0.04] p-5 text-sm leading-7 text-[color:var(--dark-muted)]">
            {apiSnippet}
          </pre>
        </div>
      </section>

      <section className="soft-section border-b border-[color:var(--line)] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="section-kicker">Lead magnet</p>
            <h2 className="section-title mt-4">AI backend sprint checklist.</h2>
          </div>
          <div className="border border-[color:var(--line)] bg-[color:var(--panel)] p-6">
            <div className="grid gap-5 md:grid-cols-5">
              {checklistItems.map((item, index) => (
                <div key={item} className="border-t border-[color:var(--line)] pt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">0{index + 1}</p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{item}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => copyText(buildChecklistText(checklistItems), setCopiedChecklist)}
              className="primary-button mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold"
            >
              <Copy className="size-5" />
              {copiedChecklist ? "Checklist copied" : "Copy checklist"}
            </button>
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-28">
        <div>
          <p className="section-kicker">Experience</p>
          <h2 className="section-title mt-4">From enterprise security to agentic product work.</h2>
        </div>
        <div className="space-y-8">
          {experience.map((item) => (
            <article key={item.company} className="grid gap-4 border-t border-[color:var(--line)] pt-6 md:grid-cols-[0.35fr_0.65fr]">
              <div>
                <h3 className="text-2xl font-black">{item.company}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{item.period}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="section-kicker">Toolbox</p>
            <h2 className="section-title mt-4">Fast across agents, APIs, and infra.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {skills.map((skill) => (
              <div key={skill.name} className="toolbox-card group">
                <div className="grid size-10 place-items-center bg-[color:var(--ink)] text-[color:var(--accent-2)] transition group-hover:bg-[color:var(--accent)] group-hover:text-white">
                  <skill.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black md:text-base">{skill.name}</p>
                  <p className="mt-1 truncate font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--muted)]">{skill.label}</p>
                </div>
              </div>
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
            <a key={title} href={href} target="_blank" rel="noreferrer" className="archive-link group border-t border-[color:var(--line)] pt-5">
              <div className="flex items-start justify-between gap-5">
                <h3 className="text-xl font-bold">{title}</h3>
                <ArrowUpRight className="size-5 shrink-0 text-[color:var(--muted)] transition group-hover:text-[color:var(--accent)]" />
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <footer id="contact" className="footer-section px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="section-kicker">Contact</p>
            <h2 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-8xl">
              Send the sprint. I will tell you what can ship.
            </h2>
          </div>
          <div className="md:text-right">
            <div className="mb-6 flex items-center gap-2 md:justify-end">
              <MapPin className="size-5" />
              <span className="font-semibold">{profile.location}</span>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <button type="button" onClick={copyBriefAndOpenX} className="primary-button inline-flex h-14 items-center gap-3 rounded-full px-7 text-lg font-bold">
                Copy brief + open X
                <Zap className="size-5" />
              </button>
              {socials.map((social) => (
                <a key={social.label} href={social.href} target={social.href.startsWith("mailto:") ? undefined : "_blank"} rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"} aria-label={social.label} className="icon-link grid size-14 place-items-center rounded-full border">
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <div className="mobile-sticky fixed inset-x-0 bottom-0 z-40 border-t p-3 md:hidden">
        <div className="flex gap-2">
          <button type="button" onClick={copyBriefAndOpenX} className="primary-button inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold">
            DM sprint
            <Twitter className="size-4" />
          </button>
          <a href="#work" className="secondary-button inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold">
            Proof
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      <CaseStudyDrawer selectedCase={selectedCase} onClose={() => setSelectedCase(null)} />
    </main>
  );
}
