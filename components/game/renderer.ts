/**
 * Canvas renderer for the brick-breaker board. Pure function of GameState:
 * reads the shared contract from ./types and the palette from ./theme, never
 * mutates anything. All colour and texture data comes from ./theme and
 * ./textures so the board stays in lockstep with the Sarvam Epoch look.
 */

import { BALL_R, FIELD_TOP, FIELD_X, PADDLE_H, PADDLE_Y, VIEW_H, VIEW_W } from "./engine";
import {
  Ball,
  Brick,
  GameState,
  Particle,
  Powerup,
  PowerupKind,
  ScorePopup,
} from "./types";
import {
  blockColor,
  GRID_DOT,
  GRID_LINE,
  INK,
  INK_SOFT,
  PAPER,
  PAPER_EDGE,
  STAMP_GLYPHS,
  StampGlyph,
  textureKind,
} from "./theme";
import { getBlockPattern } from "./textures";

const GRID_MINOR_STEP = 10;
const GRID_MAJOR_STEP = 40;
const BRICK_RADIUS = 1.5;
const BRICK_EDGE_SHADOW = "rgba(20, 18, 10, 0.22)";
/** Roughly 1 in 14 blocks carries a stamp, matching the reference's sparsity. */
const STAMP_MODULO = 14;
const STAMP_CONTRAST_OFFSET = 3;

const INTRO_DURATION = 0.5;
const INTRO_STAGGER = 0.25;

const SHAKE_FREQ_X = 47;
const SHAKE_FREQ_Y = 31;

const PARTICLE_ALPHA_MAX = 1;

const POWERUP_SIZE = 16;
const POWERUP_RADIUS = 3;

const BALL_SIZE = BALL_R * 2;
const BALL_TRAIL_STEPS = 4;
const BALL_TRAIL_SPACING = 5;

const COMBO_THRESHOLD = 4;

/** Paper + grid never changes frame to frame, so it is rasterised once and
 * blitted, instead of redrawing thousands of grid dots every tick. */
let backgroundCache: HTMLCanvasElement | null = null;

/**
 * Draws one full frame. The React shell calls this once per animation frame
 * after stepping the simulation; it never needs a palette because every
 * colour comes from ./theme.
 */
export function drawGame(ctx: CanvasRenderingContext2D, game: GameState): void {
  ctx.drawImage(getBackground(), 0, 0);

  const { dx, dy } = shakeOffset(game);
  ctx.save();
  ctx.translate(dx, dy);

  drawBricks(ctx, game);
  drawParticles(ctx, game);
  drawPowerups(ctx, game);
  drawPaddle(ctx, game);
  drawBalls(ctx, game);
  drawScorePopups(ctx, game);
  drawCombo(ctx, game);

  ctx.restore();
}

function shakeOffset(game: GameState): { dx: number; dy: number } {
  if (game.shake <= 0) return { dx: 0, dy: 0 };
  const dx = Math.sin(game.elapsed * SHAKE_FREQ_X) * game.shake;
  const dy = Math.cos(game.elapsed * SHAKE_FREQ_Y) * game.shake * 0.6;
  return { dx, dy };
}

function getBackground(): HTMLCanvasElement {
  if (backgroundCache) return backgroundCache;

  const canvas = document.createElement("canvas");
  canvas.width = VIEW_W;
  canvas.height = VIEW_H;
  const bg = canvas.getContext("2d");
  if (!bg) throw new Error("2D context unavailable for background cache");

  bg.fillStyle = PAPER;
  bg.fillRect(0, 0, VIEW_W, VIEW_H);

  bg.fillStyle = GRID_DOT;
  for (let y = GRID_MINOR_STEP; y < VIEW_H; y += GRID_MINOR_STEP) {
    for (let x = GRID_MINOR_STEP; x < VIEW_W; x += GRID_MINOR_STEP) {
      bg.fillRect(x, y, 1, 1);
    }
  }

  bg.strokeStyle = GRID_LINE;
  bg.lineWidth = 1;
  bg.beginPath();
  for (let x = GRID_MAJOR_STEP; x < VIEW_W; x += GRID_MAJOR_STEP) {
    bg.moveTo(x + 0.5, 0);
    bg.lineTo(x + 0.5, VIEW_H);
  }
  for (let y = GRID_MAJOR_STEP; y < VIEW_H; y += GRID_MAJOR_STEP) {
    bg.moveTo(0, y + 0.5);
    bg.lineTo(VIEW_W, y + 0.5);
  }
  bg.stroke();

  bg.strokeStyle = PAPER_EDGE;
  bg.strokeRect(0.5, 0.5, VIEW_W - 1, VIEW_H - 1);

  backgroundCache = canvas;
  return canvas;
}

/** Deterministic per brick so the stamp layout never flickers frame to frame. */
function isStamped(brick: Brick): boolean {
  const seed = brick.row * 7 + Math.floor(brick.x) * 13 + brick.colorIndex * 31;
  return seed % STAMP_MODULO === 0;
}

function stampGlyphFor(brick: Brick): StampGlyph {
  return STAMP_GLYPHS[(brick.row + brick.colorIndex) % STAMP_GLYPHS.length];
}

/** Eased 0..1 intro progress, staggered left-to-right by the brick's column. */
function introProgress(brick: Brick, elapsed: number): number {
  const span = Math.max(VIEW_W - FIELD_X * 2, 1);
  const columnPhase = (brick.x - FIELD_X) / span;
  const start = columnPhase * INTRO_STAGGER;
  const raw = Math.min(Math.max((elapsed - start) / INTRO_DURATION, 0), 1);
  return 1 - (1 - raw) ** 3;
}

function drawBricks(ctx: CanvasRenderingContext2D, game: GameState): void {
  for (const brick of game.bricks) {
    if (!brick.alive) continue;
    drawBrick(ctx, brick, game.elapsed);
  }
}

function drawBrick(ctx: CanvasRenderingContext2D, brick: Brick, elapsed: number): void {
  const progress = introProgress(brick, elapsed);
  if (progress <= 0) return;

  const centerX = brick.x + brick.w / 2;
  const centerY = brick.y + brick.h / 2;
  const scale = 0.6 + 0.4 * progress;

  ctx.save();
  ctx.globalAlpha = progress;
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);

  ctx.beginPath();
  ctx.roundRect(brick.x, brick.y, brick.w, brick.h, BRICK_RADIUS);
  ctx.fillStyle = getBlockPattern(ctx, brick.colorIndex, textureKind(brick.textureIndex));
  ctx.fill();

  ctx.strokeStyle = BRICK_EDGE_SHADOW;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(brick.x, brick.y + brick.h - 0.5);
  ctx.lineTo(brick.x + brick.w - 0.5, brick.y + brick.h - 0.5);
  ctx.lineTo(brick.x + brick.w - 0.5, brick.y);
  ctx.stroke();

  if (isStamped(brick)) {
    drawStamp(ctx, brick, stampGlyphFor(brick));
  }

  ctx.restore();
}

function drawStamp(ctx: CanvasRenderingContext2D, brick: Brick, glyph: StampGlyph): void {
  const cx = brick.x + brick.w / 2;
  const cy = brick.y + brick.h / 2;
  const r = Math.min(brick.w, brick.h) * 0.32;

  ctx.strokeStyle = blockColor(brick.colorIndex + STAMP_CONTRAST_OFFSET);
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.beginPath();

  if (glyph === "x") {
    ctx.moveTo(cx - r, cy - r);
    ctx.lineTo(cx + r, cy + r);
    ctx.moveTo(cx + r, cy - r);
    ctx.lineTo(cx - r, cy + r);
  } else if (glyph === "plus") {
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
  } else {
    ctx.moveTo(cx - r, cy + r);
    ctx.lineTo(cx + r, cy - r);
  }

  ctx.stroke();
}

function drawParticles(ctx: CanvasRenderingContext2D, game: GameState): void {
  for (const particle of game.particles) {
    drawParticle(ctx, particle);
  }
  ctx.globalAlpha = 1;
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
  const alpha = Math.min(Math.max(particle.life / particle.maxLife, 0), PARTICLE_ALPHA_MAX);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = blockColor(particle.colorIndex);
  ctx.fillRect(
    particle.x - particle.size / 2,
    particle.y - particle.size / 2,
    particle.size,
    particle.size,
  );
}

function drawPowerups(ctx: CanvasRenderingContext2D, game: GameState): void {
  for (const powerup of game.powerups) {
    drawPowerup(ctx, powerup);
  }
}

function drawPowerup(ctx: CanvasRenderingContext2D, powerup: Powerup): void {
  const half = POWERUP_SIZE / 2;
  ctx.beginPath();
  ctx.roundRect(powerup.x - half, powerup.y - half, POWERUP_SIZE, POWERUP_SIZE, POWERUP_RADIUS);
  ctx.fillStyle = blockColor(powerup.colorIndex);
  ctx.fill();

  drawPowerupGlyph(ctx, powerup.kind, powerup.x, powerup.y);
}

function drawPowerupGlyph(
  ctx: CanvasRenderingContext2D,
  kind: PowerupKind,
  x: number,
  y: number,
): void {
  const s = 4;
  ctx.strokeStyle = PAPER;
  ctx.fillStyle = PAPER;
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  ctx.beginPath();

  switch (kind) {
    case "multiball":
      for (const [ox, oy] of [
        [0, -s],
        [-s, s * 0.7],
        [s, s * 0.7],
      ] as const) {
        ctx.moveTo(x + ox + 1.2, y + oy);
        ctx.arc(x + ox, y + oy, 1.2, 0, Math.PI * 2);
      }
      ctx.fill();
      return;
    case "wide":
      ctx.moveTo(x - s, y);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x - s, y);
      ctx.lineTo(x - s + 2, y - 2);
      ctx.moveTo(x - s, y);
      ctx.lineTo(x - s + 2, y + 2);
      ctx.moveTo(x + s, y);
      ctx.lineTo(x + s - 2, y - 2);
      ctx.moveTo(x + s, y);
      ctx.lineTo(x + s - 2, y + 2);
      break;
    case "sticky":
      ctx.arc(x, y + 1, s * 0.7, Math.PI * 0.1, Math.PI * 0.9);
      ctx.moveTo(x - s * 0.7, y + 1);
      ctx.lineTo(x - s * 0.7, y - 2);
      ctx.moveTo(x + s * 0.7, y + 1);
      ctx.lineTo(x + s * 0.7, y - 2);
      break;
    case "slow":
      ctx.moveTo(x - s, y - s);
      ctx.lineTo(x + s, y - s);
      ctx.lineTo(x - s, y + s);
      ctx.lineTo(x + s, y + s);
      ctx.closePath();
      break;
    case "life":
      ctx.moveTo(x - s, y);
      ctx.lineTo(x + s, y);
      ctx.moveTo(x, y - s);
      ctx.lineTo(x, y + s);
      break;
    default:
      break;
  }

  ctx.stroke();
}

function drawPaddle(ctx: CanvasRenderingContext2D, game: GameState): void {
  const half = game.paddleW / 2;
  const x = game.paddleX - half;

  ctx.beginPath();
  ctx.roundRect(x, PADDLE_Y, game.paddleW, PADDLE_H, PADDLE_H / 2);
  ctx.fillStyle = INK;
  ctx.fill();

  if (game.effects.stickySeconds > 0) {
    ctx.strokeStyle = PAPER;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x + 3, PADDLE_Y + 2);
    ctx.lineTo(x + game.paddleW - 3, PADDLE_Y + 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawBalls(ctx: CanvasRenderingContext2D, game: GameState): void {
  for (const ball of game.balls) {
    if (!ball.stuck) drawBallTrail(ctx, ball);
    drawBall(ctx, ball);
    if (ball.stuck) drawServeHint(ctx, ball);
  }
  ctx.globalAlpha = 1;
}

function drawBallTrail(ctx: CanvasRenderingContext2D, ball: Ball): void {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed < 1) return;

  const dirX = -ball.vx / speed;
  const dirY = -ball.vy / speed;

  for (let i = 1; i <= BALL_TRAIL_STEPS; i += 1) {
    const dist = i * BALL_TRAIL_SPACING;
    const size = BALL_SIZE * (1 - i / (BALL_TRAIL_STEPS + 2));
    ctx.globalAlpha = 0.28 * (1 - i / (BALL_TRAIL_STEPS + 1));
    ctx.fillStyle = INK;
    ctx.fillRect(ball.x + dirX * dist - size / 2, ball.y + dirY * dist - size / 2, size, size);
  }
  ctx.globalAlpha = 1;
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.roundRect(ball.x - BALL_R, ball.y - BALL_R, BALL_SIZE, BALL_SIZE, 1.5);
  ctx.fill();
}

function drawServeHint(ctx: CanvasRenderingContext2D, ball: Ball): void {
  ctx.strokeStyle = INK_SOFT;
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ball.x, ball.y - BALL_R - 3);
  ctx.lineTo(ball.x, ball.y - BALL_R - 22);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScorePopups(ctx: CanvasRenderingContext2D, game: GameState): void {
  ctx.textAlign = "center";
  for (const popup of game.popups) {
    drawScorePopup(ctx, popup);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

function drawScorePopup(ctx: CanvasRenderingContext2D, popup: ScorePopup): void {
  const alpha = Math.min(Math.max(popup.life / popup.maxLife, 0), 1);
  const rise = (1 - alpha) * 12;
  const size = popup.emphatic ? 15 : 10;

  ctx.globalAlpha = alpha;
  ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillStyle = popup.emphatic ? blockColor(4) : INK;
  ctx.fillText(popup.text.toUpperCase(), popup.x, popup.y - rise);
}

function drawCombo(ctx: CanvasRenderingContext2D, game: GameState): void {
  if (game.combo < COMBO_THRESHOLD) return;

  ctx.textAlign = "right";
  ctx.font = "700 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillStyle = blockColor(4);
  ctx.fillText(`COMBO x${game.combo}`, VIEW_W - 8, FIELD_TOP - 8);
  ctx.textAlign = "left";
}
