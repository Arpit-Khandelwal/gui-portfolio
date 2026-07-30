import {
  BALL_R,
  FIELD_TOP,
  GameState,
  PADDLE_H,
  PADDLE_W,
  PADDLE_Y,
  VIEW_H,
  VIEW_W,
} from "./engine";

const GRID_STEP = 20;
const GRID_DOT = 1;
const BRICK_RADIUS = 1.5;
const ROW_FADE = 0.07;

export interface Palette {
  readonly background: string;
  readonly ink: string;
  readonly line: string;
  readonly accent: string;
  readonly accentAlt: string;
}

/**
 * Colours come from the theme's custom properties so the board stays in the
 * site's palette instead of hardcoding a second one.
 */
export function readPalette(element: HTMLElement): Palette {
  const styles = getComputedStyle(element);
  const read = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;

  return {
    background: read("--page-bg", "#f5f7ef"),
    ink: read("--ink", "#11140f"),
    line: read("--line", "rgba(17, 20, 15, 0.14)"),
    accent: read("--accent", "#2457ff"),
    accentAlt: read("--accent-2", "#1f9d6a"),
  };
}

export function drawGame(ctx: CanvasRenderingContext2D, game: GameState, palette: Palette): void {
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  drawGrid(ctx, palette);
  drawBricks(ctx, game, palette);
  drawPaddle(ctx, game, palette);
  drawBall(ctx, game, palette);
}

function drawGrid(ctx: CanvasRenderingContext2D, palette: Palette): void {
  ctx.fillStyle = palette.line;
  for (let y = GRID_STEP; y < VIEW_H; y += GRID_STEP) {
    for (let x = GRID_STEP; x < VIEW_W; x += GRID_STEP) {
      ctx.fillRect(x, y, GRID_DOT, GRID_DOT);
    }
  }

  ctx.strokeStyle = palette.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, FIELD_TOP - 14);
  ctx.lineTo(VIEW_W, FIELD_TOP - 14);
  ctx.stroke();
}

function drawBricks(ctx: CanvasRenderingContext2D, game: GameState, palette: Palette): void {
  for (const brick of game.bricks) {
    if (!brick.alive) continue;

    ctx.globalAlpha = 1 - brick.row * ROW_FADE;
    ctx.fillStyle = brick.letterIndex % 2 === 0 ? palette.accent : palette.accentAlt;
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.w, brick.h, BRICK_RADIUS);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawPaddle(ctx: CanvasRenderingContext2D, game: GameState, palette: Palette): void {
  ctx.fillStyle = palette.ink;
  ctx.beginPath();
  ctx.roundRect(game.paddleX - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, PADDLE_H / 2);
  ctx.fill();
}

function drawBall(ctx: CanvasRenderingContext2D, game: GameState, palette: Palette): void {
  ctx.fillStyle = palette.ink;
  ctx.beginPath();
  ctx.arc(game.ball.x, game.ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();

  if (game.status !== "ready") return;

  // Aim hint: a short dashed tail above a ball that hasn't been launched yet.
  ctx.strokeStyle = palette.accent;
  ctx.globalAlpha = 0.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(game.ball.x, game.ball.y - BALL_R - 3);
  ctx.lineTo(game.ball.x, game.ball.y - BALL_R - 22);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}
