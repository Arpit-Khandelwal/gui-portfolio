"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  advanceLevel,
  createGame,
  launchBall,
  LIVES_START,
  MAX_FRAME_SECONDS,
  movePaddleTo,
  readHud,
  stepGame,
  STEP_SECONDS,
  VIEW_H,
  VIEW_W,
} from "./engine";
import { drawGame } from "./renderer";
import { createAudio, GameAudio } from "./audio";
import type { GameState, Hud } from "./types";
import { factForLevel, LEVELS } from "./word-bricks";
import "./game.css";

const BEST_SCORE_KEY = "arpit-breaker-best";
const UNLOCKED_KEY = "arpit-breaker-unlocked";
/** How long the level-clear banner sits before the next word loads. */
const LEVEL_CLEAR_SECONDS = 1.5;
/** Bricks per multiplier step; mirrors COMBO_MULTIPLIER_STEP in the engine. */
const COMBO_STEP = 4;

const EFFECT_LABELS: ReadonlyArray<{ key: "wideSeconds" | "stickySeconds" | "slowSeconds"; label: string }> = [
  { key: "wideSeconds", label: "Wide" },
  { key: "stickySeconds", label: "Sticky" },
  { key: "slowSeconds", label: "Slow" },
];

function sameHud(a: Hud, b: Hud): boolean {
  return (
    a.score === b.score &&
    a.best === b.best &&
    a.lives === b.lives &&
    a.level === b.level &&
    a.word === b.word &&
    a.combo === b.combo &&
    a.bestCombo === b.bestCombo &&
    a.bricksLeft === b.bricksLeft &&
    a.status === b.status &&
    // Rounded so a ticking effect timer re-renders about once a second.
    Math.ceil(a.effects.wideSeconds) === Math.ceil(b.effects.wideSeconds) &&
    Math.ceil(a.effects.slowSeconds) === Math.ceil(b.effects.slowSeconds) &&
    Math.ceil(a.effects.stickySeconds) === Math.ceil(b.effects.stickySeconds)
  );
}

export function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const audioRef = useRef<GameAudio | null>(null);
  const bestRef = useRef(0);

  const [hud, setHud] = useState<Hud>(() => readHud(createGame()));
  const [muted, setMuted] = useState(true);
  // Unlocked facts persist across restarts: the dossier is a collection to
  // finish, not something a lost run takes away.
  const [unlockedCount, setUnlockedCount] = useState(0);
  const unlockedRef = useRef(0);

  const restart = useCallback(() => {
    const fresh = createGame();
    gameRef.current = fresh;
    setHud({ ...readHud(fresh), best: bestRef.current });
    canvasRef.current?.focus();
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((previous) => {
      const next = !previous;
      audioRef.current?.setMuted(next);
      return next;
    });
    canvasRef.current?.focus();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const game = createGame();
    gameRef.current = game;

    const audio = createAudio();
    audioRef.current = audio;

    const storedBest = Number(window.localStorage.getItem(BEST_SCORE_KEY));
    bestRef.current = Number.isFinite(storedBest) && storedBest > 0 ? storedBest : 0;

    const storedUnlocked = Number(window.localStorage.getItem(UNLOCKED_KEY));
    unlockedRef.current =
      Number.isFinite(storedUnlocked) && storedUnlocked > 0
        ? Math.min(storedUnlocked, LEVELS.length)
        : 0;

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
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const toViewportX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * VIEW_W;
    };

    // Every handler reads gameRef rather than closing over `game`, so input
    // keeps driving the current board after a restart swaps in a fresh one.
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
    let clearHold = 0;
    let lastHud = readHud(game);
    // Synced from the loop rather than the effect body: the persisted mute
    // choice only exists on the client, and setState in an effect body would
    // both trip react-hooks/set-state-in-effect and risk a hydration mismatch.
    let lastMuted = true;
    let lastUnlocked = 0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);

      const active = gameRef.current;
      if (!active) return;

      // Fixed timestep: the simulation is identical on a 60Hz and a 120Hz
      // display, and a backgrounded tab cannot fast-forward the ball.
      const delta = Math.min((now - previous) / 1000, MAX_FRAME_SECONDS);
      previous = now;
      accumulator += delta;

      while (accumulator >= STEP_SECONDS) {
        stepGame(active);
        accumulator -= STEP_SECONDS;
      }

      for (const event of active.events) {
        audio.play(event.kind, event.combo);
      }
      active.events.length = 0;

      if (active.status === "levelClear") {
        clearHold += delta;
        if (clearHold >= LEVEL_CLEAR_SECONDS) {
          clearHold = 0;
          advanceLevel(active);
        }
      } else {
        clearHold = 0;
      }

      if (active.score > bestRef.current) {
        bestRef.current = active.score;
        window.localStorage.setItem(BEST_SCORE_KEY, String(active.score));
      }

      drawGame(ctx, active);

      const next = { ...readHud(active), best: bestRef.current };
      if (!sameHud(next, lastHud)) {
        lastHud = next;
        setHud(next);
      }

      if (audio.isMuted() !== lastMuted) {
        lastMuted = audio.isMuted();
        setMuted(lastMuted);
      }

      // The clearing level counts as unlocked while its banner is showing.
      const reached = active.status === "levelClear" ? active.level + 1 : active.level;
      const capped = Math.min(reached, LEVELS.length);
      if (capped > unlockedRef.current) {
        unlockedRef.current = capped;
        window.localStorage.setItem(UNLOCKED_KEY, String(capped));
      }
      if (unlockedRef.current !== lastUnlocked) {
        lastUnlocked = unlockedRef.current;
        setUnlockedCount(lastUnlocked);
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
      audio.dispose();
      audioRef.current = null;
      gameRef.current = null;
    };
  }, []);

  const activeEffects = EFFECT_LABELS.filter((effect) => hud.effects[effect.key] > 0);

  return (
    <div className="game-shell">
      <div className="game-hud">
        <dl className="game-stats">
          <div>
            <dt>Score</dt>
            <dd>{String(hud.score).padStart(5, "0")}</dd>
          </div>
          <div>
            <dt>Best</dt>
            <dd>{String(hud.best).padStart(5, "0")}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{hud.word}</dd>
          </div>
          <div>
            <dt>Balls</dt>
            <dd className="game-lives" aria-label={`${hud.lives} of ${LIVES_START} remaining`}>
              {"■".repeat(hud.lives)}
              <span className="game-life-spent">
                {"■".repeat(Math.max(0, LIVES_START - hud.lives))}
              </span>
            </dd>
          </div>
        </dl>

        <div className="game-chips">
          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={!muted}
            className={`game-chip ${muted ? "" : "game-chip-active"}`}
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
          <button type="button" onClick={restart} className="game-chip">
            Restart
          </button>
        </div>
      </div>

      <div className="game-board">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-label={`Brick breaker. The wall spells ${hud.word}. Move the paddle with the arrow keys and serve with space.`}
          className="game-canvas"
        />

        {/* The combo tag is drawn on the canvas by the renderer; a DOM copy
            would duplicate it. This one is visually hidden purely so screen
            readers still hear the streak. */}
        {hud.combo >= COMBO_STEP ? (
          <p className="game-combo" role="status">
            Combo &times;{1 + Math.floor(hud.combo / COMBO_STEP)}
          </p>
        ) : null}

        {activeEffects.length > 0 ? (
          <ul className="game-effects">
            {activeEffects.map((effect) => (
              <li key={effect.key} className="game-effect">
                {effect.label} {Math.ceil(hud.effects[effect.key])}s
              </li>
            ))}
          </ul>
        ) : null}

        {hud.status === "levelClear" ? (
          <div className="game-overlay">
            <p className="game-overlay-title">{hud.word} cleared</p>
            {factForLevel(hud.level) ? (
              <p className="game-reveal">{factForLevel(hud.level)}</p>
            ) : (
              <p className="game-overlay-score">Next wall loading</p>
            )}
          </div>
        ) : null}

        {hud.status === "lost" ? (
          <div className="game-overlay">
            <p className="game-overlay-title">Game over</p>
            <p className="game-overlay-score">
              {hud.score} points &middot; level {hud.level + 1} &middot; best combo {hud.bestCombo}
            </p>
            <button type="button" onClick={restart} className="game-overlay-button">
              Play again
            </button>
          </div>
        ) : null}
      </div>

      <p className="game-hint" role="status">
        Arrow keys or drag to steer &middot; space serves &middot; catch the falling tiles
      </p>

      {/* Each cleared wall unlocks the line behind it, so a run reads as a bio. */}
      <section className="game-dossier" aria-label="Unlocked by playing">
        <p className="game-dossier-head">
          Dossier &mdash; {unlockedCount} of {LEVELS.length} unlocked
        </p>
        <ol className="game-dossier-list">
          {LEVELS.map((level, index) => (
            <li
              key={level.word}
              className={`game-dossier-item ${index < unlockedCount ? "is-unlocked" : ""}`}
            >
              <span className="game-dossier-word">{level.word}</span>
              <span className="game-dossier-fact">
                {index < unlockedCount ? level.fact : "Clear this wall to unlock."}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
