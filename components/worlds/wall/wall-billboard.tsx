"use client";

import { useId, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { availability, buyerModes } from "@/components/portfolio/data";
import type { CaseStudy } from "@/components/portfolio/types";
import type { BriefState } from "@/components/worlds/use-brief";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import { metricNumeral, posterColors, posterGlyph, posterStyle } from "./poster";
import { trackCaseLink } from "./wall-track";

interface WallBillboardProps {
  featured: CaseStudy;
  /** The one line under the title. */
  line: string;
  brief: BriefState;
}

const copy = worldCopy.wall;
const BRIEF_HREF = "#brief";

/** Why the wall already picked a profile, when the visitor did not click one. */
function pickedNote(source: BriefState["audienceSource"]): string | null {
  if (source === "referrer") return "Picked for you because you came from LinkedIn.";
  if (source === "param") return "Picked from your link.";
  return null;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function BillboardActions({ featured, brief }: { featured: CaseStudy; brief: BriefState }) {
  const cta = brief.buyer.cta;
  const ctaIsBrief = cta.href === BRIEF_HREF;
  const ctaKey = ctaIsBrief ? "brief" : "resume";
  return (
    <div className="wall-billboard-actions">
      <a
        className="wall-button wall-button--poster"
        href={cta.href}
        {...(isExternal(cta.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() => track("cta_click", { cta: ctaKey, section: "billboard" })}
      >
        {cta.label}
        {isExternal(cta.href) ? <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} /> : null}
      </a>
      {ctaIsBrief ? (
        <a
          className="wall-button wall-button--poster-outline"
          href={featured.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCaseLink(featured.title, featured.href)}
        >
          Open the build
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />
        </a>
      ) : (
        <>
          <a
            className="wall-button wall-button--poster-outline"
            href={BRIEF_HREF}
            onClick={() => track("cta_click", { cta: "brief", section: "billboard" })}
          >
            Send a brief
          </a>
          <a
            className="wall-billboard-textlink"
            href={featured.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCaseLink(featured.title, featured.href)}
          >
            Open the build
          </a>
        </>
      )}
    </div>
  );
}

export function WallBillboard({ featured, line, brief }: WallBillboardProps) {
  const titleId = useId();
  const pickerId = useId();
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isNoteDismissed, setNoteDismissed] = useState(false);
  const meta = [featured.period, ...featured.stack.slice(0, 3)].join(" · ");
  const backdrop = metricNumeral(featured.credibility) ?? posterGlyph(featured.title);
  const note = isNoteDismissed ? null : pickedNote(brief.audienceSource);

  const focusPicker = () => {
    pickerRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
  };

  return (
    <section
      className="wall-billboard"
      style={posterStyle(featured.title) as CSSProperties}
      aria-labelledby={titleId}
      data-analytics-section="billboard"
    >
      <div className="wall-billboard-poster">
        <span className="wall-billboard-glyph" aria-hidden="true">
          {backdrop}
        </span>
        <h2 id={titleId} className="wall-billboard-title">
          {featured.title}
        </h2>
        <p className="wall-billboard-line">{line}</p>
        <p className="wall-billboard-meta">{meta}</p>
        <BillboardActions featured={featured} brief={brief} />
      </div>

      <div className="wall-billboard-side">
        <p className="wall-billboard-about">{copy.subline}</p>
        {note ? (
          <div className="wall-picked-note">
            <p>{note}</p>
            <button type="button" className="wall-picked-change" onClick={focusPicker}>
              Change profile
            </button>
            <button
              type="button"
              className="wall-picked-close"
              aria-label="Close this note"
              onClick={() => setNoteDismissed(true)}
            >
              <X aria-hidden="true" size={16} strokeWidth={2} />
            </button>
          </div>
        ) : null}
        <div className="wall-picker" role="group" aria-labelledby={pickerId} ref={pickerRef}>
          <p id={pickerId} className="wall-picker-label">
            Who is watching?
          </p>
          <div className="wall-picker-options">
            {buyerModes.map((mode) => {
              const colors = posterColors(mode.label);
              return (
                <button
                  key={mode.id}
                  type="button"
                  className="wall-picker-option"
                  aria-pressed={mode.id === brief.buyerId}
                  onClick={() => brief.setBuyerId(mode.id)}
                >
                  <span
                    className="wall-picker-avatar"
                    aria-hidden="true"
                    style={{ background: colors.field, color: colors.ink }}
                  >
                    {posterGlyph(mode.label)}
                  </span>
                  <span className="wall-picker-name">{mode.ask}</span>
                  <span className="wall-sr-only"> ({mode.label})</span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="wall-billboard-promise" aria-live="polite">
          {brief.buyer.promise}
        </p>
        <p className="wall-billboard-status">
          <span className="wall-status-dot" aria-hidden="true" />
          <span>
            {availability.status}. {availability.reply}.
          </span>
        </p>
      </div>
    </section>
  );
}
