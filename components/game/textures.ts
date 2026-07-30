/**
 * Pre-rendered block fills. Drawing a cross-stitch texture stroke-by-stroke
 * for every brick, every frame, would be ~80 bricks x dozens of strokes x
 * 60fps. Instead each (colorIndex, textureKind) pair is rasterised once into
 * a small offscreen tile and reused as a repeating CanvasPattern.
 */

import { blockColor, BLOCK_COUNT, TextureKind } from "./theme";

/** Logical size of one repeat of the woven pattern, in board units. */
const TILE_SIZE = 12;
/** Rendered at this multiple so the tile stays crisp, then scaled back down
 * via the pattern's own transform so it still tiles every TILE_SIZE units. */
const SUPERSAMPLE = 4;
const TILE_PX = TILE_SIZE * SUPERSAMPLE;

const patternCache = new Map<string, CanvasPattern>();

/**
 * Returns a cached, repeating pattern for a given ink + weave. Built lazily
 * on first use so this module never touches `document` at import time
 * (the renderer only ever calls it from a browser rAF loop).
 */
export function getBlockPattern(
  ctx: CanvasRenderingContext2D,
  colorIndex: number,
  kind: TextureKind,
): CanvasPattern {
  const key = `${((colorIndex % BLOCK_COUNT) + BLOCK_COUNT) % BLOCK_COUNT}:${kind}`;
  const cached = patternCache.get(key);
  if (cached) return cached;

  const tile = document.createElement("canvas");
  tile.width = TILE_PX;
  tile.height = TILE_PX;
  const tileCtx = tile.getContext("2d");
  if (!tileCtx) throw new Error("2D context unavailable for texture tile");

  drawWeave(tileCtx, blockColor(colorIndex), kind);

  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) throw new Error("Failed to create block pattern");

  // The tile is TILE_PX wide but must repeat every TILE_SIZE logical units.
  pattern.setTransform(new DOMMatrix([1 / SUPERSAMPLE, 0, 0, 1 / SUPERSAMPLE, 0, 0]));

  patternCache.set(key, pattern);
  return pattern;
}

/** Clears memoised patterns. Not required on resize (patterns are
 * resolution-independent), kept for completeness. */
export function clearPatternCache(): void {
  patternCache.clear();
}

function drawWeave(ctx: CanvasRenderingContext2D, base: string, kind: TextureKind): void {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, TILE_PX, TILE_PX);

  const light = shade(base, 0.22);
  const dark = shade(base, -0.22);

  switch (kind) {
    case "horizontal":
      drawStripes(ctx, light, dark, false);
      break;
    case "vertical":
      drawStripes(ctx, light, dark, true);
      break;
    case "diagonal":
      drawDiagonal(ctx, light, dark, false);
      break;
    case "crosshatch":
      drawDiagonal(ctx, light, dark, true);
      break;
    case "weave":
      drawCheckerboard(ctx, light, dark);
      break;
    case "solid":
    default:
      drawSheen(ctx, light);
      break;
  }
}

/** Alternating light/dark bands, one thread per quarter-tile. */
function drawStripes(
  ctx: CanvasRenderingContext2D,
  light: string,
  dark: string,
  vertical: boolean,
): void {
  const band = TILE_PX / 4;
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? light : dark;
    ctx.globalAlpha = 0.5;
    if (vertical) {
      ctx.fillRect(i * band, 0, band * 0.6, TILE_PX);
    } else {
      ctx.fillRect(0, i * band, TILE_PX, band * 0.6);
    }
  }
  ctx.globalAlpha = 1;
}

/** 45-degree threads; `both` overlays the mirrored direction for crosshatch. */
function drawDiagonal(
  ctx: CanvasRenderingContext2D,
  light: string,
  dark: string,
  both: boolean,
): void {
  const step = TILE_PX / 4;
  ctx.lineWidth = step * 0.5;
  ctx.globalAlpha = 0.5;

  ctx.strokeStyle = light;
  strokeDiagonalSet(ctx, step, 1);
  ctx.strokeStyle = dark;
  strokeDiagonalSet(ctx, step, 1, step / 2);

  if (both) {
    ctx.strokeStyle = light;
    strokeDiagonalSet(ctx, step, -1);
    ctx.strokeStyle = dark;
    strokeDiagonalSet(ctx, step, -1, step / 2);
  }

  ctx.globalAlpha = 1;
}

function strokeDiagonalSet(
  ctx: CanvasRenderingContext2D,
  step: number,
  direction: 1 | -1,
  offset = 0,
): void {
  const span = TILE_PX * 2;
  ctx.beginPath();
  for (let i = -span; i <= span; i += step * 2) {
    const x = i + offset;
    if (direction === 1) {
      ctx.moveTo(x, -TILE_PX);
      ctx.lineTo(x + TILE_PX * 2, TILE_PX * 2);
    } else {
      ctx.moveTo(x, TILE_PX * 2);
      ctx.lineTo(x + TILE_PX * 2, -TILE_PX);
    }
  }
  ctx.stroke();
}

/** Small checkerboard of alternating light/dark squares. */
function drawCheckerboard(ctx: CanvasRenderingContext2D, light: string, dark: string): void {
  const cell = TILE_PX / 4;
  ctx.globalAlpha = 0.45;
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      ctx.fillStyle = (row + col) % 2 === 0 ? light : dark;
      ctx.fillRect(col * cell, row * cell, cell, cell);
    }
  }
  ctx.globalAlpha = 1;
}

/** Flat fill with a faint top-left highlight so it doesn't read as dead flat. */
function drawSheen(ctx: CanvasRenderingContext2D, light: string): void {
  const gradient = ctx.createRadialGradient(
    TILE_PX * 0.3,
    TILE_PX * 0.3,
    0,
    TILE_PX * 0.3,
    TILE_PX * 0.3,
    TILE_PX,
  );
  gradient.addColorStop(0, light);
  gradient.addColorStop(1, "transparent");
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, TILE_PX, TILE_PX);
  ctx.globalAlpha = 1;
}

/** Mixes a hex colour toward white (amount > 0) or black (amount < 0). */
function shade(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  const mix = (channel: number) => Math.round(channel + (target - channel) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}
