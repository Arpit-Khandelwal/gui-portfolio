import { BLOCK_COUNT, TEXTURE_COUNT } from "./theme";
import type {
  Ball,
  Brick,
  Effects,
  GameState,
  Hud,
  Powerup,
  PowerupKind,
} from "./types";
import { buildBrickCells, gridColsFor, wordForLevel, type BrickCell } from "./word-bricks";

/**
 * The game runs in a fixed logical viewport. The canvas is scaled to fit its
 * container, so physics never has to be rescaled and stays identical on every
 * screen and refresh rate.
 */
export const VIEW_W = 640;
export const VIEW_H = 460;

export const FIELD_X = 26;
export const FIELD_TOP = 62;
export const BRICK_H = 15;
const BRICK_INSET = 1.2;

const PADDLE_BASE_W = 92;
const PADDLE_WIDE_MULT = 1.6;
export const PADDLE_H = 10;
export const PADDLE_Y = VIEW_H - 30;
const PADDLE_KEY_SPEED = 520;

export const BALL_R = 5.2;
const BALL_SPEED_BASE = 265;
const BALL_SPEED_LEVEL_STEP = 18;
const BALL_SPEED_LEVEL_CAP = 430;
const BALL_SPEED_HIT_STEP = 4;
const BALL_SPEED_HIT_CAP = 470;
const MAX_BOUNCE_ANGLE = Math.PI / 3;
/**
 * A perfectly vertical ball can bounce between the paddle and one brick column
 * forever, so every paddle bounce keeps at least this much sideways travel.
 */
const MIN_BOUNCE_ANGLE = 0.16;

export const STEP_SECONDS = 1 / 120;
export const MAX_FRAME_SECONDS = 0.25;
export const LIVES_START = 3;
const LIVES_CAP = 5;

const POINTS_TOP_ROW = 80;
const POINTS_PER_ROW = 10;

// Combo multiplier: +1 every 4 bricks in a streak, capped at 8x.
const COMBO_MULTIPLIER_STEP = 4;
const COMBO_MULTIPLIER_CAP = 8;

// Powerups: ~18% of bricks carry one, spread across letters; "life" is rare.
const POWERUP_BRICK_RATIO = 0.18;
const POWERUP_LIFE_RATIO = 1 / 12;
const POWERUP_KINDS: readonly PowerupKind[] = ["multiball", "wide", "sticky", "slow"];
const POWERUP_FALL_SPEED = 150;
const POWERUP_R = 9;
const MAX_BALLS = 8;

const EFFECT_WIDE_SECONDS = 12;
const EFFECT_SLOW_SECONDS = 8;
const EFFECT_STICKY_SECONDS = 12;
const SLOW_FACTOR = 0.65;
const MULTIBALL_SPREAD_RAD = 0.4;

const MAX_PARTICLES = 260;
const PARTICLE_GRAVITY = 500;
const PARTICLE_MIN_LIFE = 0.35;
const PARTICLE_MAX_LIFE = 0.7;
const PARTICLE_MIN_COUNT = 8;
const PARTICLE_MAX_COUNT = 12;
const PARTICLE_MIN_SIZE = 1.5;
const PARTICLE_MAX_SIZE = 3.5;
const PARTICLE_UPWARD_BIAS = 80;

const POPUP_LIFE = 0.9;
const POPUP_RISE_SPEED = 40;

const SHAKE_ON_COMBO = 3;
const SHAKE_ON_LIFE_LOST = 5;
const SHAKE_DECAY = 0.9;
const SHAKE_SNAP = 0.05;

/** (VIEW_W - FIELD_X*2) / gridColsFor(word); the renderer needs this per word. */
export function brickWidthFor(word: string): number {
  return (VIEW_W - FIELD_X * 2) / gridColsFor(word);
}

function baseSpeedForLevel(level: number): number {
  return Math.min(BALL_SPEED_BASE + level * BALL_SPEED_LEVEL_STEP, BALL_SPEED_LEVEL_CAP);
}

/** Tracks the highest score seen across resets in this module's lifetime. */
let bestScoreEver = 0;

/**
 * Game state is mutated in place. A 120Hz loop allocating a fresh state object
 * every tick would churn the GC for no benefit; nothing outside the loop reads
 * it, and the HUD is driven by a separate React snapshot.
 *
 * There is no separate resetGame export: starting over just means calling
 * createGame() again and swapping the shell's reference to the new state.
 */
export function createGame(): GameState {
  const level = 0;
  const word = wordForLevel(level);
  const bricks = buildBricks(word);

  return {
    status: "ready",
    level,
    word,
    bricks,
    bricksLeft: bricks.length,
    balls: [makeStuckBall(VIEW_W / 2, level)],
    powerups: [],
    particles: [],
    popups: [],
    effects: freshEffects(),
    paddleX: VIEW_W / 2,
    paddleW: PADDLE_BASE_W,
    keyDirection: 0,
    score: 0,
    lives: LIVES_START,
    combo: 0,
    bestCombo: 0,
    shake: 0,
    elapsed: 0,
    events: [],
  };
}

function freshEffects(): Effects {
  return { wideSeconds: 0, slowSeconds: 0, stickySeconds: 0 };
}

function makeStuckBall(paddleX: number, level: number): Ball {
  return {
    x: paddleX,
    y: PADDLE_Y - BALL_R - 1,
    vx: 0,
    vy: 0,
    speed: baseSpeedForLevel(level),
    stuck: true,
    stuckOffset: 0,
  };
}

function buildBricks(word: string): Brick[] {
  const cells = buildBrickCells(word);
  const bw = brickWidthFor(word);
  const powerupByIndex = assignPowerups(cells);

  return cells.map((cell, index) => ({
    x: FIELD_X + cell.col * bw + BRICK_INSET,
    y: FIELD_TOP + cell.row * BRICK_H + BRICK_INSET,
    w: bw - BRICK_INSET * 2,
    h: BRICK_H - BRICK_INSET * 2,
    colorIndex: cell.letterIndex % BLOCK_COUNT,
    textureIndex: (cell.letterIndex + cell.row) % TEXTURE_COUNT,
    row: cell.row,
    points: POINTS_TOP_ROW - cell.row * POINTS_PER_ROW,
    powerup: powerupByIndex.get(index) ?? null,
    alive: true,
  }));
}

/**
 * Round-robins the chosen powerup bricks across letters so a single letter
 * never hoards them, then hands each a kind (rarely "life").
 */
function assignPowerups(cells: readonly BrickCell[]): Map<number, PowerupKind> {
  const byLetter = new Map<number, number[]>();
  cells.forEach((cell, index) => {
    const pool = byLetter.get(cell.letterIndex) ?? [];
    pool.push(index);
    byLetter.set(cell.letterIndex, pool);
  });

  const pools = shuffle([...byLetter.values()].map((pool) => shuffle(pool)));
  const desired = Math.round(cells.length * POWERUP_BRICK_RATIO);
  const chosen: number[] = [];

  while (chosen.length < desired) {
    const before = chosen.length;
    for (const pool of pools) {
      if (chosen.length >= desired) break;
      const next = pool.pop();
      if (next !== undefined) chosen.push(next);
    }
    if (chosen.length === before) break; // every pool ran dry
  }

  const assignments = new Map<number, PowerupKind>();
  for (const index of chosen) {
    const isLife = Math.random() < POWERUP_LIFE_RATIO;
    const kind = isLife ? "life" : POWERUP_KINDS[Math.floor(Math.random() * POWERUP_KINDS.length)];
    assignments.set(index, kind);
  }
  return assignments;
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Releases any stuck balls: the initial serve, or balls caught by sticky. */
export function launchBall(game: GameState): void {
  const stuckBalls = game.balls.filter((ball) => ball.stuck);
  if (stuckBalls.length === 0) return;

  const isInitialServe = game.status === "ready";
  for (const ball of stuckBalls) {
    if (isInitialServe) ball.speed = baseSpeedForLevel(game.level);
    const angle = randomServeAngle();
    ball.vx = Math.sin(angle) * ball.speed;
    ball.vy = -Math.cos(angle) * ball.speed;
    ball.stuck = false;
    ball.stuckOffset = 0;
  }

  if (isInitialServe) game.status = "playing";
}

function randomServeAngle(): number {
  // Always upward, never straight up, side chosen at random.
  return (Math.random() * 0.5 + 0.25) * MAX_BOUNCE_ANGLE * (Math.random() < 0.5 ? -1 : 1);
}

export function movePaddleTo(game: GameState, x: number): void {
  const half = game.paddleW / 2;
  game.paddleX = clamp(x, half, VIEW_W - half);
  for (const ball of game.balls) {
    if (ball.stuck) ball.x = game.paddleX + ball.stuckOffset;
  }
}

/** Advances the simulation by one fixed timestep. */
export function stepGame(game: GameState): void {
  if (game.status === "lost") return;

  if (game.keyDirection !== 0) {
    movePaddleTo(game, game.paddleX + game.keyDirection * PADDLE_KEY_SPEED * STEP_SECONDS);
  }

  updateEffects(game);
  updateParticles(game);
  updatePopups(game);
  updateShakeDecay(game);
  game.elapsed += STEP_SECONDS;

  if (game.status !== "playing") return;

  updatePowerupsFalling(game);
  stepBalls(game);

  if (game.status === "playing") handleBallsBelowField(game);
}

function stepBalls(game: GameState): void {
  const factor = game.effects.slowSeconds > 0 ? SLOW_FACTOR : 1;

  for (const ball of game.balls) {
    if (game.status !== "playing") break;
    if (ball.stuck) continue;

    ball.x += ball.vx * factor * STEP_SECONDS;
    ball.y += ball.vy * factor * STEP_SECONDS;

    bounceOffWalls(game, ball);
    bounceOffPaddle(game, ball);
    hitBrick(game, ball);
  }
}

function bounceOffWalls(game: GameState, ball: Ball): void {
  let bounced = false;

  if (ball.x < BALL_R) {
    ball.x = BALL_R;
    ball.vx = Math.abs(ball.vx);
    bounced = true;
  } else if (ball.x > VIEW_W - BALL_R) {
    ball.x = VIEW_W - BALL_R;
    ball.vx = -Math.abs(ball.vx);
    bounced = true;
  }

  if (ball.y < BALL_R) {
    ball.y = BALL_R;
    ball.vy = Math.abs(ball.vy);
    bounced = true;
  }

  if (bounced) game.events.push({ kind: "wall" });
}

function bounceOffPaddle(game: GameState, ball: Ball): void {
  const half = game.paddleW / 2;
  const isDescending = ball.vy > 0;
  const isAtPaddleHeight = ball.y + BALL_R >= PADDLE_Y && ball.y - BALL_R <= PADDLE_Y + PADDLE_H;
  const isOverPaddle = Math.abs(ball.x - game.paddleX) <= half + BALL_R;

  if (!isDescending || !isAtPaddleHeight || !isOverPaddle) return;

  game.combo = 0;

  if (game.effects.stickySeconds > 0) {
    ball.stuck = true;
    ball.vx = 0;
    ball.vy = 0;
    ball.stuckOffset = clamp(ball.x - game.paddleX, -half, half);
    ball.y = PADDLE_Y - BALL_R;
    game.events.push({ kind: "paddle" });
    return;
  }

  // Where the ball lands on the paddle decides the exit angle, so the player
  // steers rather than just blocks.
  const offset = clamp((ball.x - game.paddleX) / half, -1, 1);
  const angle = applyMinimumAngle(offset * MAX_BOUNCE_ANGLE, ball.vx);

  ball.speed = Math.min(ball.speed + BALL_SPEED_HIT_STEP, BALL_SPEED_HIT_CAP);
  ball.vx = Math.sin(angle) * ball.speed;
  ball.vy = -Math.cos(angle) * ball.speed;
  ball.y = PADDLE_Y - BALL_R;
  game.events.push({ kind: "paddle" });
}

/** Nudges a too-shallow bounce away from vertical, keeping its direction. */
function applyMinimumAngle(angle: number, incomingVx: number): number {
  if (Math.abs(angle) >= MIN_BOUNCE_ANGLE) return angle;

  const sign = angle !== 0 ? Math.sign(angle) : Math.sign(incomingVx) || 1;
  return sign * MIN_BOUNCE_ANGLE;
}

function hitBrick(game: GameState, ball: Ball): void {
  for (const brick of game.bricks) {
    if (!brick.alive) continue;

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

    breakBrick(game, brick, centerX, centerY);
    return; // one collision per ball per tick keeps the bounce unambiguous
  }
}

function breakBrick(game: GameState, brick: Brick, centerX: number, centerY: number): void {
  brick.alive = false;
  game.bricksLeft -= 1;
  game.combo += 1;
  game.bestCombo = Math.max(game.bestCombo, game.combo);

  const multiplier = Math.min(1 + Math.floor(game.combo / COMBO_MULTIPLIER_STEP), COMBO_MULTIPLIER_CAP);
  const points = brick.points * multiplier;
  game.score += points;

  spawnPopup(game, centerX, centerY, `+${points}`, multiplier >= 3);
  spawnParticles(game, centerX, centerY, brick.colorIndex);
  if (multiplier >= 3) game.shake = Math.max(game.shake, SHAKE_ON_COMBO);

  game.events.push({ kind: "brick", combo: game.combo });

  if (brick.powerup) {
    game.powerups.push({ x: centerX, y: centerY, vy: POWERUP_FALL_SPEED, kind: brick.powerup, colorIndex: brick.colorIndex });
    game.events.push({ kind: "powerupDrop" });
  }

  if (game.bricksLeft === 0) {
    game.status = "levelClear";
    game.events.push({ kind: "levelClear" });
  }
}

function updatePowerupsFalling(game: GameState): void {
  const remaining: Powerup[] = [];

  for (const powerup of game.powerups) {
    powerup.y += powerup.vy * STEP_SECONDS;

    if (isCaughtByPaddle(game, powerup)) {
      applyPowerup(game, powerup.kind);
      game.events.push({ kind: "powerupCatch" });
      continue;
    }

    if (powerup.y - POWERUP_R <= VIEW_H) remaining.push(powerup);
  }

  game.powerups = remaining;
}

function isCaughtByPaddle(game: GameState, powerup: Powerup): boolean {
  const withinX = Math.abs(powerup.x - game.paddleX) <= game.paddleW / 2 + POWERUP_R;
  const withinY = powerup.y + POWERUP_R >= PADDLE_Y && powerup.y - POWERUP_R <= PADDLE_Y + PADDLE_H;
  return withinX && withinY;
}

function applyPowerup(game: GameState, kind: PowerupKind): void {
  switch (kind) {
    case "wide":
      game.effects.wideSeconds = EFFECT_WIDE_SECONDS;
      break;
    case "slow":
      game.effects.slowSeconds = EFFECT_SLOW_SECONDS;
      break;
    case "sticky":
      game.effects.stickySeconds = EFFECT_STICKY_SECONDS;
      break;
    case "multiball":
      applyMultiball(game);
      break;
    case "life":
      game.lives = Math.min(game.lives + 1, LIVES_CAP);
      break;
  }
}

function applyMultiball(game: GameState): void {
  const source = game.balls.filter((ball) => !ball.stuck);
  for (const ball of source) {
    addRotatedBall(game, ball, MULTIBALL_SPREAD_RAD);
    addRotatedBall(game, ball, -MULTIBALL_SPREAD_RAD);
  }
}

function addRotatedBall(game: GameState, source: Ball, deltaAngle: number): void {
  if (game.balls.length >= MAX_BALLS) return;

  const angle = Math.atan2(source.vx, -source.vy) + deltaAngle;
  game.balls.push({
    x: source.x,
    y: source.y,
    vx: Math.sin(angle) * source.speed,
    vy: -Math.cos(angle) * source.speed,
    speed: source.speed,
    stuck: false,
    stuckOffset: 0,
  });
}

function updateEffects(game: GameState): void {
  const e = game.effects;
  e.wideSeconds = decaySeconds(e.wideSeconds);
  e.slowSeconds = decaySeconds(e.slowSeconds);
  e.stickySeconds = decaySeconds(e.stickySeconds);

  game.paddleW = e.wideSeconds > 0 ? PADDLE_BASE_W * PADDLE_WIDE_MULT : PADDLE_BASE_W;
  game.paddleX = clamp(game.paddleX, game.paddleW / 2, VIEW_W - game.paddleW / 2);
}

function decaySeconds(seconds: number): number {
  return Math.max(0, seconds - STEP_SECONDS);
}

function spawnParticles(game: GameState, x: number, y: number, colorIndex: number): void {
  const count = PARTICLE_MIN_COUNT + Math.floor(Math.random() * (PARTICLE_MAX_COUNT - PARTICLE_MIN_COUNT + 1));

  for (let i = 0; i < count; i += 1) {
    if (game.particles.length >= MAX_PARTICLES) break;

    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 120;
    const life = PARTICLE_MIN_LIFE + Math.random() * (PARTICLE_MAX_LIFE - PARTICLE_MIN_LIFE);
    const size = PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE);

    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - PARTICLE_UPWARD_BIAS,
      life,
      maxLife: life,
      size,
      colorIndex,
    });
  }
}

function updateParticles(game: GameState): void {
  const alive = [];
  for (const particle of game.particles) {
    particle.vy += PARTICLE_GRAVITY * STEP_SECONDS;
    particle.x += particle.vx * STEP_SECONDS;
    particle.y += particle.vy * STEP_SECONDS;
    particle.life -= STEP_SECONDS;
    if (particle.life > 0) alive.push(particle);
  }
  game.particles = alive;
}

function spawnPopup(game: GameState, x: number, y: number, text: string, emphatic: boolean): void {
  game.popups.push({ x, y, life: POPUP_LIFE, maxLife: POPUP_LIFE, text, emphatic });
}

function updatePopups(game: GameState): void {
  const alive = [];
  for (const popup of game.popups) {
    popup.y -= POPUP_RISE_SPEED * STEP_SECONDS;
    popup.life -= STEP_SECONDS;
    if (popup.life > 0) alive.push(popup);
  }
  game.popups = alive;
}

function updateShakeDecay(game: GameState): void {
  game.shake *= SHAKE_DECAY;
  if (game.shake < SHAKE_SNAP) game.shake = 0;
}

function handleBallsBelowField(game: GameState): void {
  const remaining = game.balls.filter((ball) => ball.y - BALL_R <= VIEW_H);
  game.balls = remaining;
  if (remaining.length > 0) return; // other balls still in play, no life lost

  loseLife(game);
}

function loseLife(game: GameState): void {
  game.lives -= 1;
  game.combo = 0;
  game.powerups = [];
  game.effects = freshEffects();
  game.paddleW = PADDLE_BASE_W;
  game.shake = SHAKE_ON_LIFE_LOST;
  game.events.push({ kind: "lifeLost" });

  if (game.lives <= 0) {
    game.lives = 0;
    game.status = "lost";
    game.events.push({ kind: "gameOver" });
    return;
  }

  game.balls = [makeStuckBall(game.paddleX, game.level)];
  game.status = "ready";
}

/** Called by the shell once status is "levelClear" to load the next word. */
export function advanceLevel(game: GameState): void {
  if (game.status !== "levelClear") return;

  game.level += 1;
  game.word = wordForLevel(game.level);
  game.bricks = buildBricks(game.word);
  game.bricksLeft = game.bricks.length;
  game.balls = [makeStuckBall(game.paddleX, game.level)];
  game.powerups = [];
  game.particles = [];
  game.popups = [];
  game.effects = freshEffects();
  game.paddleW = PADDLE_BASE_W;
  game.combo = 0;
  game.shake = 0;
  game.elapsed = 0;
  game.status = "ready";
}

export function readHud(game: GameState): Hud {
  bestScoreEver = Math.max(bestScoreEver, game.score);

  return {
    score: game.score,
    best: bestScoreEver,
    lives: game.lives,
    level: game.level,
    word: game.word,
    combo: game.combo,
    bestCombo: game.bestCombo,
    bricksLeft: game.bricksLeft,
    status: game.status,
    effects: game.effects,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
