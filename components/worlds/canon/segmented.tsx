"use client";

import { useId } from "react";

export interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  label: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** "bar" joins the options in one frame; "chips" frames each option and wraps cleanly. */
  variant?: "bar" | "chips";
}

/** A quiet group of toggle buttons. One option is pressed at a time. */
export function Segmented({ label, options, value, onChange, variant = "bar" }: SegmentedProps) {
  const labelId = useId();
  return (
    <div className="c-seg" data-variant={variant}>
      <span id={labelId} className="c-seg-label">
        {label}
      </span>
      <div className="c-seg-group" role="group" aria-labelledby={labelId}>
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
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
