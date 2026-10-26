"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { buyerModes, profile, selectedWork, sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { buildSprintBrief, sendContact } from "@/components/portfolio/helpers";
import type { BuyerMode, CaseStudy } from "@/components/portfolio/types";
import { track } from "@/lib/analytics";
import { chooseAudience, useAudience, type AudienceId, type AudienceSource } from "./audience";

export type BuyerModeId = AudienceId;

/** Featured cases for the reader first, in their order, then the rest as listed. */
export function orderWorkFor(buyer: BuyerMode, work: readonly CaseStudy[] = selectedWork): readonly CaseStudy[] {
  const rank = (title: string) => {
    const index = buyer.featured.indexOf(title);
    return index === -1 ? buyer.featured.length : index;
  };
  return [...work].sort((a, b) => rank(a.title) - rank(b.title));
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * Switches the reader. Where the browser supports view transitions, the work
 * lists reorder as one animated move; elsewhere they swap at once.
 */
function switchAudience(id: AudienceId): void {
  const apply = () => flushSync(() => chooseAudience(id));
  if (typeof document.startViewTransition === "function" && !prefersReducedMotion()) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

export type ContactStatus = "idle" | "sending" | "sent" | "fallback";

export interface BriefState {
  buyer: BuyerMode;
  buyerId: BuyerModeId;
  /** Picks the reader; reorders the work, changes the main action, tracks it. */
  setBuyerId: (id: BuyerModeId) => void;
  /** How the reader was set: a click, a `?for=` link, a stored choice, the referrer. */
  audienceSource: AudienceSource;
  /** selectedWork with this reader's featured cases first. */
  orderedWork: readonly CaseStudy[];
  isFeatured: (title: string) => boolean;
  sprintType: string;
  setSprintType: (value: string) => void;
  sprintTimeline: string;
  setSprintTimeline: (value: string) => void;
  sprintStage: string;
  setSprintStage: (value: string) => void;
  brief: string;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  status: ContactStatus;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Shared state for the audience switch, the sprint brief builder and the
 * contact form. Every world renders this in its own vocabulary; the behaviour
 * (POST to /api/contact, mailto fallback) stays identical across worlds.
 */
export function useBrief(): BriefState {
  const audience = useAudience();
  const buyerId = audience.id;
  const [sprintType, setSprintType] = useState<string>(sprintTypes[0]);
  const [sprintTimeline, setSprintTimeline] = useState<string>(sprintTimelines[1]);
  const [sprintStage, setSprintStage] = useState<string>(sprintStages[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<ContactStatus>("idle");

  const buyer: BuyerMode = buyerModes.find((mode) => mode.id === buyerId) ?? buyerModes[0];
  const orderedWork = useMemo(() => orderWorkFor(buyer), [buyer]);

  // An audience inferred from a link or the referrer is reported once.
  useEffect(() => {
    if (audience.source === "param" || audience.source === "referrer") {
      track("audience_select", { audience: audience.id, source: audience.source });
    }
  }, [audience]);

  const setBuyerId = (id: BuyerModeId) => {
    if (id === buyerId) return;
    track("audience_select", { audience: id, source: "click" });
    switchAudience(id);
  };

  const brief = useMemo(
    () => buildSprintBrief({ briefGoal: buyer.briefGoal, sprintType, sprintTimeline, sprintStage }),
    [buyer.briefGoal, sprintType, sprintTimeline, sprintStage],
  );

  // Until the visitor edits the message, it follows the brief builder.
  const message = draft ?? brief;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    const result = await sendContact({ name, email, message });
    if (result === "sent") {
      setStatus("sent");
      return;
    }
    setStatus("fallback");
    const subject = `Build sprint: ${buyer.label}`;
    const body = `From: ${name} <${email}>\n\n${message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return {
    buyer,
    buyerId,
    setBuyerId,
    audienceSource: audience.source,
    orderedWork,
    isFeatured: (title: string) => buyer.featured.includes(title),
    sprintType,
    setSprintType,
    sprintTimeline,
    setSprintTimeline,
    sprintStage,
    setSprintStage,
    brief,
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage: setDraft,
    status,
    submit,
  };
}

/** Status line under every contact form, in STE. */
export function contactStatusText(status: ContactStatus): string {
  if (status === "sent") return "The brief is sent. Arpit replies in 24 hours.";
  if (status === "fallback") return `Your email app opens now. You can also write to ${profile.email}.`;
  return "";
}
