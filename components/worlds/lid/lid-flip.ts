"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { track } from "@/lib/analytics";

export interface FlipState {
  flipped: boolean;
  frontRef: RefObject<HTMLButtonElement | null>;
  backFocusRef: RefObject<HTMLElement | null>;
  flip: (next: boolean) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * The one authored behaviour of the lid: a sticker flips to its back and back
 * again. Focus follows the face that shows; Escape flips back.
 */
export function useFlip(item: string): FlipState {
  const [flipped, setFlipped] = useState(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backFocusRef = useRef<HTMLElement>(null);
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (flipped) backFocusRef.current?.focus({ preventScroll: true });
    else frontRef.current?.focus({ preventScroll: true });
  }, [flipped]);

  const flip = (next: boolean) => {
    moveFocus.current = true;
    setFlipped(next);
    if (next) track("sticker_flip", { item });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !flipped) return;
    event.stopPropagation();
    flip(false);
  };

  return { flipped, frontRef, backFocusRef, flip, onKeyDown };
}

/** Anchor id for a case sticker, so a hero sticker can point at its full case. */
export function caseAnchor(title: string): string {
  return `case-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
