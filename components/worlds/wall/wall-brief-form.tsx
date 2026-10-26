"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { availability, profile } from "@/components/portfolio/data";
import { contactStatusText, type BriefState } from "@/components/worlds/use-brief";

/** How long the "Brief sent" notice stays on screen. */
const TOAST_MS = 6000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function emailError(value: string): string | null {
  if (!value.trim()) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address, for example name@company.com.";
  return null;
}

/** The contact form, with inline email checks and wall-style sent and fallback states. */
export function WallBriefForm({ brief }: { brief: BriefState }) {
  const emailErrorId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const [isEmailTouched, setEmailTouched] = useState(false);
  const [isToastHidden, setToastHidden] = useState(false);
  const { status } = brief;
  const error = isEmailTouched ? emailError(brief.email) : null;
  const isSending = status === "sending";
  const isSent = status === "sent";

  useEffect(() => {
    if (status !== "sent") return;
    const timer = window.setTimeout(() => setToastHidden(true), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (emailError(brief.email)) {
      event.preventDefault();
      setEmailTouched(true);
      emailRef.current?.focus();
      return;
    }
    void brief.submit(event);
  };

  return (
    <form className="wall-form" onSubmit={onSubmit} noValidate data-clarity-mask="true" data-status={status}>
      <label className="wall-field">
        <span>Name</span>
        <input
          name="name"
          autoComplete="name"
          required
          value={brief.name}
          onChange={(event) => brief.setName(event.target.value)}
        />
      </label>
      <label className="wall-field" data-invalid={error ? "true" : undefined}>
        <span>Email</span>
        <input
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? emailErrorId : undefined}
          value={brief.email}
          onBlur={() => setEmailTouched(true)}
          onChange={(event) => brief.setEmail(event.target.value)}
        />
        {error ? (
          <span className="wall-field-error" id={emailErrorId}>
            {error}
          </span>
        ) : null}
      </label>
      <label className="wall-field">
        <span>Message</span>
        <textarea
          name="message"
          rows={9}
          required
          value={brief.message}
          onChange={(event) => brief.setMessage(event.target.value)}
        />
      </label>
      <button type="submit" className="wall-button wall-button--solid wall-submit" disabled={isSending || isSent}>
        {isSending ? <span className="wall-spinner" aria-hidden="true" /> : null}
        {isSent ? <Check aria-hidden="true" size={18} strokeWidth={2.5} /> : null}
        {isSending ? "Sending…" : isSent ? "Brief sent" : "Send the brief"}
      </button>
      <p className="wall-form-status" role="status">
        {contactStatusText(status)}
      </p>
      {status === "fallback" ? (
        <div className="wall-form-fallback">
          <p>The form did not send. Your email app opens with the brief in it.</p>
          <a className="wall-button wall-button--ghost" href={`mailto:${profile.email}`}>
            <Mail aria-hidden="true" size={16} />
            Write to {profile.email}
          </a>
        </div>
      ) : null}
      <div className="wall-toast" data-visible={isSent && !isToastHidden} aria-hidden="true">
        <span className="wall-toast-mark">
          <Check size={18} strokeWidth={2.5} />
        </span>
        <span className="wall-toast-text">
          <strong>Brief sent</strong>
          <span>{availability.reply}</span>
        </span>
      </div>
    </form>
  );
}
