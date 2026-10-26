"use client";

import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { availability, buyerModes, profile } from "@/components/portfolio/data";
import { worldCopy } from "@/lib/world-copy";
import { track } from "@/lib/analytics";
import type { BriefState } from "../use-brief";
import { Segmented } from "./segmented";

const copy = worldCopy.canon;
const AUDIENCE_GROUP_ID = "c-audience";

const isExternal = (href: string) => /^https?:\/\//.test(href);

function textOf(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

/** Says why an audience is already picked, when the page guessed it. */
function inferredNote(source: BriefState["audienceSource"]): string | null {
  if (source === "referrer") return "Picked for you because you came from LinkedIn.";
  if (source === "param") return "Picked from your link.";
  return null;
}

function focusPicker() {
  document.querySelector<HTMLElement>(`#${AUDIENCE_GROUP_ID} [aria-pressed="true"]`)?.focus();
}

function HeroActions({ brief }: { brief: BriefState }) {
  const { cta } = brief.buyer;
  const external = isExternal(cta.href);
  return (
    <div className="c-actions">
      <a
        key={brief.buyerId}
        href={cta.href}
        className="c-btn c-btn-primary c-swap"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() => track("cta_click", { cta: external ? "resume" : "brief", section: "hero" })}
      >
        {cta.label}
        {external ? <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /> : null}
      </a>
      {external ? (
        <a
          href="#brief"
          className="c-btn c-btn-quiet"
          onClick={() => track("cta_click", { cta: "brief", section: "hero" })}
        >
          Send a brief
        </a>
      ) : (
        <a href="#work" className="c-btn c-btn-quiet">
          See the work
        </a>
      )}
    </div>
  );
}

export function CanonIntro({ brief }: { brief: BriefState }) {
  const [noteClosed, setNoteClosed] = useState(false);
  const note = noteClosed ? null : inferredNote(brief.audienceSource);
  const stackLine = textOf(copy.extra.stack);

  return (
    <section id="top" className="c-shell c-intro" aria-labelledby="c-name" data-analytics-section="hero">
      <div className="c-intro-main">
        <h1 id="c-name" className="c-h1">
          {profile.name}
        </h1>
        <p className="c-lead">{copy.headline}</p>
        <p className="c-subline">{copy.subline}</p>
        {stackLine ? <p className="c-subline c-subline-tight">{stackLine}</p> : null}
        <p className="c-status">
          <span className="c-dot" aria-hidden="true" />
          <span>{availability.status}.</span>
          <span className="c-status-reply">{availability.reply}.</span>
        </p>
        <HeroActions brief={brief} />
      </div>

      <div className="c-intro-aside">
        {note ? (
          <p className="c-note">
            <span>{note}</span>
            <button type="button" className="c-note-btn" onClick={focusPicker}>
              Change
            </button>
            <button
              type="button"
              className="c-note-close"
              aria-label="Close this note"
              onClick={() => setNoteClosed(true)}
            >
              <X size={14} strokeWidth={2} aria-hidden="true" />
            </button>
          </p>
        ) : null}
        <Segmented
          label="What brings you here?"
          hint="Your answer puts the most useful work first."
          groupId={AUDIENCE_GROUP_ID}
          pillName="c-audience-pill"
          options={buyerModes.map((mode) => ({ value: mode.id, label: mode.ask }))}
          value={brief.buyerId}
          onChange={(id) => {
            const mode = buyerModes.find((item) => item.id === id);
            if (mode) brief.setBuyerId(mode.id);
          }}
        />
        <p className="c-promise" aria-live="polite">
          <span key={brief.buyerId} className="c-swap">
            {brief.buyer.promise}
          </span>
        </p>
      </div>
    </section>
  );
}
