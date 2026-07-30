"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  createGame,
  GameState,
  GameStatus,
  LIVES_START,
  launchBall,
  MAX_FRAME_SECONDS,
  movePaddleTo,
  stepGame,
  STEP_SECONDS,
  VIEW_H,
  VIEW_W,
} from "./engine";
import { drawGame, Palette, readPalette } from "./renderer";
import { countBricks, WORD } from "./word-bricks";
import "./game.css";

const BEST_SCORE_KEY = "arpit-breaker-best";

interface Hud {
  readonly score: number;
  readonly best: number;
  readonly lives: number;
  readonly status: GameStatus;
  readonly bricksLeft: number;
}

const TOTAL_BRICKS = countBricks();

const INITIAL_HUD: Hud = {
  score: 0,
  best: 0,
  lives: LIVES_START,
  status: "ready",
  bricksLeft: TOTAL_BRICKS,
};

const STATUS_MESSAGE: Readonly<Record<GameStatus, string>> = {
  ready: "Click or tap the board, then press space to serve.",
  playing: "Steer with the arrow keys, your pointer, or a finger.",
  won: `Cleared. You knocked out every brick in ${WORD}.`,
  lost: "Out of balls. Reset to line them up again.",
};

export function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const [hud, setHud] = useState<Hud>(INITIAL_HUD);
  // Kept in a ref so the animation loop can read and persist it without the
  // loop depending on render state.
  const bestRef = useRef(0);

  const resetGame = useCallback(() => {
    gameRef.current = createGame();
    setHud((previous) => ({ ...INITIAL_HUD, best: previous.best }));
    canvasRef.current?.focus();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const game = createGame();
    gameRef.current = game;

    const storedBest = Number(window.localStorage.getItem(BEST_SCORE_KEY));
    bestRef.current = Number.isFinite(storedBest) && storedBest > 0 ? storedBest : 0;

    let palette: Palette = readPalette(canvas);

    const resize = () => {
      const cssWidth = canvas.clientWidth;
      if (cssWidth === 0) return;

      const cssHeight = (cssWidth * VIEW_H) / VIEW_W;
      const dpr = window.devicePixelRatio || 1;

      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      // Draw in logical viewport units; the transform absorbs both the CSS
      // scale and the device pixel ratio, so nothing is blurry on retina.
      ctx.setTransform(canvas.width / VIEW_W, 0, 0, canvas.height / VIEW_H, 0, 0);
      palette = readPalette(canvas);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const toViewportX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * VIEW_W;
    };

    // Every handler reads gameRef rather than closing over `game`, so input
    // keeps driving the current board after Reset swaps in a fresh one.
    const onPointerDown = (event: PointerEvent) => {
      const active = gameRef.current;
      if (!active) return;
      canvas.focus();
      movePaddleTo(active, toViewportX(event.clientX));
      launchBall(active);
    };

    const onPointerMove = (event: PointerEvent) => {
      const active = gameRef.current;
      if (!active) return;
      // A finger dragging the paddle must not scroll the page underneath it.
      if (event.pointerType !== "mouse") {
        event.preventDefault();
      }
      movePaddleTo(active, toViewportX(event.clientX));
    };

    // Key handlers live on the canvas, not the window, so arrow keys only stop
    // scrolling the page while the board actually has focus.
    const onKeyDown = (event: KeyboardEvent) => {
      const active = gameRef.current;
      if (!active) return;

      if (event.key === "ArrowLeft") {
        active.keyDirection = -1;
      } else if (event.key === "ArrowRight") {
        active.keyDirection = 1;
      } else if (event.key === " " || event.key === "Enter") {
        launchBall(active);
      } else {
        return;
      }
      event.preventDefault();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const active = gameRef.current;
      if (!active) return;

      const releasedLeft = event.key === "ArrowLeft" && active.keyDirection === -1;
      const releasedRight = event.key === "ArrowRight" && active.keyDirection === 1;
      if (releasedLeft || releasedRight) {
        active.keyDirection = 0;
      }
    };

    const onBlur = () => {
      if (gameRef.current) gameRef.current.keyDirection = 0;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("blur", onBlur);

    let frame = 0;
    let previous = performance.now();
    let accumulator = 0;
    let lastHud: Hud = INITIAL_HUD;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);

      const active = gameRef.current;
      if (!active) return;

      // Fixed timestep: the simulation is identical on a 60Hz and a 120Hz
      // display, and a backgrounded tab can't fast-forward the ball.
      accumulator += Math.min((now - previous) / 1000, MAX_FRAME_SECONDS);
      previous = now;

      while (accumulator >= STEP_SECONDS) {
        stepGame(active);
        accumulator -= STEP_SECONDS;
      }

      drawGame(ctx, active, palette);

      if (active.score > bestRef.current) {
        bestRef.current = active.score;
        window.localStorage.setItem(BEST_SCORE_KEY, String(active.score));
      }

      const changed =
        active.score !== lastHud.score ||
        active.lives !== lastHud.lives ||
        active.status !== lastHud.status ||
        active.bricksLeft !== lastHud.bricksLeft ||
        bestRef.current !== lastHud.best;

      if (changed) {
        lastHud = {
          score: active.score,
          best: bestRef.current,
          lives: active.lives,
          status: active.status,
          bricksLeft: active.bricksLeft,
        };
        setHud(lastHud);
      }
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("blur", onBlur);
      gameRef.current = null;
    };
  }, []);

  const isOver = hud.status === "won" || hud.status === "lost";

  return (
    <div className="game-shell">
      <div className="game-hud">
        <dl className="game-stats">
          <div>
            <dt>Score</dt>
            <dd>{String(hud.score).padStart(4, "0")}</dd>
          </div>
          <div>
            <dt>Best</dt>
            <dd>{String(hud.best).padStart(4, "0")}</dd>
          </div>
          <div>
            <dt>Balls</dt>
            <dd aria-label={`${hud.lives} of ${LIVES_START} remaining`}>
              {"●".repeat(hud.lives)}
              <span className="game-life-spent">{"●".repeat(LIVES_START - hud.lives)}</span>
            </dd>
          </div>
          <div>
            <dt>Bricks</dt>
            <dd>{hud.bricksLeft}</dd>
          </div>
        </dl>

        <button type="button" onClick={resetGame} className="game-reset">
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="game-board">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-label={`Brick breaker. The bricks spell ${WORD}. Move the paddle with the arrow keys and serve with space.`}
          className="game-canvas"
        />

        {isOver ? (
          <div className="game-overlay">
            <p className="game-overlay-title">{hud.status === "won" ? "Board cleared" : "Game over"}</p>
            <p className="game-overlay-score">{hud.score} points</p>
            <button type="button" onClick={resetGame} className="primary-button game-overlay-button">
              Play again
            </button>
          </div>
        ) : null}
      </div>

      <p className="game-hint" role="status">
        {STATUS_MESSAGE[hud.status]}
      </p>
    </div>
  );
}
