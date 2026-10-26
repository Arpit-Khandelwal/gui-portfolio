"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { copyText } from "@/components/portfolio/helpers";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import type { BriefState } from "../use-brief";
import { LidBriefForm } from "./lid-brief-form";
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

  const onCopy = () => {
    void copyText(brief.brief, setCopied);
    track("brief_copy", { audience: brief.buyerId });
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
            <span className="lid-copy-wrap">
              <button type="button" className="lid-btn lid-btn--ghost" onClick={onCopy}>
                {copied ? (
                  <Check aria-hidden="true" size={18} strokeWidth={2.5} />
                ) : (
                  <Copy aria-hidden="true" size={18} strokeWidth={2.5} />
                )}
                {copied ? "Copied" : "Copy the brief"}
              </button>
              {copied ? (
                <span className="lid-copied lid-slap-in" aria-hidden="true">
                  Copied
                </span>
              ) : null}
            </span>
          </div>
        </div>

        <LidBriefForm brief={brief} onCopy={onCopy} />
      </div>
    </section>
  );
}
