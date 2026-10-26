"use client";

import { useSyncExternalStore } from "react";
import { buyerModes } from "@/components/portfolio/data";

export type AudienceId = (typeof buyerModes)[number]["id"];

/** How the audience was set. "default" means nothing was known yet. */
export type AudienceSource = "default" | "click" | "param" | "referrer" | "stored";

export interface AudienceState {
  readonly id: AudienceId;
  readonly source: AudienceSource;
}

/** `?for=recruiter` on any link pre-picks the audience. */
export const AUDIENCE_PARAM = "for";
const STORAGE_KEY = "audience";
const IDS: ReadonlySet<string> = new Set(buyerModes.map((mode) => mode.id));
const DEFAULT_STATE: AudienceState = { id: buyerModes[0].id, source: "default" };

function parseAudience(value: string | null | undefined): AudienceId | null {
  return value && IDS.has(value) ? (value as AudienceId) : null;
}

/** Referrers that say who the visitor probably is. */
function audienceFromReferrer(referrer: string): AudienceId | null {
  try {
    const host = new URL(referrer).hostname;
    if (/(^|\.)linkedin\.com$/.test(host) || host === "lnkd.in") return "recruiter";
  } catch {
    // No or malformed referrer: nothing to infer.
  }
  return null;
}

/** Order of trust: an explicit link, then the visitor's own past choice, then the referrer. */
export function inferAudience(search: string, stored: string | null, referrer: string): AudienceState {
  const fromParam = parseAudience(new URLSearchParams(search).get(AUDIENCE_PARAM));
  if (fromParam) return { id: fromParam, source: "param" };
  const fromStore = parseAudience(stored);
  if (fromStore) return { id: fromStore, source: "stored" };
  const fromReferrer = audienceFromReferrer(referrer);
  if (fromReferrer) return { id: fromReferrer, source: "referrer" };
  return DEFAULT_STATE;
}

let state: AudienceState | null = null;
const listeners = new Set<() => void>();

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): AudienceState {
  state ??= inferAudience(window.location.search, readStored(), document.referrer);
  return state;
}

function getServerSnapshot(): AudienceState {
  return DEFAULT_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The visitor picked an audience: remember it and tell every subscriber. */
export function chooseAudience(id: AudienceId): void {
  state = { id, source: "click" };
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage blocked: the choice still holds for this page.
  }
  listeners.forEach((listener) => listener());
}

/** Server and first client render use the default, then the inferred audience applies. */
export function useAudience(): AudienceState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
