"use client";

import { useId, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
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

export function WallBillboard({ featured, line, brief }: WallBillboardProps) {
  const titleId = useId();
  const pickerId = useId();
  const meta = [featured.period, ...featured.stack.slice(0, 3)].join(" · ");
  const backdrop = metricNumeral(featured.credibility) ?? posterGlyph(featured.title);

  const chooseAudience = (id: BriefState["buyerId"]) => {
    if (id === brief.buyerId) return;
    brief.setBuyerId(id);
    track("audience_select", { audience: id });
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
        <div className="wall-billboard-actions">
          <a
            className="wall-button wall-button--poster"
            href={featured.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCaseLink(featured.title, featured.href)}
          >
            Open the build
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.25} />
          </a>
          <a
            className="wall-button wall-button--poster-outline"
            href="#brief"
            onClick={() => track("cta_click", { cta: "brief", section: "billboard" })}
          >
            Send a brief
          </a>
        </div>
      </div>

      <div className="wall-billboard-side">
        <p className="wall-billboard-about">{copy.subline}</p>
        <div className="wall-picker" role="group" aria-labelledby={pickerId}>
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
                  onClick={() => chooseAudience(mode.id)}
                >
                  <span
                    className="wall-picker-avatar"
                    aria-hidden="true"
                    style={{ background: colors.field, color: colors.ink }}
                  >
                    {posterGlyph(mode.label)}
                  </span>
                  <span className="wall-picker-name">{mode.label}</span>
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
