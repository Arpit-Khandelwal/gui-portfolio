"use client";

import { useEffect, useId, useState } from "react";
import { Check, Copy } from "lucide-react";
import { sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { copyText } from "@/components/portfolio/helpers";
import type { BriefState } from "@/components/worlds/use-brief";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import { WallBriefForm } from "./wall-brief-form";

const copy = worldCopy.wall.sections.brief;

interface SegmentedProps {
  label: string;
  field: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

function Segmented({ label, field, options, value, onChange }: SegmentedProps) {
  const labelId = useId();
  return (
    <div className="wall-segment">
      <p id={labelId} className="wall-segment-label">
        {label}
      </p>
      <div className="wall-segment-options" role="group" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => {
              if (option === value) return;
              onChange(option);
              track("brief_option", { field, value: option });
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WallBrief({ brief }: { brief: BriefState }) {
  const headingId = useId();
  const [copied, setCopied] = useState(false);
  const { status, buyerId } = brief;

  useEffect(() => {
    if (status === "sent" || status === "fallback") track("brief_submit", { result: status, audience: buyerId });
    // Only a status change sends the event; an audience change must not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <section className="wall-block wall-brief" id="brief" aria-labelledby={headingId} data-analytics-section="brief">
      <div className="wall-block-head">
        <h2 id={headingId} className="wall-row-title">
          {copy.title}
        </h2>
        <p className="wall-row-intro">{copy.intro}</p>
      </div>

      <div className="wall-brief-grid">
        <div className="wall-brief-builder">
          <Segmented
            label="Work type"
            field="sprint_type"
            options={sprintTypes}
            value={brief.sprintType}
            onChange={brief.setSprintType}
          />
          <Segmented
            label="Timeline"
            field="sprint_timeline"
            options={sprintTimelines}
            value={brief.sprintTimeline}
            onChange={brief.setSprintTimeline}
          />
          <Segmented
            label="Stage"
            field="sprint_stage"
            options={sprintStages}
            value={brief.sprintStage}
            onChange={brief.setSprintStage}
          />
          <div className="wall-brief-preview">
            <p className="wall-segment-label">Your brief</p>
            <p className="wall-brief-text">{brief.brief}</p>
            <button
              type="button"
              className="wall-button wall-button--ghost"
              data-copied={copied}
              onClick={() => {
                void copyText(brief.brief, setCopied);
                track("brief_copy", { audience: buyerId });
              }}
            >
              <span className="wall-copy-label" key={copied ? "copied" : "copy"}>
                {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
                {copied ? "Copied" : "Copy the brief"}
              </span>
            </button>
          </div>
        </div>

        <WallBriefForm brief={brief} />
      </div>
    </section>
  );
}
