"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import type { CaseStudy } from "@/components/portfolio/types";
import { worldCopy } from "@/lib/world-copy";
import { track } from "@/lib/analytics";
import type { BriefState } from "../use-brief";
import { linkParams } from "./link-params";

const copy = worldCopy.canon.sections;

/** A stable, unique view-transition name per case, so a reorder animates each row. */
function transitionName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `c-case-${slug}`;
}

interface CaseRowProps {
  work: CaseStudy;
  featured: boolean;
}

function CaseRow({ work, featured }: CaseRowProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) track("case_open", { case_title: work.title, surface: "list" });
  };

  return (
    <li
      className="c-case"
      data-open={open || undefined}
      data-featured={featured || undefined}
      style={{ viewTransitionName: transitionName(work.title) }}
    >
      <div className="c-case-head">
        <div className="c-case-title-row">
          <h3 className="c-case-title">{work.title}</h3>
          {featured ? <span className="c-for-you">For you</span> : null}
        </div>
        <p className="c-case-meta">
          {work.type} <span aria-hidden="true">·</span> {work.period}
        </p>
      </div>
      <div className="c-case-body">
        <p className="c-case-line">{work.credibility}</p>
        <ul className="c-stack" aria-label="Stack">
          {work.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="c-case-actions">
        <button type="button" className="c-link-btn" aria-expanded={open} aria-controls={panelId} onClick={toggle}>
          <Plus className="c-plus" size={15} strokeWidth={1.75} aria-hidden="true" />
          Details
          <span className="c-sr"> for {work.title}</span>
        </button>
        <a
          href={work.href}
          className="c-open"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("case_link", { case_title: work.title, ...linkParams(work.href) })}
        >
          <span className="c-draw">Open</span>
          <span className="c-sr"> {work.title}</span>
          <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
      <div id={panelId} className="c-case-panel" inert={!open}>
        <div className="c-case-panel-inner">
          <dl className="c-case-dl">
            <div>
              <dt>Problem</dt>
              <dd>{work.problem}</dd>
            </div>
            <div>
              <dt>Shipped</dt>
              <dd>{work.shipped}</dd>
            </div>
            {work.parts && work.parts.length > 0 ? (
              <div>
                <dt>Parts</dt>
                <dd>
                  <ul className="c-parts">
                    {work.parts.map((part) => (
                      <li key={part}>{part}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Proof</dt>
              <dd>
                <ul className="c-proof">
                  {work.proof.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
}

function CaseList({ items, brief }: { items: readonly CaseStudy[]; brief: BriefState }) {
  return (
    <ol className="c-cases">
      {items.map((work) => (
        <CaseRow key={work.title} work={work} featured={brief.isFeatured(work.title)} />
      ))}
    </ol>
  );
}

export function CanonWork({ brief }: { brief: BriefState }) {
  const shipped = brief.orderedWork.filter((work) => work.status === "shipped");
  const experiments = brief.orderedWork.filter((work) => work.status === "experiment");

  return (
    <>
      <section id="work" className="c-shell c-section c-section-first" aria-labelledby="c-work" data-analytics-section="work">
        <header className="c-section-head">
          <h2 id="c-work" className="c-h2">
            {copy.work.title}
          </h2>
          <p className="c-intro-text">{copy.work.intro}</p>
          <p className="c-why" aria-live="polite">
            <span key={brief.buyerId} className="c-swap">
              <span className="c-for-you">For you</span> {brief.buyer.why}
            </span>
          </p>
        </header>
        <CaseList items={shipped} brief={brief} />
      </section>

      <section
        id="experiments"
        className="c-shell c-section c-section-tight"
        aria-labelledby="c-experiments"
        data-analytics-section="experiments"
      >
        <header className="c-section-head">
          <h2 id="c-experiments" className="c-h2 c-h2-sub">
            {copy.experiments.title}
          </h2>
          <p className="c-intro-text">{copy.experiments.intro}</p>
        </header>
        <CaseList items={experiments} brief={brief} />
      </section>
    </>
  );
}
