"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { CaseStudy } from "@/components/portfolio/types";
import { posterStyle } from "./poster";
import { trackCaseLink } from "./wall-track";

interface WallCasePanelProps {
  id: string;
  study: CaseStudy;
  onClose: () => void;
}

/** Inline detail panel under a row. Not a modal: the row stays usable above it. */
export function WallCasePanel({ id, study, onClose }: WallCasePanelProps) {

  const headingId = `${id}-heading`;

  return (
    <div className="wall-panel" id={id} role="region" aria-labelledby={headingId}>
      <div className="wall-panel-poster" style={posterStyle(study.title) as CSSProperties} aria-hidden="true">
        <span className="wall-panel-poster-title">{study.title}</span>
      </div>
      <div className="wall-panel-body">
        <div className="wall-panel-head">
          <h3 id={headingId} className="wall-panel-title">
            {study.title}
          </h3>
          <p className="wall-panel-sub">
            {study.type} · {study.period}
          </p>
          <button type="button" className="wall-panel-close" onClick={onClose} aria-label={`Close ${study.title}`}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
        <p className="wall-panel-cred">{study.credibility}</p>
        <dl className="wall-panel-facts">
          <div>
            <dt>Problem</dt>
            <dd>{study.problem}</dd>
          </div>
          <div>
            <dt>Shipped</dt>
            <dd>{study.shipped}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{study.stack.join(", ")}</dd>
          </div>
          {study.parts?.length ? (
            <div>
              <dt>Parts</dt>
              <dd>{study.parts.join(" → ")}</dd>
            </div>
          ) : null}
        </dl>
        <div className="wall-panel-proof">
          <h4>Proof</h4>
          <ul>
            {study.proof.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <a
          className="wall-button wall-button--solid"
          href={study.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCaseLink(study.title, study.href)}
        >
          Open the build
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}
