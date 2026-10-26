"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";

export interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  label: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** "list" stacks the options and slides one pill between them; "chips" wraps them in a row. */
  variant?: "list" | "chips";
  /** Extra text under the label. */
  hint?: ReactNode;
  /** Lets other controls find the group (for example, to focus it). */
  groupId?: string;
  /** A view-transition name for the pill, so it slides during a page-wide transition. */
  pillName?: string;
}

/** A group of toggle buttons. One option is pressed at a time. */
export function Segmented({ label, options, value, onChange, variant = "list", hint, groupId, pillName }: SegmentedProps) {
  const labelId = useId();
  const hintId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Puts the pill under the pressed option. It writes to the DOM directly:
  // the pill is decoration, and a state round-trip would cost a second render.
  useLayoutEffect(() => {
    const groupEl = groupRef.current;
    const pillEl = pillRef.current;
    if (!groupEl || !pillEl) return;

    const place = () => {
      const active = groupEl.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!active) return;
      pillEl.style.width = `${active.offsetWidth}px`;
      pillEl.style.height = `${active.offsetHeight}px`;
      pillEl.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
      if (groupEl.dataset.pill) return;
      groupEl.dataset.pill = "placed";
      // Turn the slide on only after the first placement, so it never slides in from 0,0.
      requestAnimationFrame(() => {
        groupEl.dataset.pill = "ready";
      });
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(groupEl);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="c-seg" data-variant={variant}>
      <span id={labelId} className="c-seg-label">
        {label}
      </span>
      {hint ? (
        <span id={hintId} className="c-seg-hint">
          {hint}
        </span>
      ) : null}
      <div
        ref={groupRef}
        id={groupId}
        className="c-seg-group"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
      >
        <span
          ref={pillRef}
          className="c-seg-pill"
          aria-hidden="true"
          style={pillName ? { viewTransitionName: pillName } : undefined}
        />
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="c-seg-option"
            aria-pressed={option.value === value}
            onClick={() => {
              if (option.value !== value) onChange(option.value);
            }}
          >
            <span className="c-seg-mark" aria-hidden="true" />
            <span className="c-seg-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
