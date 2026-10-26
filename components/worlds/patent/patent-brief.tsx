"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { copyText } from "@/components/portfolio/helpers";
import { track } from "@/lib/analytics";
import { contactStatusText, type BriefState } from "../use-brief";

interface FieldProps {
  box: string;
  legend: string;
  options: readonly string[];
  value: string;
  field: "type" | "timeline" | "stage";
  onChange: (value: string) => void;
}

/** One numbered box of the application form: a row of check boxes, one ticked. */
function ChoiceBox({ box, legend, options, value, field, onChange }: FieldProps) {
  return (
    <fieldset className="pb-box">
      <legend>
        <span className="pb-box-no">{box}</span>
        {legend}
      </legend>
      <div className="pb-choices">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            className="pb-choice"
            onClick={() => {
              onChange(option);
              track("brief_option", { field, value: option });
            }}
          >
            <span className="pb-tick" aria-hidden="true" />
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** The sprint brief as a blank application form: empty boxes that ask to be filled. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FILED_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function PatentBrief({ brief, title, intro }: { brief: BriefState; title: string; intro: string }) {
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const reported = useRef<string>("idle");

  useEffect(() => {
    if ((brief.status === "sent" || brief.status === "fallback") && reported.current !== brief.status) {
      reported.current = brief.status;
      track("brief_submit", { result: brief.status, audience: brief.buyerId });
    }
  }, [brief.status, brief.buyerId]);

  return (
    <section id="brief" className="pt-sheet pb" aria-labelledby="brief-title" data-analytics-section="brief">
      <header className="pt-sheet-head">
        <h2 id="brief-title" className="pt-h2">
          {title}
        </h2>
        <p className="pt-intro">{intro}</p>
      </header>

      <div className="pb-grid">
        <div className="pb-left">
          <ChoiceBox box="(21)" legend="Work type" options={sprintTypes} value={brief.sprintType} field="type" onChange={brief.setSprintType} />
          <ChoiceBox box="(22)" legend="Sprint length" options={sprintTimelines} value={brief.sprintTimeline} field="timeline" onChange={brief.setSprintTimeline} />
          <ChoiceBox box="(23)" legend="Current state" options={sprintStages} value={brief.sprintStage} field="stage" onChange={brief.setSprintStage} />
          <p className="pb-copy">
            The form on the right fills in from these boxes. You can edit it before you send it.{" "}
            <button
              type="button"
              className="pt-link-button"
              onClick={() => {
                void copyText(brief.brief, setCopied);
                track("brief_copy", { audience: brief.buyerId });
              }}
            >
              {copied ? "Copied" : "Copy the brief"}
            </button>
          </p>
        </div>

        <form className="pb-form" onSubmit={brief.submit} data-clarity-mask="true" aria-label="Send the sprint brief">
          <label className="pb-field">
            <span>
              <span className="pb-box-no">(71)</span> Applicant name
            </span>
            <input type="text" required autoComplete="name" value={brief.name} onChange={(event) => brief.setName(event.target.value)} />
          </label>
          <label className="pb-field">
            <span>
              <span className="pb-box-no">(72)</span> Email address
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={brief.email}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "pb-email-error" : undefined}
              onChange={(event) => {
                brief.setEmail(event.target.value);
                if (emailError && EMAIL_SHAPE.test(event.target.value)) setEmailError(null);
              }}
              onBlur={(event) => {
                const value = event.target.value.trim();
                setEmailError(value && !EMAIL_SHAPE.test(value) ? "Check the email address. It needs a name, an @ and a domain." : null);
              }}
            />
            {emailError ? (
              <span id="pb-email-error" className="pb-error" role="alert">
                {emailError}
              </span>
            ) : null}
          </label>
          <label className="pb-field">
            <span>
              <span className="pb-box-no">(57)</span> Brief
            </span>
            <textarea required rows={9} value={brief.message} onChange={(event) => brief.setMessage(event.target.value)} />
          </label>
          <button type="submit" className={`pt-file${brief.status === "sending" ? " is-sending" : ""}`} disabled={brief.status === "sending"}>
            {brief.status === "sending" ? "Filing…" : "File the brief"}
            <ArrowRight aria-hidden="true" className="pt-file-arrow" strokeWidth={1.5} />
          </button>
          <p className="pb-status" role="status" aria-live="polite">
            {contactStatusText(brief.status)}
          </p>
          {brief.status === "sent" ? (
            <p className="pb-stamp" aria-hidden="true">
              <span>Filed</span>
              <small>{FILED_DATE.format(new Date())}</small>
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
