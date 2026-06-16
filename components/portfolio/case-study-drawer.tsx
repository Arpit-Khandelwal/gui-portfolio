"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import type { CaseStudy } from "./types";

type CaseStudyDrawerProps = {
  selectedCase: CaseStudy | null;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])';

export function CaseStudyDrawer({ selectedCase, onClose }: CaseStudyDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = selectedCase !== null;

  useEffect(() => {
    if (!open) {
      return;
    }
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    (focusables[0] ?? panel)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) {
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!selectedCase) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${selectedCase.title} case study`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="ml-auto flex max-h-[calc(100svh-2rem)] w-full max-w-2xl flex-col overflow-auto bg-[color:var(--page-bg)] text-[color:var(--page-ink)] shadow-2xl outline-none"
      >
        <div className="flex items-start justify-between gap-6 border-b border-[color:var(--line)] p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--accent)]">{selectedCase.type} / {selectedCase.period}</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none">{selectedCase.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-[color:var(--line)]" aria-label="Close case study">
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-8 p-6">
          <div>
            <p className="section-kicker">Problem</p>
            <p className="mt-3 leading-8 text-[color:var(--muted)]">{selectedCase.problem}</p>
          </div>
          <div>
            <p className="section-kicker">What shipped</p>
            <p className="mt-3 leading-8 text-[color:var(--muted)]">{selectedCase.shipped}</p>
          </div>
          <div>
            <p className="section-kicker">Proof signals</p>
            <div className="mt-4 space-y-3">
              {selectedCase.proof.map((item) => (
                <p key={item} className="flex gap-3 leading-7 text-[color:var(--muted)]">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-[color:var(--accent-2)]" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCase.stack.map((item) => (
              <span key={item} className="rounded-full border border-[color:var(--line)] px-3 py-1 text-sm text-[color:var(--muted)]">
                {item}
              </span>
            ))}
          </div>
          <a href={selectedCase.href} target="_blank" rel="noreferrer" className="primary-button inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold">
            Open project
            <ArrowUpRight className="size-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
