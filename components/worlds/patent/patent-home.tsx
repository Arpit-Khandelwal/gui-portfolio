"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  availability,
  buyerModes,
  community,
  engagementGet,
  experience,
  faqs,
  openSource,
  profile,
  projectArchive,
  selectedWork,
  sprintSteps,
  workedWith,
} from "@/components/portfolio/data";
import type { CaseStudy } from "@/components/portfolio/types";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import { useBrief } from "../use-brief";
import { WorldSwitcher } from "../world-switcher";
import { AgentFigure } from "./patent-agent-figure";
import { PatentBrief } from "./patent-brief";
import { PatentFigure } from "./patent-figure";
import { InlineParts, PartsLegend } from "./patent-parts";
import "./patent.css";
import { linkEventParams } from "@/lib/analytics-helpers";

const copy = worldCopy.patent;
const captions = (copy.extra.figureCaptions ?? {}) as Readonly<Record<string, string>>;
const claims = (copy.extra.claims ?? []) as readonly string[];

const shipped = selectedWork.filter((work) => work.status === "shipped");
const experiments = selectedWork.filter((work) => work.status === "experiment");
const heroCase = selectedWork.find((work) => work.title === "Swiggy MCP Server") ?? selectedWork[0];
const figureCases = [heroCase, ...shipped.filter((work) => work !== heroCase)];
const TOTAL_SHEETS = 2 + figureCases.length + 1;

const NAV: readonly { href: string; label: string }[] = [
  { href: "#figures", label: "Figures" },
  { href: "#references", label: "References" },
  { href: "#claims", label: "Claims" },
  { href: "#brief", label: "Application" },
  { href: "/writing", label: "Writing" },
  { href: "/play", label: "Play" },
];

function linkParams(href: string): { link_domain: string; link_url: string } {
  return linkEventParams(href);
}

function partsOf(work: CaseStudy): readonly string[] {
  return work.parts && work.parts.length > 0 ? work.parts : work.stack;
}

interface FigureSheetProps {
  work: CaseStudy;
  fig: number;
  sheet: number;
  active: number | null;
  onPart: (value: number | null) => void;
}

function FigureSheet({ work, fig, sheet, active, onPart }: FigureSheetProps) {
  const parts = partsOf(work);
  return (
    <article className={`pt-sheet pt-figsheet${fig % 2 === 0 ? " is-flipped" : ""}`} aria-labelledby={`fig-${fig}`}>
      <div className="pt-figsheet-draw">
        <PatentFigure fig={fig} parts={parts} active={active} onPart={onPart} title={work.title} />
        <p className="pt-figlabel" aria-hidden="true">
          Fig. {fig}
        </p>
      </div>
      <p className="pt-corner" aria-hidden="true">
        Sheet {sheet} of {TOTAL_SHEETS}
      </p>
      <div className="pt-figsheet-text">
        <h3 id={`fig-${fig}`} className="pt-h3">
          <span className="pt-figtag">Fig. {fig}</span> {work.title}
        </h3>
        <p className="pt-caption">{captions[work.title] ?? work.credibility}</p>
        <dl className="pt-desc">
          <dt>Problem</dt>
          <dd>{work.problem}</dd>
          <dt>Embodiment</dt>
          <dd>{work.shipped}</dd>
        </dl>
        <PartsLegend fig={fig} parts={parts} caseTitle={work.title} active={active} onPart={onPart} />
        <p className="pt-stack">{[work.period, ...work.stack].join(" · ")}</p>
        <a
          className="pt-out"
          href={work.href}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("case_link", { case_title: work.title, ...linkParams(work.href) })}
        >
          Open the build <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}

export function PatentHome() {
  const brief = useBrief();
  const [active, setActive] = useState<number | null>(null);
  const heroParts = partsOf(heroCase);

  return (
    <div data-world="patent" className="world-patent">
      <a href="#main" className="sr-only-focusable pt-skip">
        Skip to content
      </a>
      <header className="pt-header">
        <Link href="/" className="pt-mark">
          {profile.name}
        </Link>
        <nav aria-label="Primary" className="pt-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => track("nav_click", { link_url: item.href, link_text: item.label, nav: "header" })}>
              {item.label}
            </a>
          ))}
        </nav>
        <WorldSwitcher current="patent" />
      </header>

      <main id="main">
        {/* Sheet 1: title, abstract and FIG. 1. */}
        <section className="pt-sheet pt-hero" aria-labelledby="pt-title" data-analytics-section="hero">
          <p className="pt-corner" aria-hidden="true">
            Sheet 1 of {TOTAL_SHEETS}
          </p>
          <div className="pt-margin">
            <h1 id="pt-title" className="pt-h1">
              {copy.headline}
            </h1>
            <p className="pt-inventor">{copy.subline}</p>

            <div className="pt-abstract">
              <h2 className="pt-label">{copy.sections.about.title}</h2>
              <p aria-live="polite">
                {brief.buyer.promise} {brief.buyer.body}
              </p>
              <InlineParts
                fig={1}
                lead={`Fig. 1 shows the parts of ${heroCase.title}:`}
                parts={heroParts}
                caseTitle={heroCase.title}
                active={active}
                onPart={setActive}
              />
            </div>

            <div className="pt-applicant" role="group" aria-label="Who reads this">
              {buyerModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={brief.buyerId === mode.id}
                  onClick={() => {
                    brief.setBuyerId(mode.id);
                    track("audience_select", { audience: mode.id });
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <p className="pt-status">
              <span className="pt-status-dot" aria-hidden="true" />
              {availability.status}. {availability.reply}.
            </p>

            <a href="#brief" className="pt-file" onClick={() => track("cta_click", { cta: "brief", section: "hero" })}>
              File a brief
              <ArrowRight aria-hidden="true" className="pt-file-arrow" strokeWidth={1.5} />
            </a>
          </div>

          <figure className="pt-hero-fig" aria-labelledby="pt-hero-cap">
            <div className="pt-titleblock" aria-hidden="true">
              <span>Specification AK-2026</span>
              <span>
                {profile.name}, {profile.location}
              </span>
              <span>Fig. 1 · {heroCase.title}</span>
            </div>
            <div className="pt-hero-draw">
              <PatentFigure fig={1} variant={0} parts={heroParts} active={active} onPart={setActive} title={heroCase.title} />
            </div>
            <figcaption id="pt-hero-cap" className="pt-hero-cap">
              <span className="pt-figlabel">Fig. 1</span>
              <span>{captions[heroCase.title] ?? heroCase.credibility}</span>
            </figcaption>
          </figure>
        </section>

        {/* Figures: every shipped build, then FIG. 0. */}
        <section id="figures" className="pt-section" aria-labelledby="figures-title" data-analytics-section="work">
          <header className="pt-section-head">
            <h2 id="figures-title" className="pt-h2">
              {copy.sections.work.title}
            </h2>
            <p className="pt-intro">{copy.sections.work.intro}</p>
          </header>
          {figureCases.slice(1).map((work, index) => (
            <FigureSheet key={work.title} work={work} fig={index + 2} sheet={index + 2} active={active} onPart={setActive} />
          ))}
          <AgentFigure caption={String(copy.extra.fig0Caption ?? "")} />
        </section>

        {/* Further embodiments: experiments as compact figures. */}
        <section className="pt-section" aria-labelledby="embodiments-title" data-analytics-section="experiments">
          <header className="pt-section-head">
            <h2 id="embodiments-title" className="pt-h2">
              {copy.sections.experiments.title}
            </h2>
            <p className="pt-intro">{copy.sections.experiments.intro}</p>
          </header>
          <div className="pt-embodiments">
            {experiments.map((work, index) => {
              const fig = figureCases.length + index + 1;
              return (
                <article key={work.title} className="pt-emb" aria-labelledby={`fig-${fig}`}>
                  <PatentFigure fig={fig} parts={partsOf(work)} active={active} onPart={setActive} title={work.title} />
                  <h3 id={`fig-${fig}`} className="pt-h3 pt-h3-small">
                    <span className="pt-figtag">Fig. {fig}</span> {work.title}
                  </h3>
                  <p className="pt-caption">{captions[work.title] ?? work.credibility}</p>
                  <PartsLegend fig={fig} parts={partsOf(work)} caseTitle={work.title} active={active} onPart={setActive} />
                  <a
                    className="pt-out"
                    href={work.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("case_link", { case_title: work.title, ...linkParams(work.href) })}
                  >
                    Open the build <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* Cited references: open-source pull requests. */}
        <section id="references" className="pt-sheet pt-refs" aria-labelledby="refs-title" data-analytics-section="open-source">
          <header className="pt-sheet-head">
            <h2 id="refs-title" className="pt-h2">
              {copy.sections.openSource.title}
            </h2>
            <p className="pt-intro">{copy.sections.openSource.intro}</p>
          </header>
          <table className="pt-table">
            <caption className="sr-only-focusable">Pull requests by Arpit Khandelwal</caption>
            <thead>
              <tr>
                <th scope="col">Repository</th>
                <th scope="col">No.</th>
                <th scope="col">Status</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {openSource.map((item) => (
                <tr key={`${item.repo}#${item.number}`}>
                  <td>{item.repo}</td>
                  <td className="pt-tabnum">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("oss_link", { item: `${item.repo}#${item.number}`, ...linkParams(item.href) })}
                    >
                      #{item.number}
                    </a>
                  </td>
                  <td>
                    <span className={`pt-state pt-state-${item.state}`}>{item.state === "merged" ? "Merged" : "In review"}</span>
                  </td>
                  <td>{item.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="pt-pair">
          {/* Detailed description: the sprint, as numbered paragraphs. */}
          <section className="pt-sheet" aria-labelledby="desc-title" data-analytics-section="process">
            <h2 id="desc-title" className="pt-h2">
              {copy.sections.process.title}
            </h2>
            <p className="pt-intro">{copy.sections.process.intro}</p>
            <div className="pt-paras">
              {sprintSteps.map((step, index) => (
                <p key={step.title}>
                  <span className="pt-para-no">[{String(index + 1).padStart(4, "0")}]</span>
                  <strong>{step.title}.</strong> <em className="pt-when">{step.label}.</em> {step.text}
                </p>
              ))}
            </div>
          </section>

          {/* Claims: the engagement terms. */}
          <section id="claims" className="pt-sheet" aria-labelledby="claims-title" data-analytics-section="terms">
            <h2 id="claims-title" className="pt-h2">
              {copy.sections.terms.title}
            </h2>
            <p className="pt-intro">{copy.sections.terms.intro}</p>
            <ol className="pt-claims">
              {claims.map((claim) => (
                <li key={claim}>{claim.replace(/^\d+\.\s*/, "")}</li>
              ))}
            </ol>
            <ul className="pt-get">
              {engagementGet.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Description of prior work: inventor record and smaller builds. */}
        <section className="pt-sheet pt-prior" aria-labelledby="prior-title" data-analytics-section="archive">
          <h2 id="prior-title" className="pt-h2">
            {copy.sections.archive.title}
          </h2>
          <p className="pt-intro">{copy.sections.archive.intro}</p>
          <div className="pt-prior-grid">
            <div>
              <h3 className="pt-label">Inventor record</h3>
              <dl className="pt-record">
                {experience.map((item) => (
                  <div key={item.company}>
                    <dt>
                      {item.company}
                      <span>{item.period}</span>
                    </dt>
                    <dd>
                      <strong>{item.title}.</strong> {item.text}
                    </dd>
                  </div>
                ))}
              </dl>
              <h3 className="pt-label">Other activity</h3>
              <ul className="pt-plain">
                {community.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="pt-assignees">
                <span className="pt-label">Assignees, past and present</span> {workedWith.join(" · ")}
              </p>
            </div>
            <ol className="pt-related">
              {projectArchive.map(([title, text, href], index) => (
                <li key={title}>
                  <span className="pt-related-no">{String(index + 1).padStart(2, "0")}</span>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("archive_link", { item: title, ...linkParams(href) })}
                  >
                    {title}
                  </a>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Questions from the examiner. */}
        <section className="pt-sheet pt-faq" aria-labelledby="faq-title" data-analytics-section="faq">
          <h2 id="faq-title" className="pt-h2">
            {copy.sections.faq.title}
          </h2>
          <p className="pt-intro">{copy.sections.faq.intro}</p>
          {faqs.map((faq, index) => (
            <details
              key={faq.q}
              onToggle={(event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) track("faq_open", { item: faq.q });
              }}
            >
              <summary>
                <span className="pt-q">Q{index + 1}</span>
                {faq.q}
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </section>

        <PatentBrief brief={brief} title={copy.sections.brief.title} intro={copy.sections.brief.intro} />

        {/* Appendix A: the game. */}
        <section className="pt-sheet pt-appendix" aria-labelledby="play-title" data-analytics-section="play">
          <div>
            <h2 id="play-title" className="pt-h2">
              {copy.sections.play.title}
            </h2>
            <p className="pt-intro">{copy.sections.play.intro}</p>
          </div>
          <Link href="/play" className="pt-file pt-file-quiet" onClick={() => track("cta_click", { cta: "play", section: "play" })}>
            Play the game
            <ArrowRight aria-hidden="true" className="pt-file-arrow" strokeWidth={1.5} />
          </Link>
          <svg className="pt-bricks" viewBox="0 0 240 60" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <rect key={i} x={(i % 6) * 40 + (Math.floor(i / 6) % 2) * 20} y={Math.floor(i / 6) * 20} width={36} height={16} />
            ))}
          </svg>
        </section>
      </main>

      <footer className="pt-footer">
        <span>
          Filed by {profile.name} · {profile.location}
        </span>
        <nav aria-label="Footer" className="pt-footer-links">
          <Link href="/writing">Writing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/docs">API docs</Link>
          <a href="/llms.txt">llms.txt</a>
          <Link href="/privacy-policy">Privacy</Link>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.x} target="_blank" rel="noreferrer">
            X
          </a>
          <a href={profile.resume} target="_blank" rel="noreferrer">
            R&eacute;sum&eacute;
          </a>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </nav>
      </footer>
    </div>
  );
}
