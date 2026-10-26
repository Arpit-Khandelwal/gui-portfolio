"use client";

import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { Copy, Loader2, Mail, Send } from "lucide-react";
import { availability, profile } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { contactStatusText, type BriefState } from "../use-brief";

type FieldId = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldId, string>>;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Plain-language checks. Each message names the problem and the fix. */
function checkField(field: FieldId, value: string): string | undefined {
  const text = value.trim();
  if (field === "name") return text ? undefined : "Write your name.";
  if (field === "email") {
    if (!text) return "Write your email address, so I can reply.";
    return EMAIL_SHAPE.test(text) ? undefined : "This email address is not complete. Write it like name@company.com.";
  }
  return text ? undefined : "Write a short message about the work.";
}

const FIELD_ORDER: readonly FieldId[] = ["name", "email", "message"];

interface LidBriefFormProps {
  brief: BriefState;
  onCopy: () => void;
}

export function LidBriefForm({ brief, onCopy }: LidBriefFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const submitted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { status, buyerId } = brief;
  const sending = status === "sending";

  // `status` is only fresh after the submit promise settles and React
  // re-renders, so the result is tracked here and not inside onSubmit.
  useEffect(() => {
    if (!submitted.current || (status !== "sent" && status !== "fallback")) return;
    submitted.current = false;
    track("brief_submit", { result: status, audience: buyerId });
  }, [status, buyerId]);

  const values: Record<FieldId, string> = { name: brief.name, email: brief.email, message: brief.message };

  const onBlur = (field: FieldId) => (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const error = checkField(field, event.target.value);
    setErrors((current) => ({ ...current, [field]: error }));
  };

  /** Once a field shows an error, it clears as soon as the value is good. */
  const recheck = (field: FieldId, value: string) => {
    if (!errors[field]) return;
    setErrors((current) => ({ ...current, [field]: checkField(field, value) }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const found: FieldErrors = Object.fromEntries(FIELD_ORDER.map((field) => [field, checkField(field, values[field])]));
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) {
      event.preventDefault();
      setErrors(found);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    submitted.current = true;
    void brief.submit(event);
  };

  const describedBy = (field: FieldId) => (errors[field] ? `lid-${field}-error` : undefined);

  return (
    <form
      ref={formRef}
      className="lid-form"
      data-clarity-mask="true"
      data-status={status}
      noValidate
      aria-busy={sending}
      onSubmit={onSubmit}
      aria-labelledby="lid-form-title"
    >
      <h3 id="lid-form-title" className="lid-form-title">
        Send it to me
      </h3>
      <div className="lid-field" data-invalid={errors.name ? true : undefined}>
        <label htmlFor="lid-name-input">Your name</label>
        <input
          id="lid-name-input"
          name="name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          value={brief.name}
          onBlur={onBlur("name")}
          onChange={(event) => {
            brief.setName(event.target.value);
            recheck("name", event.target.value);
          }}
        />
        {errors.name ? (
          <p id="lid-name-error" className="lid-field-error lid-slap-in">
            {errors.name}
          </p>
        ) : null}
      </div>
      <div className="lid-field" data-invalid={errors.email ? true : undefined}>
        <label htmlFor="lid-email-input">Your email</label>
        <input
          id="lid-email-input"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email")}
          value={brief.email}
          onBlur={onBlur("email")}
          onChange={(event) => {
            brief.setEmail(event.target.value);
            recheck("email", event.target.value);
          }}
        />
        {errors.email ? (
          <p id="lid-email-error" className="lid-field-error lid-slap-in">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div className="lid-field" data-invalid={errors.message ? true : undefined}>
        <label htmlFor="lid-message-input">Message</label>
        <textarea
          id="lid-message-input"
          name="message"
          rows={8}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          value={brief.message}
          onBlur={onBlur("message")}
          onChange={(event) => {
            brief.setMessage(event.target.value);
            recheck("message", event.target.value);
          }}
        />
        {errors.message ? (
          <p id="lid-message-error" className="lid-field-error lid-slap-in">
            {errors.message}
          </p>
        ) : null}
      </div>
      <button type="submit" className="lid-btn lid-btn--send" disabled={sending}>
        {sending ? (
          <Loader2 className="lid-spin" aria-hidden="true" size={18} strokeWidth={2.5} />
        ) : (
          <Send aria-hidden="true" size={18} strokeWidth={2.5} />
        )}
        {sending ? "Sending…" : "Send the brief"}
      </button>
      <p className="lid-form-status" role="status">
        {contactStatusText(status)}
      </p>

      {status === "sent" ? (
        <div className="lid-sent lid-slap-in" aria-hidden="true">
          <span className="lid-sent-word">Sent</span>
          <span className="lid-sent-line">{availability.reply}</span>
        </div>
      ) : null}

      {status === "fallback" ? (
        <div className="lid-fallback lid-slap-in">
          <p>
            The site could not send the brief. Your email app opens with it now. If no email app opens, copy the
            brief and write to {profile.email}.
          </p>
          <span className="lid-fallback-actions">
            <a className="lid-btn lid-btn--ghost" href={`mailto:${profile.email}`}>
              <Mail aria-hidden="true" size={18} strokeWidth={2.5} />
              Write an email
            </a>
            <button type="button" className="lid-btn lid-btn--ghost" onClick={onCopy}>
              <Copy aria-hidden="true" size={18} strokeWidth={2.5} />
              Copy the brief
            </button>
          </span>
        </div>
      ) : null}
    </form>
  );
}
