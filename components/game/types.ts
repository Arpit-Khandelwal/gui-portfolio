/**
 * Shared contract for the brick-breaker. The engine owns and mutates this
 * state, the renderer only reads it, and the React shell only reads `hud` and
 * drains `events`.
 */

export type GameStatus = "ready" | "playing" | "levelClear" | "lost";

export type PowerupKind = "multiball" | "wide" | "sticky" | "slow" | "life";

/** Emitted by the engine each tick, drained by the shell to drive audio. */
export type GameEventKind =
  | "paddle"
  | "wall"
  | "brick"
  | "powerupDrop"
  | "powerupCatch"
  | "lifeLost"
  | "levelClear"
  | "gameOver";

export interface GameEvent {
  readonly kind: GameEventKind;
  /** Combo depth for "brick" events, so audio can rise in pitch with a streak. */
  readonly combo?: number;
}

export interface Brick {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Index into the theme's block palette. */
  readonly colorIndex: number;
  /** Index into the theme's texture set. */
  readonly textureIndex: number;
  readonly row: number;
  readonly points: number;
  /** Carries a powerup that drops when this brick breaks. */
  readonly powerup: PowerupKind | null;
  alive: boolean;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  /** Held on the paddle until served (initial serve, or caught by sticky). */
  stuck: boolean;
  /** Offset from paddle centre while stuck. */
  stuckOffset: number;
}

export interface Powerup {
  x: number;
  y: number;
  vy: number;
  readonly kind: PowerupKind;
  readonly colorIndex: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Seconds remaining; the renderer fades on life / maxLife. */
  life: number;
  readonly maxLife: number;
  readonly size: number;
  readonly colorIndex: number;
}

export interface ScorePopup {
  x: number;
  y: number;
  life: number;
  readonly maxLife: number;
  readonly text: string;
  readonly emphatic: boolean;
}

/** Timed paddle/ball modifiers. Zero means inactive. */
export interface Effects {
  wideSeconds: number;
  slowSeconds: number;
  stickySeconds: number;
}

export interface Hud {
  readonly score: number;
  readonly best: number;
  readonly lives: number;
  readonly level: number;
  readonly word: string;
  readonly combo: number;
  readonly bestCombo: number;
  readonly bricksLeft: number;
  readonly status: GameStatus;
  readonly effects: Readonly<Effects>;
}

export interface GameState {
  status: GameStatus;
  level: number;
  word: string;
  bricks: Brick[];
  bricksLeft: number;
  balls: Ball[];
  powerups: Powerup[];
  particles: Particle[];
  popups: ScorePopup[];
  effects: Effects;
  paddleX: number;
  paddleW: number;
  /** -1, 0 or 1 from the arrow keys. Pointer input sets paddleX directly. */
  keyDirection: number;
  score: number;
  lives: number;
  /** Bricks broken since the ball last touched the paddle. Drives the multiplier. */
  combo: number;
  bestCombo: number;
  /** Decays each tick; the renderer offsets the board by this much. */
  shake: number;
  /** Seconds since the level loaded, used for intro animation. */
  elapsed: number;
  /** Drained by the shell every frame. */
  events: GameEvent[];
}
