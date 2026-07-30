/**
 * 5x7 pixel glyphs. Each lit pixel becomes one brick, so the brick field
 * reads as the word itself and slowly erodes as you play. The words come from
 * the chapter list in dossier.ts, which also decides what each letter reveals.
 */

import { chapterForLevel, LEVEL_WORDS } from "./dossier";

export const GLYPH_W = 5;
export const GLYPH_H = 7;
export const ROWS = GLYPH_H;
const LETTER_GAP = 1;

/**
 * A-Z plus space. Keep this complete: buildBrickCells throws on anything
 * missing rather than quietly dropping the letter, because a half-rendered
 * word ("AVICI" as "AICI") passes every brick-count assertion.
 */
const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11100", "10010", "10001", "10001", "10001", "10010", "11100"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10101", "10011", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

export { LEVEL_WORDS };

/** level is 0-based; wraps around after the last word. */
export function wordForLevel(level: number): string {
  return chapterForLevel(level).word;
}

export interface BrickCell {
  readonly col: number;
  readonly row: number;
  /** Index of the letter (including spaces) this brick belongs to. */
  readonly letterIndex: number;
}

/** Total logical columns a word occupies, letters plus inter-letter gaps. */
export function gridColsFor(word: string): number {
  return word.length * GLYPH_W + Math.max(word.length - 1, 0) * LETTER_GAP;
}

export function buildBrickCells(word: string): BrickCell[] {
  return word.split("").flatMap((char, letterIndex) => {
    const key = char.toUpperCase();
    const glyph = GLYPHS[key];
    if (!glyph) {
      throw new Error(`No 5x7 glyph for "${key}" in wall word "${word}"`);
    }

    const originCol = letterIndex * (GLYPH_W + LETTER_GAP);

    return glyph.flatMap((line, row) =>
      line.split("").flatMap((pixel, offset) =>
        pixel === "1" ? [{ col: originCol + offset, row, letterIndex }] : [],
      ),
    );
  });
}
