"use client";

import { useId, type CSSProperties } from "react";
import { ArrowUpRight, RotateCcw, RotateCw } from "lucide-react";
import type { CaseStudy } from "@/components/portfolio/types";
import { track } from "@/lib/analytics";
import { caseAnchor, useFlip } from "./lid-flip";
import { linkParams, type StickerColor } from "./lid-layout";
import { DieCut, type ShapeId } from "./lid-shapes";

interface LidCaseStickerProps {
  study: CaseStudy;
  color: StickerColor;
  shape: ShapeId;
  rotate: number;
  /** Vertical nudge in px, so the cluster reads as a pile. */
  nudge: number;
  width: "narrow" | "mid" | "wide";
}

/**
 * One build as a large die-cut sticker. The front is a button that flips the
 * sticker; the back (the paper liner) holds the case and the outbound link.
 * Only the face that shows is interactive; the other one is inert.
 */
export function LidCaseSticker({ study, color, shape, rotate, nudge, width }: LidCaseStickerProps) {
  const { flipped, frontRef, backFocusRef, flip, onKeyDown } = useFlip(study.title);
  const backId = useId();
  const titleId = useId();

  return (
    <li
      id={caseAnchor(study.title)}
      className={`lid-case lid-case--${width} lid-shape--${shape} lid-c-${color}`}
      data-flipped={flipped || undefined}
      style={{ "--r": rotate, "--nudge": nudge } as CSSProperties}
      onKeyDown={onKeyDown}
    >
      <article className="lid-flip lid-case-flip" aria-labelledby={titleId}>
        <button
          ref={frontRef}
          type="button"
          className="lid-face lid-face--front lid-case-face"
          aria-expanded={flipped}
          aria-controls={backId}
          inert={flipped}
          onClick={() => flip(true)}
        >
          <DieCut shape={shape} />
          <span className="lid-case-title" id={titleId}>
            {study.title}
          </span>
          <span className="lid-case-cred">{study.credibility}</span>
          {/* Phrasing content only: a button cannot hold a list. */}
          <span className="lid-case-proof">
            {study.proof.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
          <span className="lid-case-meta">
            <span>{study.type}</span>
            <span>{study.period}</span>
          </span>
          <span className="lid-case-hint">
            <RotateCw aria-hidden="true" size={16} strokeWidth={2.5} />
            Show the case
          </span>
        </button>

        <div id={backId} className="lid-face lid-face--back lid-case-face" inert={!flipped}>
          <DieCut shape={shape} />
          <h3
            ref={(node) => {
              backFocusRef.current = node;
            }}
            tabIndex={-1}
            className="lid-case-back-title"
          >
            {study.title}
          </h3>
          <dl className="lid-case-facts">
            <div>
              <dt>Problem</dt>
              <dd>{study.problem}</dd>
            </div>
            <div>
              <dt>What I built</dt>
              <dd>{study.shipped}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{study.stack.join(" · ")}</dd>
            </div>
            {study.parts && study.parts.length > 0 ? (
              <div>
                <dt>Parts</dt>
                <dd>
                  <ul className="lid-case-parts">
                    {study.parts.map((part) => (
                      <li key={part}>{part}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Proof</dt>
              <dd className="lid-case-proofline">{study.credibility}</dd>
            </div>
          </dl>
          <div className="lid-case-actions">
            <a
              className="lid-case-link"
              href={study.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("case_link", { case_title: study.title, ...linkParams(study.href) })}
            >
              Open the build
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.5} />
            </a>
            <button type="button" className="lid-case-back-btn" onClick={() => flip(false)}>
              <RotateCcw aria-hidden="true" size={16} strokeWidth={2.5} />
              Flip back
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}
