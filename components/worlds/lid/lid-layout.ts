import type { CSSProperties } from "react";
import { linkEventParams } from "@/lib/analytics-helpers";
import type { ShapeId } from "./lid-shapes";

/**
 * Hand-authored sticker placement for the lid. Every value is fixed so the
 * server render and the client render match (no random rotation).
 */

export type StickerColor = "orange" | "yellow" | "blue" | "green" | "ink" | "lilac" | "white";

/** One build sticker on the first viewport. */
export type HeroLook = {
  readonly shape: ShapeId;
  readonly color: StickerColor;
  /** Width / height of the silhouette. */
  readonly ratio: number;
};

/** Each build gets its own silhouette. Keys are `selectedWork` titles, verbatim. */
export const HERO_LOOKS: Readonly<Record<string, HeroLook>> = {
  "Reskilll Platform": { shape: "shield", color: "orange", ratio: 0.9 },
  "Swiggy MCP Server": { shape: "hexagon", color: "blue", ratio: 1.2 },
  "Gossip DAO": { shape: "star", color: "yellow", ratio: 1 },
  "Helius Indexer": { shape: "ticket", color: "green", ratio: 1.55 },
  "Dark Payroll": { shape: "circle", color: "ink", ratio: 1 },
  "Arcium Privacy Suite": { shape: "pill", color: "lilac", ratio: 1.9 },
  AgentPay: { shape: "pennant", color: "orange", ratio: 1.6 },
  "sold.": { shape: "tag", color: "white", ratio: 1.5 },
  "x402 Web Services": { shape: "circle", color: "yellow", ratio: 1 },
  Leash: { shape: "octagon", color: "green", ratio: 1 },
  "Slop Filter for LinkedIn": { shape: "bubble", color: "white", ratio: 1.3 },
  GraveShift: { shape: "tombstone", color: "lilac", ratio: 0.86 },
};

const FALLBACK_LOOKS: readonly HeroLook[] = [
  { shape: "label", color: "blue", ratio: 1.3 },
  { shape: "leaf", color: "yellow", ratio: 1.2 },
];

export function heroLook(title: string, index: number): HeroLook {
  return HERO_LOOKS[title] ?? FALLBACK_LOOKS[index % FALLBACK_LOOKS.length];
}

/**
 * Desktop positions on the square lid cluster, in % of its width. z sets the
 * stacking, so stickers overlap at the edges like a real lid.
 */
export type HeroSlot = { readonly left: number; readonly top: number; readonly width: number; readonly z: number; readonly rotate: number };

export const HERO_SLOTS: readonly HeroSlot[] = [
  { left: 0, top: 0, width: 34, z: 3, rotate: -6 },
  { left: 29, top: 3, width: 33, z: 2, rotate: 4 },
  { left: 62, top: 0, width: 34, z: 4, rotate: 9 },
  { left: 1, top: 32, width: 36, z: 5, rotate: 3 },
  { left: 34, top: 26, width: 28, z: 6, rotate: -5 },
  { left: 59, top: 30, width: 39, z: 3, rotate: -7 },
  { left: 0, top: 54, width: 35, z: 4, rotate: -3 },
  { left: 30, top: 51, width: 33, z: 7, rotate: 7 },
  { left: 39, top: 74, width: 25, z: 5, rotate: -9 },
  { left: 63, top: 47, width: 27, z: 6, rotate: 6 },
  { left: 4, top: 73, width: 34, z: 6, rotate: 4 },
  { left: 72, top: 70, width: 26, z: 5, rotate: -4 },
];

/** Rotations for stickers in a packed cluster (cases, PRs, archive, badges). */
export const ROW_TILT: readonly number[] = [-3, 2.5, -1.5, 4, -4, 1.5, 3, -2.5, 2, -3.5, 1, -1];

export const SHIPPED_COLORS: readonly StickerColor[] = ["orange", "blue", "ink", "green", "yellow"];
export const MERGED_COLORS: readonly StickerColor[] = ["green", "yellow", "blue", "orange", "ink", "lilac"];

/** Case contours: rectangle-family die cuts that still hold a paragraph. */
export const CASE_SHAPES: readonly ShapeId[] = ["card", "ticket", "label", "leaf", "folder", "bubble"];
export const CASE_WIDTHS: readonly ("narrow" | "mid" | "wide")[] = ["wide", "narrow", "mid", "narrow", "wide", "mid"];
/** Vertical nudge per case, in px, so rows read as a pile and not a grid. */
export const CASE_NUDGE: readonly number[] = [0, 34, -10, 22, 6, -18];

export function tilt(index: number, scale = 1): number {
  return ROW_TILT[index % ROW_TILT.length] * scale;
}

export function rotateStyle(rotate: number): CSSProperties {
  return { "--r": rotate } as CSSProperties;
}

/** Analytics link params: the host and the URL without query or fragment. */
export function linkParams(href: string): { link_domain: string; link_url: string } {
  return linkEventParams(href);
}
