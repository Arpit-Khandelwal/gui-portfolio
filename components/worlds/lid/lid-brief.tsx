"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Copy, Send } from "lucide-react";
import { sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { copyText } from "@/components/portfolio/helpers";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import { contactStatusText, type BriefState } from "../use-brief";
import { tilt, rotateStyle } from "./lid-layout";
import { LidSectionHead } from "./lid-section-head";

const sections = worldCopy.lid.sections;

type FieldId = "work_type" | "timeline" | "stage";

interface DotGroupProps {
  field: FieldId;
  label: string;
  options: readonly string[];
  value: string;
  color: "yellow" | "green" | "orange";
  onPick: (value: string) => void;
}

/** One row of peelable dots. The picked dot is peeled off and stuck back on. */
function DotGroup({ field, label, options, value, color, onPick }: DotGroupProps) {
  const labelId = `lid-brief-${field}`;
  return (
    <div className="lid-dots" role="group" aria-labelledby={labelId}>
      <h3 id={labelId} className="lid-dots-label">
        {label}
      </h3>
      <div className="lid-dots-row">
        {options.map((option, index) => {
          const picked = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={picked}
              className={`lid-dot${picked ? ` lid-c-${color}` : ""}`}
              style={rotateStyle(picked ? tilt(index, 0.8) : 0)}
              onClick={() => {
                if (picked) return;
                onPick(option);
                track("brief_option", { field, value: option });
              }}
            >
              {picked ? <Check aria-hidden="true" size={16} strokeWidth={3} /> : null}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface LidBriefProps {
  brief: BriefState;
}

export function LidBrief({ brief }: LidBriefProps) {
  const [copied, setCopied] = useState(false);
  const submitted = useRef(false);
  const { status, buyerId } = brief;
  const sending = status === "sending";

  // `status` is only fresh after the submit promise settles and React
  // re-renders, so the result is tracked here and not inside onSubmit.
  useEffect(() => {
    if (!submitted.current || (status !== "sent" && status !== "fallback")) return;
    submitted.current = false;
    track("brief_submit", { result: status, audience: buyerId });
  }, [status, buyerId]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    submitted.current = true;
    void brief.submit(event);
  };

  const onCopy = () => {
    void copyText(brief.brief, setCopied);
    track("brief_copy", { audience: buyerId });
  };

  return (
    <section id="brief" className="lid-section lid-brief" data-analytics-section="brief" aria-labelledby="lid-brief-title">
      <LidSectionHead id="lid-brief-title" title={sections.brief.title} intro={sections.brief.intro} rotate={-2} />
      <div className="lid-brief-grid">
        <div className="lid-brief-sheet">
          <DotGroup
            field="work_type"
            label="Work type"
            options={sprintTypes}
            value={brief.sprintType}
            color="yellow"
            onPick={brief.setSprintType}
          />
          <DotGroup
            field="timeline"
            label="Timeline"
            options={sprintTimelines}
            value={brief.sprintTimeline}
            color="green"
            onPick={brief.setSprintTimeline}
          />
          <DotGroup
            field="stage"
            label="Stage"
            options={sprintStages}
            value={brief.sprintStage}
            color="orange"
            onPick={brief.setSprintStage}
          />
          <div className="lid-printout">
            <h3 className="lid-dots-label">Your brief</h3>
            <pre className="lid-printout-text" aria-live="polite">
              {brief.brief}
            </pre>
            <button type="button" className="lid-btn lid-btn--ghost" onClick={onCopy}>
              {copied ? <Check aria-hidden="true" size={18} strokeWidth={2.5} /> : <Copy aria-hidden="true" size={18} strokeWidth={2.5} />}
              {copied ? "Copied" : "Copy the brief"}
            </button>
          </div>
        </div>

        <form className="lid-form" data-clarity-mask="true" onSubmit={onSubmit} aria-labelledby="lid-form-title">
          <h3 id="lid-form-title" className="lid-form-title">
            Send it to me
          </h3>
          <div className="lid-field">
            <label htmlFor="lid-name-input">Your name</label>
            <input
              id="lid-name-input"
              name="name"
              autoComplete="name"
              required
              value={brief.name}
              onChange={(event) => brief.setName(event.target.value)}
            />
          </div>
          <div className="lid-field">
            <label htmlFor="lid-email-input">Your email</label>
            <input
              id="lid-email-input"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={brief.email}
              onChange={(event) => brief.setEmail(event.target.value)}
            />
          </div>
          <div className="lid-field">
            <label htmlFor="lid-message-input">Message</label>
            <textarea
              id="lid-message-input"
              name="message"
              rows={8}
              required
              value={brief.message}
              onChange={(event) => brief.setMessage(event.target.value)}
            />
          </div>
          <button type="submit" className="lid-btn lid-btn--send" disabled={sending} aria-disabled={sending}>
            <Send aria-hidden="true" size={18} strokeWidth={2.5} />
            {sending ? "Sending…" : "Send the brief"}
          </button>
          <p className="lid-form-status" role="status">
            {contactStatusText(status)}
          </p>
        </form>
      </div>
    </section>
  );
}
