"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { profile, sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { worldCopy } from "@/lib/world-copy";
import { track } from "@/lib/analytics";
import { contactStatusText, type BriefState, type ContactStatus } from "../use-brief";
import { Segmented } from "./segmented";

const copy = worldCopy.canon.sections.brief;
const COPIED_RESET_MS = 2000;
const EMAIL_ERROR = "Write a full email address, for example name@example.com.";

type BriefField = "type" | "timeline" | "stage";
type CopyState = "idle" | "done" | "failed";

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

/** Checks the email field the way the browser will on submit, but on blur. */
function emailError(input: HTMLInputElement): string | null {
  if (input.value.trim() === "") return null;
  return input.validity.valid ? null : EMAIL_ERROR;
}

function useCopy(text: string, audience: string) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyText = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
      track("brief_copy", { audience });
    } catch {
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), COPIED_RESET_MS);
  };
  return { state, copyText };
}

function useSubmitTracking(status: ContactStatus, audience: string) {
  const tracked = useRef<ContactStatus>("idle");
  useEffect(() => {
    if ((status === "sent" || status === "fallback") && tracked.current !== status) {
      track("brief_submit", { result: status, audience });
    }
    tracked.current = status;
  }, [status, audience]);
}

function StatusRegion({ status }: { status: ContactStatus }) {
  return (
    <div className="c-status-region" role="status">
      {status === "sent" ? (
        <div className="c-done">
          <span className="c-done-mark" aria-hidden="true">
            <Check size={22} strokeWidth={2.5} />
            <span className="c-done-wipe" />
          </span>
          <div>
            <p className="c-done-title">{contactStatusText("sent")}</p>
            <p className="c-done-text">The reply says if the work is a fit, also when the answer is no.</p>
          </div>
        </div>
      ) : null}
      {status === "fallback" ? (
        <div className="c-fallback">
          <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
          <p>
            The form did not send, so your email app opens with the brief. You can also write to{" "}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function CanonBrief({ brief }: { brief: BriefState }) {
  const { status, buyerId } = brief;
  const { state: copied, copyText } = useCopy(brief.message, buyerId);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  useSubmitTracking(status, buyerId);

  const pick = (field: BriefField, set: (value: string) => void) => (value: string) => {
    set(value);
    track("brief_option", { field, value });
  };

  const onEmailBlur = (event: FocusEvent<HTMLInputElement>) => setEmailMessage(emailError(event.currentTarget));
  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    brief.setEmail(event.target.value);
    // Once an error shows, clear it as soon as the address is valid.
    if (emailMessage) setEmailMessage(emailError(event.target));
  };

  const edited = brief.message !== brief.brief;
  const sending = status === "sending";
  const hint =
    copied === "failed"
      ? "The copy did not work. Select the text and copy it."
      : edited
        ? "You changed the text. The options do not change it now."
        : "The options write this text. You can change it.";

  return (
    <section id="brief" className="c-shell c-section" aria-labelledby="c-brief" data-analytics-section="brief">
      <div className="c-brief">
        <div className="c-brief-side">
          <h2 id="c-brief" className="c-h2">
            {copy.title}
          </h2>
          <p className="c-intro-text">{copy.intro}</p>
          <div className="c-brief-options">
            <Segmented label="Work type" variant="chips" options={toOptions(sprintTypes)} value={brief.sprintType} onChange={pick("type", brief.setSprintType)} />
            <Segmented label="Timeline" variant="chips" options={toOptions(sprintTimelines)} value={brief.sprintTimeline} onChange={pick("timeline", brief.setSprintTimeline)} />
            <Segmented label="Stage" variant="chips" options={toOptions(sprintStages)} value={brief.sprintStage} onChange={pick("stage", brief.setSprintStage)} />
          </div>
          <p className="c-brief-mail">
            Or write to{" "}
            <a href={`mailto:${profile.email}`} className="c-draw">
              {profile.email}
            </a>
            .
          </p>
        </div>

        <div className="c-form-wrap">
          {status === "sent" ? null : (
            <form className="c-form" onSubmit={brief.submit} data-clarity-mask="true" aria-busy={sending}>
              <div className="c-field">
                <div className="c-field-row">
                  <label htmlFor="c-message">Your brief</label>
                  <button type="button" className="c-link-btn c-copy" onClick={copyText} data-copied={copied === "done" || undefined}>
                    <span className="c-copy-icon" aria-hidden="true">
                      <Copy className="c-copy-idle" size={15} strokeWidth={1.75} />
                      <Check className="c-copy-done" size={15} strokeWidth={2} />
                    </span>
                    <span aria-live="polite">{copied === "done" ? "Copied" : "Copy"}</span>
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
                <p id="c-message-hint" className="c-hint">
                  {hint}
                </p>
              </div>
              <div className="c-field-pair">
                <div className="c-field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" autoComplete="name" required value={brief.name} onChange={(event) => brief.setName(event.target.value)} />
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
                    onChange={onEmailChange}
                    onBlur={onEmailBlur}
                    aria-invalid={emailMessage ? true : undefined}
                    aria-describedby={emailMessage ? "c-email-error" : undefined}
                  />
                  {emailMessage ? (
                    <p id="c-email-error" className="c-field-error">
                      {emailMessage}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="c-submit-row">
                <button type="submit" className="c-btn c-btn-primary c-submit" disabled={sending}>
                  {sending ? <span className="c-spinner" aria-hidden="true" /> : null}
                  {sending ? "Sending…" : "Send the brief"}
                </button>
              </div>
            </form>
          )}
          <StatusRegion status={status} />
        </div>
      </div>
    </section>
  );
}
