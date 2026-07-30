/**
 * 5x7 pixel glyphs. Each lit pixel becomes one brick, so the brick field
 * reads as the word itself and slowly erodes as you play. Levels cycle
 * through LEVEL_WORDS, each rendered with these glyphs.
 */

export const GLYPH_W = 5;
export const GLYPH_H = 7;
export const ROWS = GLYPH_H;
const LETTER_GAP = 1;

const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11100", "10010", "10001", "10001", "10001", "10010", "11100"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  N: ["10001", "11001", "10101", "10101", "10011", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

export interface Level {
  /** Rendered as the brick wall. */
  readonly word: string;
  /** Unlocked when the wall falls, so a run doubles as an introduction. */
  readonly fact: string;
}

/**
 * Endless mode cycles through these, in order, then repeats. Each wall is a
 * word about the person whose site this is, and clearing it reveals the line
 * behind it — playing the game is how you read the bio.
 */
export const LEVELS: readonly Level[] = [
  {
    word: "ARPIT",
    fact: "Arpit Khandelwal — fractional AI & backend engineer, building out of Bengaluru.",
  },
  {
    word: "AGENTS",
    fact: "Ships AI agents, MCP servers, and browser automation that runs unattended.",
  },
  {
    word: "BACKEND",
    fact: "Backend automation, APIs, and integration-heavy products are the day job.",
  },
  {
    word: "SOLANA",
    fact: "Also ships on Solana — hackathon projects and on-chain tooling.",
  },
  {
    word: "SPRINTS",
    fact: "Works in fixed-scope build sprints, not open-ended retainers.",
  },
  {
    word: "HIRE ME",
    fact: "Got something to build? The contact form is one click away.",
  },
];

export const LEVEL_WORDS: readonly string[] = LEVELS.map((level) => level.word);

/** Facts stop repeating once the list is exhausted, even though walls cycle. */
export function factForLevel(level: number): string | null {
  return level < LEVELS.length ? LEVELS[level].fact : null;
}

/** level is 0-based; wraps around after the last word. */
export function wordForLevel(level: number): string {
  const index = ((level % LEVEL_WORDS.length) + LEVEL_WORDS.length) % LEVEL_WORDS.length;
  return LEVEL_WORDS[index];
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
    const glyph = GLYPHS[char.toUpperCase()];
    if (!glyph) return [];

    const originCol = letterIndex * (GLYPH_W + LETTER_GAP);

    return glyph.flatMap((line, row) =>
      line.split("").flatMap((pixel, offset) =>
        pixel === "1" ? [{ col: originCol + offset, row, letterIndex }] : [],
      ),
    );
  });
}
