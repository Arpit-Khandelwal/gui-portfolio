import { buildBrickCells, COLS, ROWS } from "./word-bricks";

/**
 * The game runs in a fixed logical viewport. The canvas is scaled to fit its
 * container, so physics never has to be rescaled and stays identical on every
 * screen and refresh rate.
 */
export const VIEW_W = 640;
export const VIEW_H = 460;

export const FIELD_X = 26;
export const FIELD_TOP = 62;
export const BRICK_W = (VIEW_W - FIELD_X * 2) / COLS;
export const BRICK_H = 15;
export const BRICK_INSET = 1.2;

export const PADDLE_W = 92;
export const PADDLE_H = 10;
export const PADDLE_Y = VIEW_H - 30;
const PADDLE_KEY_SPEED = 520;

export const BALL_R = 5.2;
const BALL_SPEED_START = 265;
const BALL_SPEED_MAX = 430;
const BALL_SPEED_STEP = 4;
const MAX_BOUNCE_ANGLE = Math.PI / 3;
/**
 * A perfectly vertical ball can bounce between the paddle and one brick column
 * forever, so every paddle bounce keeps at least this much sideways travel.
 */
const MIN_BOUNCE_ANGLE = 0.16;

export const STEP_SECONDS = 1 / 120;
export const MAX_FRAME_SECONDS = 0.25;
export const LIVES_START = 3;

const POINTS_TOP_ROW = 80;
const POINTS_PER_ROW = 10;

export type GameStatus = "ready" | "playing" | "won" | "lost";

export interface Brick {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly letterIndex: number;
  readonly row: number;
  readonly points: number;
  alive: boolean;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
}

export interface GameState {
  status: GameStatus;
  bricks: Brick[];
  bricksLeft: number;
  ball: Ball;
  paddleX: number;
  /** -1, 0 or 1 from the arrow keys. Pointer input sets paddleX directly. */
  keyDirection: number;
  score: number;
  lives: number;
}

/**
 * Game state is mutated in place. A 120Hz loop allocating a fresh state object
 * every tick would churn the GC for no benefit; nothing outside the loop reads
 * it, and the HUD is driven by a separate React snapshot.
 */
export function createGame(): GameState {
  const bricks = buildBrickCells().map<Brick>((cell) => ({
    x: FIELD_X + cell.col * BRICK_W + BRICK_INSET,
    y: FIELD_TOP + cell.row * BRICK_H + BRICK_INSET,
    w: BRICK_W - BRICK_INSET * 2,
    h: BRICK_H - BRICK_INSET * 2,
    letterIndex: cell.letterIndex,
    row: cell.row,
    points: POINTS_TOP_ROW - cell.row * POINTS_PER_ROW,
    alive: true,
  }));

  return {
    status: "ready",
    bricks,
    bricksLeft: bricks.length,
    ball: restingBall(VIEW_W / 2),
    paddleX: VIEW_W / 2,
    keyDirection: 0,
    score: 0,
    lives: LIVES_START,
  };
}

function restingBall(paddleX: number): Ball {
  return {
    x: paddleX,
    y: PADDLE_Y - BALL_R - 1,
    vx: 0,
    vy: 0,
    speed: BALL_SPEED_START,
  };
}

export function launchBall(game: GameState): void {
  if (game.status !== "ready") return;

  // Always upward, never straight up, side chosen at random.
  const angle = (Math.random() * 0.5 + 0.25) * MAX_BOUNCE_ANGLE * (Math.random() < 0.5 ? -1 : 1);
  game.ball.speed = BALL_SPEED_START;
  game.ball.vx = Math.sin(angle) * game.ball.speed;
  game.ball.vy = -Math.cos(angle) * game.ball.speed;
  game.status = "playing";
}

export function movePaddleTo(game: GameState, x: number): void {
  const half = PADDLE_W / 2;
  game.paddleX = clamp(x, half, VIEW_W - half);
  if (game.status === "ready") {
    game.ball.x = game.paddleX;
  }
}

/** Advances the simulation by one fixed timestep. */
export function stepGame(game: GameState): void {
  if (game.status === "won" || game.status === "lost") return;

  if (game.keyDirection !== 0) {
    movePaddleTo(game, game.paddleX + game.keyDirection * PADDLE_KEY_SPEED * STEP_SECONDS);
  }

  if (game.status !== "playing") return;

  const { ball } = game;
  ball.x += ball.vx * STEP_SECONDS;
  ball.y += ball.vy * STEP_SECONDS;

  bounceOffWalls(ball);
  bounceOffPaddle(game);
  hitBrick(game);

  if (ball.y - BALL_R > VIEW_H) {
    loseLife(game);
  }
}

function bounceOffWalls(ball: Ball): void {
  if (ball.x < BALL_R) {
    ball.x = BALL_R;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x > VIEW_W - BALL_R) {
    ball.x = VIEW_W - BALL_R;
    ball.vx = -Math.abs(ball.vx);
  }

  if (ball.y < BALL_R) {
    ball.y = BALL_R;
    ball.vy = Math.abs(ball.vy);
  }
}

function bounceOffPaddle(game: GameState): void {
  const { ball } = game;
  const half = PADDLE_W / 2;

  const isDescending = ball.vy > 0;
  const isAtPaddleHeight = ball.y + BALL_R >= PADDLE_Y && ball.y - BALL_R <= PADDLE_Y + PADDLE_H;
  const isOverPaddle = Math.abs(ball.x - game.paddleX) <= half + BALL_R;

  if (!isDescending || !isAtPaddleHeight || !isOverPaddle) return;

  // Where the ball lands on the paddle decides the exit angle, so the player
  // steers rather than just blocks.
  const offset = clamp((ball.x - game.paddleX) / half, -1, 1);
  const angle = applyMinimumAngle(offset * MAX_BOUNCE_ANGLE, ball.vx);

  ball.speed = Math.min(ball.speed + BALL_SPEED_STEP, BALL_SPEED_MAX);
  ball.vx = Math.sin(angle) * ball.speed;
  ball.vy = -Math.cos(angle) * ball.speed;
  ball.y = PADDLE_Y - BALL_R;
}

/** Nudges a too-shallow bounce away from vertical, keeping its direction. */
function applyMinimumAngle(angle: number, incomingVx: number): number {
  if (Math.abs(angle) >= MIN_BOUNCE_ANGLE) return angle;

  const sign = angle !== 0 ? Math.sign(angle) : Math.sign(incomingVx) || 1;
  return sign * MIN_BOUNCE_ANGLE;
}

function hitBrick(game: GameState): void {
  const { ball } = game;

  const minCol = columnAt(ball.x - BALL_R);
  const maxCol = columnAt(ball.x + BALL_R);
  const minRow = rowAt(ball.y - BALL_R);
  const maxRow = rowAt(ball.y + BALL_R);

  if (maxCol < 0 || minCol >= COLS || maxRow < 0 || minRow >= ROWS) return;

  for (const brick of game.bricks) {
    if (!brick.alive) continue;
    if (brick.row < minRow || brick.row > maxRow) continue;

    const centerX = brick.x + brick.w / 2;
    const centerY = brick.y + brick.h / 2;
    const overlapX = BALL_R + brick.w / 2 - Math.abs(ball.x - centerX);
    const overlapY = BALL_R + brick.h / 2 - Math.abs(ball.y - centerY);

    if (overlapX <= 0 || overlapY <= 0) continue;

    // Resolve along the shallower axis, then push the ball clear so it can't
    // tunnel into the next brick on the following tick.
    if (overlapX < overlapY) {
      ball.vx = ball.x < centerX ? -Math.abs(ball.vx) : Math.abs(ball.vx);
      ball.x += ball.x < centerX ? -overlapX : overlapX;
    } else {
      ball.vy = ball.y < centerY ? -Math.abs(ball.vy) : Math.abs(ball.vy);
      ball.y += ball.y < centerY ? -overlapY : overlapY;
    }

    brick.alive = false;
    game.bricksLeft -= 1;
    game.score += brick.points;

    if (game.bricksLeft === 0) {
      game.status = "won";
    }

    // One brick per tick keeps the bounce direction unambiguous.
    return;
  }
}

function loseLife(game: GameState): void {
  game.lives -= 1;

  if (game.lives <= 0) {
    game.lives = 0;
    game.status = "lost";
    return;
  }

  game.ball = restingBall(game.paddleX);
  game.status = "ready";
}

function columnAt(x: number): number {
  return Math.floor((x - FIELD_X) / BRICK_W);
}

function rowAt(y: number): number {
  return Math.floor((y - FIELD_TOP) / BRICK_H);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
