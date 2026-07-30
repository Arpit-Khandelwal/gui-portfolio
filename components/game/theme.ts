/**
 * Palette and geometry sampled from the Sarvam Epoch hero board: warm paper,
 * hairline graph grid, and saturated print-ink blocks carrying woven textures.
 */

export const PAPER = "#efeee9";
export const PAPER_EDGE = "#e6e4dd";
export const GRID_DOT = "rgba(28, 30, 26, 0.18)";
export const GRID_LINE = "rgba(28, 30, 26, 0.07)";
export const INK = "#26261f";
export const INK_SOFT = "rgba(38, 38, 31, 0.45)";

/** Block inks. Bricks, powerups and particles all index into this list. */
export const BLOCK_COLORS = [
  "#3f61ad", // deep blue
  "#6fa8d6", // light blue
  "#4e9440", // green
  "#8cc45a", // light green
  "#dd5599", // pink
  "#96285e", // dark magenta
  "#e0872e", // orange
] as const;

export const BLOCK_COUNT = BLOCK_COLORS.length;

/** Woven fills drawn inside each block, matching Epoch's cross-stitch look. */
export const TEXTURE_KINDS = [
  "horizontal",
  "vertical",
  "diagonal",
  "crosshatch",
  "weave",
  "solid",
] as const;

export type TextureKind = (typeof TEXTURE_KINDS)[number];

export const TEXTURE_COUNT = TEXTURE_KINDS.length;

/** Overlay glyphs Epoch stamps on a small fraction of blocks. */
export const STAMP_GLYPHS = ["x", "plus", "slash"] as const;

export type StampGlyph = (typeof STAMP_GLYPHS)[number];

export function blockColor(index: number): string {
  return BLOCK_COLORS[((index % BLOCK_COUNT) + BLOCK_COUNT) % BLOCK_COUNT];
}

export function textureKind(index: number): TextureKind {
  return TEXTURE_KINDS[((index % TEXTURE_COUNT) + TEXTURE_COUNT) % TEXTURE_COUNT];
}
