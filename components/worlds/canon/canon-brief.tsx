"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile, sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { worldCopy } from "@/lib/world-copy";
import { track } from "@/lib/analytics";
import { contactStatusText, type BriefState, type ContactStatus } from "../use-brief";
import { Segmented } from "./segmented";

const copy = worldCopy.canon.sections.brief;
const COPIED_RESET_MS = 2000;

type BriefField = "type" | "timeline" | "stage";

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

export function CanonBrief({ brief }: { brief: BriefState }) {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const tracked = useRef<ContactStatus>("idle");
  const resetTimer = useRef<number | undefined>(undefined);

  const { status, buyerId } = brief;
  useEffect(() => {
    if ((status === "sent" || status === "fallback") && tracked.current !== status) {
      track("brief_submit", { result: status, audience: buyerId });
    }
    tracked.current = status;
  }, [status, buyerId]);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const pick = (field: BriefField, set: (value: string) => void) => (value: string) => {
    set(value);
    track("brief_option", { field, value });
  };

  const copyBrief = async () => {
    window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(brief.message);
      setCopied("done");
      track("brief_copy", { audience: brief.buyerId });
    } catch {
      setCopied("failed");
    }
    resetTimer.current = window.setTimeout(() => setCopied("idle"), COPIED_RESET_MS);
  };

  const edited = brief.message !== brief.brief;
  const sending = status === "sending";
  const statusText = contactStatusText(status);

  return (
    <section id="brief" className="c-shell c-section" aria-labelledby="c-brief" data-analytics-section="brief">
      <div className="c-brief">
        <div className="c-brief-side">
          <h2 id="c-brief" className="c-h2">
            {copy.title}
          </h2>
          <p className="c-intro-text">{copy.intro}</p>
          <div className="c-brief-options">
            <Segmented
              label="Work type"
              options={toOptions(sprintTypes)}
              value={brief.sprintType}
              variant="chips"
              onChange={pick("type", brief.setSprintType)}
            />
            <Segmented
              label="Timeline"
              options={toOptions(sprintTimelines)}
              value={brief.sprintTimeline}
              variant="chips"
              onChange={pick("timeline", brief.setSprintTimeline)}
            />
            <Segmented
              label="Stage"
              options={toOptions(sprintStages)}
              value={brief.sprintStage}
              variant="chips"
              onChange={pick("stage", brief.setSprintStage)}
            />
          </div>
          <p className="c-brief-mail">
            Or write to <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </div>

        <form className="c-form" onSubmit={brief.submit} data-clarity-mask="true">
          <div className="c-field">
            <div className="c-field-row">
              <label htmlFor="c-message">Your brief</label>
              <button type="button" className="c-link-btn c-copy" onClick={copyBrief}>
                {copied === "done" ? (
                  <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Copy size={15} strokeWidth={1.75} aria-hidden="true" />
                )}
                {copied === "done" ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="c-message"
              name="message"
              rows={8}
              required
              value={brief.message}
              onChange={(event) => brief.setMessage(event.target.value)}
              aria-describedby="c-message-hint"
            />
            <p id="c-message-hint" className="c-hint" aria-live="polite">
              {copied === "failed"
                ? "The copy did not work. Select the text and copy it."
                : edited
                  ? "You changed the text. The options do not change it now."
                  : "The options write this text. You can change it."}
            </p>
          </div>
          <div className="c-field-pair">
            <div className="c-field">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                name="name"
                autoComplete="name"
                required
                value={brief.name}
                onChange={(event) => brief.setName(event.target.value)}
              />
            </div>
            <div className="c-field">
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={brief.email}
                onChange={(event) => brief.setEmail(event.target.value)}
              />
            </div>
          </div>
          <div className="c-submit-row">
            <button type="submit" className="c-btn c-btn-primary" disabled={sending}>
              {sending ? "Sending…" : "Send the brief"}
            </button>
            <p className="c-form-status" role="status">
              {statusText}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
