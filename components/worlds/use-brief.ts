"use client";

import { useMemo, useState, type FormEvent } from "react";
import { buyerModes, profile, sprintStages, sprintTimelines, sprintTypes } from "@/components/portfolio/data";
import { buildSprintBrief, sendContact } from "@/components/portfolio/helpers";
import type { BuyerMode } from "@/components/portfolio/types";

export type BuyerModeId = (typeof buyerModes)[number]["id"];
export type ContactStatus = "idle" | "sending" | "sent" | "fallback";

export interface BriefState {
  buyer: BuyerMode;
  buyerId: BuyerModeId;
  setBuyerId: (id: BuyerModeId) => void;
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
  const [buyerId, setBuyerId] = useState<BuyerModeId>(buyerModes[0].id);
  const [sprintType, setSprintType] = useState<string>(sprintTypes[0]);
  const [sprintTimeline, setSprintTimeline] = useState<string>(sprintTimelines[1]);
  const [sprintStage, setSprintStage] = useState<string>(sprintStages[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<ContactStatus>("idle");

  const buyer = buyerModes.find((mode) => mode.id === buyerId) ?? buyerModes[0];

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
