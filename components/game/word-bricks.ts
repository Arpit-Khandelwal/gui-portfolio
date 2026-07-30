/**
 * 5x7 pixel glyphs. Each lit pixel becomes one brick, so the brick field
 * reads as the word itself and slowly erodes as you play.
 */

export const GLYPH_W = 5;
export const GLYPH_H = 7;
const LETTER_GAP = 1;

const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
};

export const WORD = "ARPIT";

export const COLS = WORD.length * GLYPH_W + (WORD.length - 1) * LETTER_GAP;
export const ROWS = GLYPH_H;

export interface BrickCell {
  readonly col: number;
  readonly row: number;
  /** Index of the letter this brick belongs to, used to pick its colour. */
  readonly letterIndex: number;
}

export function countBricks(): number {
  return buildBrickCells().length;
}

export function buildBrickCells(): BrickCell[] {
  return WORD.split("").flatMap((char, letterIndex) => {
    const glyph = GLYPHS[char];
    if (!glyph) return [];

    const originCol = letterIndex * (GLYPH_W + LETTER_GAP);

    return glyph.flatMap((line, row) =>
      line.split("").flatMap((pixel, offset) =>
        pixel === "1" ? [{ col: originCol + offset, row, letterIndex }] : [],
      ),
    );
  });
}
