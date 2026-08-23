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
import {
  cardById,
  cardForLetter,
  chapterForLevel,
  nextMissCard,
  POWERUP_CARDS,
  type DossierCard,
} from "./dossier";
import { DossierDeck } from "./dossier-deck";
import { SprintReport } from "./sprint-report";
import "./game.css";

const BEST_SCORE_KEY = "arpit-breaker-best";
/**
 * Versioned because v1 stored a bare level count. Card ids are stable strings
 * now, so editing the card list can never relabel a returning player's deck.
 */
const CARDS_KEY = "arpit-breaker-cards-v2";
const LEGACY_UNLOCKED_KEY = "arpit-breaker-unlocked";
/** How long a revealed card sits on screen before the board is clear again. */
const TOAST_SECONDS = 4;
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
  // Unlocked cards persist across restarts: the dossier is a collection to
  // finish, not something a lost run takes away.
  const [unlocked, setUnlocked] = useState<ReadonlySet<string>>(() => new Set<string>());
  const [toast, setToast] = useState<DossierCard | null>(null);

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

    // Unknown ids are dropped so removing a card later cannot corrupt the deck.
    const found = new Set<string>();
    try {
      const raw = window.localStorage.getItem(CARDS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        for (const id of parsed) {
          if (typeof id === "string" && cardById(id)) found.add(id);
        }
      }
      window.localStorage.removeItem(LEGACY_UNLOCKED_KEY);
    } catch {
      // A corrupt or unavailable store just means starting the deck over.
    }

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
    let toastLeft = 0;
    let showingToast = false;
    let deckDirty = true;

    /** Reveals a card, ignoring anything the player has already turned over. */
    const reveal = (card: DossierCard | null) => {
      if (!card || found.has(card.id)) return;
      found.add(card.id);
      deckDirty = true;
      try {
        window.localStorage.setItem(CARDS_KEY, JSON.stringify([...found]));
      } catch {
        // Private-mode storage failures must not interrupt the run.
      }
      setToast(card);
      toastLeft = TOAST_SECONDS;
      showingToast = true;
    };

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

        // All three reveal paths are high-frequency by design. A perfect paddle
        // needs ~150s to clear one wall, so gating the bio on level-clear would
        // teach almost nobody; letters, tiles and misses land constantly.
        if (event.kind === "letterClear" && event.letterIndex !== undefined) {
          reveal(cardForLetter(active.level, event.letterIndex));
        } else if (event.kind === "powerupCatch" && event.powerup) {
          reveal(POWERUP_CARDS[event.powerup]);
        } else if (event.kind === "lifeLost") {
          // The floor: someone who never clears a letter still leaves knowing
          // something, because losing a ball is the one thing they will do.
          reveal(nextMissCard(found));
        }
      }
      active.events.length = 0;

      if (showingToast) {
        toastLeft -= delta;
        if (toastLeft <= 0) {
          showingToast = false;
          setToast(null);
        }
      }

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

      // A fresh Set each time: the deck compares by identity to re-render.
      if (deckDirty) {
        deckDirty = false;
        setUnlocked(new Set(found));
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
  // The sprint report already reports the collection, so a card revealed by the
  // final lost ball would only compete with it.
  const liveToast = hud.status === "lost" ? null : toast;

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

      <div className="game-stage">
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
              <p className="game-overlay-eyebrow">Wall down</p>
              <p className="game-overlay-title">{hud.word}</p>
              <p className="game-reveal">{chapterForLevel(hud.level).era}</p>
            </div>
          ) : null}

          {hud.status === "lost" ? (
            <SprintReport
              score={hud.score}
              bestCombo={hud.bestCombo}
              level={hud.level}
              unlocked={unlocked}
              onRestart={restart}
            />
          ) : null}
        </div>

        {/* Always rendered so the reserved slot never reflows the page when a
            card arrives. Wide screens float it over the board's bottom-right
            corner; narrow ones keep it below, clear of the paddle. */}
        <aside className={`game-toast ${liveToast ? "is-live" : ""}`} role="status">
          {liveToast ? (
            <>
              <p className="game-toast-label">{liveToast.label}</p>
              <p className="game-toast-line">{liveToast.line}</p>
            </>
          ) : null}
        </aside>
      </div>

      <p className="game-era">{chapterForLevel(hud.level).era}</p>

      <p className="game-hint" role="status">
        Arrow keys or drag to steer &middot; space serves &middot; break a whole letter to
        turn over a card
      </p>

      <DossierDeck unlocked={unlocked} />
    </div>
  );
}
