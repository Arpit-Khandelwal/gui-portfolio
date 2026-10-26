/**
 * Typographic posters for the title wall. No screenshots exist, so each build
 * gets one stable hue field derived from its title, plus ink colours picked by
 * computed WCAG contrast. Everything is deterministic: same title, same poster.
 */

export interface PosterColors {
  /** The hue field. */
  field: string;
  /** Title ink, at least 4.5:1 on the field. */
  ink: string;
  /** Secondary ink tinted from the field, at least 4.5:1 on the field. */
  inkSoft: string;
  /** Decorative glyph tone, close to the field. */
  glyph: string;
  /** True when the ink is light (dark field). */
  isDarkField: boolean;
}

type Rgb = readonly [number, number, number];

const MIN_CONTRAST = 4.5;
/** Title ink target; leaves room for a softer secondary ink above 4.5:1. */
const INK_TARGET = 6;
const LIGHTNESS_STEP = 0.02;
/** Hues at or below WARM_END, or at or above WARM_START, never get a deep field. */
const WARM_END = 50;
const WARM_START = 335;
/** Hues 40-110 belong to the amber focus ring; posters never use them. */
const HUE_START = 110;
const HUE_SPAN = 290;

/** FNV-1a, 32-bit. Stable across runs and platforms. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function hslToRgb(hue: number, saturation: number, lightness: number): Rgb {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = (hue % 360) / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const offset = lightness - chroma / 2;
  const table: readonly Rgb[] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ];
  const [r, g, b] = table[Math.floor(segment) % 6];
  return [r + offset, g + offset, b + offset];
}

function channelToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: Rgb): number {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
  return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount];
}

function toHex(rgb: Rgb): string {
  return `#${rgb
    .map((channel) =>
      Math.round(Math.min(1, Math.max(0, channel)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Rounds through hex so the contrast check runs on the colour that ships. */
function quantize(rgb: Rgb): Rgb {
  return rgb.map((channel) => Math.round(Math.min(1, Math.max(0, channel)) * 255) / 255) as unknown as Rgb;
}

export interface PosterColorsWithRatios extends PosterColors {
  inkRatio: number;
  inkSoftRatio: number;
  /** Secondary ink over the glyph tone, for text that crosses a glyph. */
  glyphRatio: number;
}

export function posterColorsWithRatios(seed: string): PosterColorsWithRatios {
  const hash = hashString(seed);
  const hue = (HUE_START + (hash % HUE_SPAN)) % 360;
  const saturation = 0.8 + ((hash >>> 12) % 15) / 100;
  // Warm hues on a deep field read as brown, not as a saturated colour.
  const isWarm = hue <= WARM_END || hue >= WARM_START;
  const isDeep = !isWarm && ((hash >>> 9) & 1) === 1;
  const lightness = isDeep ? 0.3 + ((hash >>> 16) % 7) / 100 : 0.5 + ((hash >>> 16) % 8) / 100;

  const lightInk = quantize(hslToRgb(hue, 0.4, 0.97));
  const darkInk = quantize(hslToRgb(hue, 0.55, 0.09));
  const firstField = quantize(hslToRgb(hue, saturation, lightness));
  const isDarkField = contrastRatio(lightInk, firstField) >= contrastRatio(darkInk, firstField);
  const ink = isDarkField ? lightInk : darkInk;

  // Mid-luminance hues (teal, violet) can miss the target with either ink.
  // Move the field away from the ink until the title has room to spare.
  let fieldLightness = lightness;
  let field = firstField;
  while (contrastRatio(ink, field) < INK_TARGET && fieldLightness > 0.12 && fieldLightness < 0.88) {
    fieldLightness += isDarkField ? -LIGHTNESS_STEP : LIGHTNESS_STEP;
    field = quantize(hslToRgb(hue, saturation, fieldLightness));
  }

  let inkSoft = ink;
  for (let amount = 0.4; amount > 0; amount -= 0.05) {
    const candidate = quantize(mix(ink, field, amount));
    if (contrastRatio(candidate, field) >= MIN_CONTRAST) {
      inkSoft = candidate;
      break;
    }
  }

  // The glyph tone moves away from the ink, so text over a glyph keeps its contrast.
  const glyph = quantize(hslToRgb(hue, saturation, isDarkField ? fieldLightness - 0.08 : fieldLightness + 0.1));

  return {
    field: toHex(field),
    ink: toHex(ink),
    inkSoft: toHex(inkSoft),
    glyph: toHex(glyph),
    isDarkField,
    inkRatio: contrastRatio(ink, field),
    inkSoftRatio: contrastRatio(inkSoft, field),
    glyphRatio: contrastRatio(inkSoft, glyph),
  };
}

export function posterColors(seed: string): PosterColors {
  const { field, ink, inkSoft, glyph, isDarkField } = posterColorsWithRatios(seed);
  return { field, ink, inkSoft, glyph, isDarkField };
}

/** Inline custom properties that wall.css reads on a poster surface. */
export function posterStyle(seed: string): Record<string, string> {
  const colors = posterColors(seed);
  return {
    "--poster-field": colors.field,
    "--poster-ink": colors.ink,
    "--poster-ink-soft": colors.inkSoft,
    "--poster-glyph": colors.glyph,
  };
}

/** Average advance of Archivo 900 at 125% width, in em, with a safety margin. */
const WIDE_HEAVY_ADVANCE = 0.7;
const LINE_HEIGHT = 1;

interface FitBox {
  /** Usable width, in container-inline units (cqi). */
  width: number;
  /** Usable height, in cqi. */
  height: number;
  max: number;
  min: number;
}

const CARD_TITLE_BOX: FitBox = { width: 86, height: 28, max: 17, min: 6 };

function countLines(words: readonly string[], charsPerLine: number): number {
  let lines = 1;
  let used = 0;
  for (const word of words) {
    const next = used === 0 ? word.length : used + 1 + word.length;
    if (next > charsPerLine && used > 0) {
      lines += 1;
      used = word.length;
    } else {
      used = next;
    }
  }
  return lines;
}

/**
 * Largest title size (in cqi) where the longest word fits one line and all
 * lines fit the title box. Runs at render, so the poster never reflows.
 */
export function fitTitleSize(title: string, box: FitBox = CARD_TITLE_BOX): number {
  const words = title.split(/\s+/).filter(Boolean);
  const longest = Math.max(...words.map((word) => word.length));
  for (let size = box.max; size > box.min; size -= 0.5) {
    const charsPerLine = box.width / (size * WIDE_HEAVY_ADVANCE);
    if (longest > charsPerLine) continue;
    if (countLines(words, charsPerLine) * size * LINE_HEIGHT <= box.height) return size;
  }
  return box.min;
}

/** The first letter or numeral of a title, for the poster's background glyph. */
export function posterGlyph(title: string): string {
  const match = title.match(/[A-Za-z0-9]/);
  return match ? match[0].toUpperCase() : title.charAt(0);
}

export type PosterLayout = "corner" | "edge" | "ribbon" | "split" | "numeral";

const GLYPH_LAYOUTS: readonly PosterLayout[] = ["corner", "edge", "ribbon", "split"];

/** A stable composition per title, so thirty posters do not repeat one formula. */
export function posterLayout(seed: string, numeral?: string): PosterLayout {
  if (numeral) return "numeral";
  return GLYPH_LAYOUTS[(hashString(seed) >>> 20) % GLYPH_LAYOUTS.length];
}

/**
 * The headline number in a proof line ("50k+", "255,168", "494"), if any.
 * Skips digits glued to letters, so "x402" or "t3.micro" never match.
 */
export function metricNumeral(text: string): string | undefined {
  const match = text.match(/(?<![A-Za-z0-9.])(\d{1,3}(?:,\d{3})+|\d+k\+|\d+\+|\d{3,})(?![A-Za-z0-9])/);
  return match?.[1];
}

/** Numeral size in cqw, so long numbers still fill the poster without wrapping. */
export function numeralSize(numeral: string): number {
  return Math.min(46, 120 / Math.max(numeral.length, 1));
}
