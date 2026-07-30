"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  MapPin,
  Moon,
  Route,
  Send,
  Sparkles,
  Sun,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import {
  architectureNodes,
  availability,
  badFits,
  buyerModes,
  checklistItems,
  engagementGet,
  engagementTerms,
  experience,
  faqs,
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
  workedWith,
} from "./data";
import { buildChecklistText, buildSprintBrief, copyText, sendContact } from "./helpers";
import { CaseStudyDrawer } from "./case-study-drawer";
import { OptionGroup } from "./option-group";

type ContactStatus = "idle" | "sending" | "sent" | "fallback";

export function PortfolioPage() {
  const [buyerMode, setBuyerMode] = useState<(typeof buyerModes)[number]["id"]>("founder");
  const [workMode, setWorkMode] = useState<"operator" | "terminal">("operator");
  const [sprintType, setSprintType] = useState<string>(sprintTypes[0]);
  const [sprintTimeline, setSprintTimeline] = useState<string>(sprintTimelines[1]);
  const [sprintStage, setSprintStage] = useState<string>(sprintStages[1]);
  const [activeArchitecture, setActiveArchitecture] = useState<string>(architectureNodes[0].id);
  const [selectedCase, setSelectedCase] = useState<(typeof selectedWork)[number] | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedChecklist, setCopiedChecklist] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [messageTouched, setMessageTouched] = useState(false);
  const [contactStatus, setContactStatus] = useState<ContactStatus>("idle");

  const activeBuyer = buyerModes.find((mode) => mode.id === buyerMode) ?? buyerModes[0];
  const architecture = architectureNodes.find((node) => node.id === activeArchitecture) ?? architectureNodes[0];
  const isDark = workMode === "terminal";

  const shippedWork = selectedWork.filter((work) => work.status === "shipped");
  const experimentWork = selectedWork.filter((work) => work.status === "experiment");

  const sprintBrief = useMemo(() => {
    return buildSprintBrief({
      briefGoal: activeBuyer.briefGoal,
      sprintStage,
      sprintTimeline,
      sprintType,
    });
  }, [activeBuyer.briefGoal, sprintStage, sprintTimeline, sprintType]);

  const messageValue = messageTouched ? contactMessage : sprintBrief;

  const onContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("sending");
    const result = await sendContact({
      name: contactName,
      email: contactEmail,
      message: messageValue,
    });
    if (result === "sent") {
      setContactStatus("sent");
      return;
    }
    setContactStatus("fallback");
    const subject = `Build sprint: ${activeBuyer.label}`;
    const body = `From: ${contactName} <${contactEmail}>\n\n${messageValue}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className={`portfolio-shell theme-${workMode} min-h-screen overflow-hidden pb-24 md:pb-0`}>
      <header className="site-nav fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
            Arpit K.
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#offer" className="transition hover:opacity-100">Offer</a>
            <a href="#configurator" className="transition hover:opacity-100">Sprint</a>
            <a href="#work" className="transition hover:opacity-100">Work</a>
            <a href="#faq" className="transition hover:opacity-100">FAQ</a>
            <a href="#contact" className="transition hover:opacity-100">Contact</a>
            <a href="/play" className="transition hover:opacity-100">Play</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWorkMode(isDark ? "operator" : "terminal")}
              className="theme-toggle grid size-10 place-items-center rounded-full border"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <a href="#contact" className="primary-button inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold">
              Start a sprint
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-svh border-b border-[color:var(--line)] pt-20">
          <div className="absolute inset-0 hero-grid opacity-90" />
          <div className="hero-fade absolute inset-x-0 bottom-0 h-24" />

          <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 border-y border-[color:var(--line-strong)] py-2 pr-4 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                <Sparkles className="size-4 text-[color:var(--accent-2)]" />
                {activeBuyer.eyebrow}
              </div>

              <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                {profile.name}
              </p>
              <h1 className="text-[clamp(2.5rem,5.4vw,5.5rem)] font-black uppercase leading-[0.85] tracking-normal">
                Fractional AI &amp; backend engineer
                <span className="block text-[color:var(--accent)]">for build sprints.</span>
              </h1>

              <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Choose your audience">
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

              <p className="mt-7 max-w-3xl text-xl font-semibold leading-8 md:text-2xl md:leading-9" aria-live="polite">{activeBuyer.promise}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--muted)] md:text-lg">{activeBuyer.body}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#contact" className="primary-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                  Start a sprint
                  <ArrowRight className="size-5" />
                </a>
                <a href="#work" className="secondary-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                  See shipped work
                  <ArrowRight className="size-5" />
                </a>
              </div>
              <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                <span className="availability-dot" aria-hidden />
                {availability.status} &middot; {availability.reply}
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
                alt="Portrait of Arpit Khandelwal"
                fill
                priority
                sizes="(max-width: 768px) calc(100vw - 4.5rem), 460px"
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
                A stronger yes by making the no obvious.
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
                      <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center font-bold text-[color:var(--muted)]" aria-hidden>&times;</span>
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
                Choose the sprint shape. It pre-fills the contact form below, so sending takes one step.
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
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">Sprint brief</p>
                  <button type="button" onClick={() => copyText(sprintBrief, setCopiedBrief)} className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--dark-text)]">
                    <Copy className="size-4" />
                    {copiedBrief ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-7 text-[color:var(--dark-muted)]">{sprintBrief}</pre>
                <div className="mt-6">
                  <a href="#contact" className="light-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
                    Continue to contact
                    <ArrowRight className="size-5" />
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
                    <step.icon className="size-6 text-white/60" />
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
              <p className="section-kicker">Track record</p>
              <h2 className="section-title mt-4">Outcomes before adjectives.</h2>
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

        <section className="soft-section border-b border-[color:var(--line)] px-5 py-10 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="section-kicker">Where I have shipped</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {workedWith.map((name) => (
                <span key={name} className="text-base font-black uppercase tracking-[0.04em] text-[color:var(--muted)]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="dark-section py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="section-kicker text-[color:var(--accent-2)]">Case studies</p>
                <h2 className="section-title mt-4 text-[color:var(--dark-text)]">Shipped work, then experiments.</h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--dark-muted)] md:text-lg">
                View a case for the deeper proof, or open the live project.
              </p>
            </div>

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent-2)]">Shipped</p>
            <div className="divide-y divide-white/12 border-y border-white/12">
              {shippedWork.map((work, index) => (
                <WorkRow key={work.title} work={work} index={index} onView={() => setSelectedCase(work)} />
              ))}
            </div>

            <p className="mb-4 mt-14 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent-2)]">Experiments &amp; labs</p>
            <div className="divide-y divide-white/12 border-y border-white/12">
              {experimentWork.map((work, index) => (
                <WorkRow key={work.title} work={work} index={shippedWork.length + index} onView={() => setSelectedCase(work)} />
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
                    aria-pressed={activeArchitecture === node.id}
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

        <section id="faq" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.72fr_1.28fr] md:px-8 md:py-28">
          <div>
            <p className="section-kicker">FAQ</p>
            <h2 className="section-title mt-4">Straight answers.</h2>
          </div>
          <div className="border-t border-[color:var(--line)]">
            {faqs.map((faq) => (
              <details key={faq.q} className="faq-item border-b border-[color:var(--line)]">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-lg font-bold">
                  {faq.q}
                  <span className="faq-marker shrink-0 text-[color:var(--accent)]" aria-hidden>+</span>
                </summary>
                <p className="pb-6 text-sm leading-7 text-[color:var(--muted)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="soft-section border-y border-[color:var(--line)] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="section-kicker">Engagement</p>
              <h2 className="section-title mt-4">What you get, and how it starts.</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="border border-[color:var(--line)] bg-[color:var(--panel)] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">What you get</p>
                <div className="mt-5 space-y-4">
                  {engagementGet.map((item) => (
                    <p key={item} className="flex gap-3 text-sm leading-6 text-[color:var(--muted)]">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[color:var(--accent-2)]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div className="border border-[color:var(--line)] bg-[color:var(--panel)] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent-2)]">How it works</p>
                <dl className="mt-5 divide-y divide-[color:var(--line)]">
                  {engagementTerms.map(([term, detail]) => (
                    <div key={term} className="grid gap-1 py-3 sm:grid-cols-[0.28fr_0.72fr]">
                      <dt className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--accent)]">{term}</dt>
                      <dd className="text-sm leading-6 text-[color:var(--muted)]">{detail}</dd>
                    </div>
                  ))}
                </dl>
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

        <section id="contact" className="footer-section px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1fr] md:items-start">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-7xl">
                Send the sprint. I will tell you what can ship.
              </h2>
              <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em]">
                <span className="availability-dot" aria-hidden />
                {availability.status} &middot; {availability.reply}
              </p>
              <div className="mt-8 flex items-center gap-2">
                <MapPin className="size-5" />
                <span className="font-semibold">{profile.location}</span>
              </div>
              <p className="mt-4 text-sm">
                Prefer email? Write to{" "}
                <a href={`mailto:${profile.email}`} className="font-bold underline underline-offset-4">
                  {profile.email}
                </a>
                .
              </p>
              <p className="mt-3 text-sm">
                Hiring? See the{" "}
                <a href={profile.resume} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4">
                  full r&eacute;sum&eacute;
                </a>
                .
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    aria-label={social.label}
                    className="icon-link grid size-12 place-items-center rounded-full border"
                  >
                    <social.icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={onContactSubmit} className="contact-card grid gap-4 border p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Name
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(event) => setContactName(event.target.value)}
                    className="contact-input"
                    autoComplete="name"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Email
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    className="contact-input"
                    autoComplete="email"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Sprint brief
                <textarea
                  required
                  value={messageValue}
                  onChange={(event) => {
                    setMessageTouched(true);
                    setContactMessage(event.target.value);
                  }}
                  className="contact-input min-h-44 resize-y"
                />
              </label>
              <button
                type="submit"
                disabled={contactStatus === "sending"}
                className="primary-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold disabled:opacity-60"
              >
                {contactStatus === "sending" ? "Sending..." : "Send brief"}
                <Send className="size-5" />
              </button>
              <p className="min-h-5 text-sm" role="status" aria-live="polite">
                {contactStatus === "sent" && "Sent. I will reply within 24 hours."}
                {contactStatus === "fallback" && "Opening your email app — or write to ak@arpitkhandelwal.com directly."}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--line)] px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[color:var(--muted)] md:flex-row">
          <p>&copy; {new Date().getFullYear()} {profile.name}</p>
          <div className="flex items-center gap-6">
            <a href="/play" className="hover:text-[color:var(--accent)]">Play</a>
            <a href="/privacy-policy" className="hover:text-[color:var(--accent)]">Privacy</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-[color:var(--accent)]">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[color:var(--accent)]">LinkedIn</a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="hover:text-[color:var(--accent)]">R&eacute;sum&eacute;</a>
          </div>
        </div>
      </footer>

      <a href="/play" className="play-fab" aria-label="Play the brick-breaker game">
        <span className="play-fab-mark" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        Play
      </a>

      <div className="mobile-sticky fixed inset-x-0 bottom-0 z-40 border-t p-3 md:hidden">
        <div className="flex gap-2">
          <a href="#contact" className="primary-button inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold">
            Start a sprint
            <ArrowRight className="size-4" />
          </a>
          <a href="#work" className="secondary-button inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-semibold">
            Work
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>

      <CaseStudyDrawer selectedCase={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}

type WorkRowProps = {
  work: (typeof selectedWork)[number];
  index: number;
  onView: () => void;
};

function WorkRow({ work, index, onView }: WorkRowProps) {
  return (
    <article className="work-row grid gap-6 py-8 md:grid-cols-[0.1fr_0.34fr_0.36fr_0.2fr] md:items-start">
      <div className="font-mono text-sm text-white/55">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent-2)]">{work.type} / {work.period}</p>
        <h3 className="mt-3 text-3xl font-black tracking-normal text-[color:var(--dark-text)] md:text-5xl">{work.title}</h3>
        <p className="mt-4 text-sm font-semibold text-[color:var(--dark-muted)]">{work.credibility}</p>
      </div>
      <div>
        <p className="text-sm leading-6 text-[color:var(--dark-muted)]">
          <span className="font-semibold text-[color:var(--dark-text)]">Shipped:</span> {work.shipped}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {work.stack.map((item) => (
            <span key={item} className="rounded-full border border-white/14 px-3 py-1 text-xs text-white/70">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:justify-end md:text-right">
        <button type="button" onClick={onView} className="secondary-dark-link inline-flex items-center gap-2 text-sm font-semibold">
          View case
          <ArrowRight className="size-4" />
        </button>
        <a href={work.href} target="_blank" rel="noreferrer" className="secondary-dark-link inline-flex items-center gap-2 text-sm font-semibold" aria-label={`Open ${work.title}`}>
          Open
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </article>
  );
}
