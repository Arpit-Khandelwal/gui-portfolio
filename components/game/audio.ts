/**
 * Tiny synthesised WebAudio blip player for the brick-breaker. No audio
 * files, no libraries — every sound is a short oscillator + gain envelope.
 *
 * Muted by default (browsers block autoplay before a gesture anyway, and
 * this plays on a portfolio site). The mute choice persists in
 * localStorage. The AudioContext is only ever constructed lazily, on the
 * first `play()` call, so importing this module is always SSR-safe.
 */

/** Mirrors the subset of `GameEventKind` (see ./types.ts) that gets sound. */
export type SoundName =
  | "paddle"
  | "wall"
  | "brick"
  | "powerupDrop"
  | "powerupCatch"
  | "lifeLost"
  | "levelClear"
  | "gameOver";

export interface GameAudio {
  play(name: SoundName, combo?: number): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  dispose(): void;
}

const MUTE_STORAGE_KEY = "arpit-breaker-muted";
/** Caps overall loudness; individual envelope gains are multiplied by this. */
const MASTER_GAIN = 0.16;
/** "brick" pitch rises with combo depth, capped so it never screeches. */
const MAX_COMBO_SEMITONES = 24;
const SEMITONE_RATIO = Math.pow(2, 1 / 12);
const BRICK_BASE_FREQUENCY = 440;

interface BlipEnvelope {
  readonly frequency: number;
  /** If set, the oscillator's frequency sweeps to this value over `duration`. */
  readonly sweepTo?: number;
  readonly duration: number;
  readonly type: OscillatorType;
  /** Peak gain before the MASTER_GAIN multiplier, roughly 0..1. */
  readonly gain: number;
  /** Seconds to wait before this note starts, for tiny arpeggios. */
  readonly delay?: number;
}

function readStoredMuted(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const stored = window.localStorage.getItem(MUTE_STORAGE_KEY);
    // No stored preference yet: default to muted.
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

function writeStoredMuted(muted: boolean): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
  } catch {
    // Private browsing / quota exceeded: nothing we can do, and nothing
    // worth surfacing to the player.
  }
}

function resolveAudioContextConstructor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;

  const withWebkit = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };

  return withWebkit.AudioContext ?? withWebkit.webkitAudioContext ?? null;
}

function comboEnvelope(combo: number): BlipEnvelope {
  const semitones = Math.min(Math.max(combo, 0), MAX_COMBO_SEMITONES);
  const frequency = BRICK_BASE_FREQUENCY * Math.pow(SEMITONE_RATIO, semitones);
  return { frequency, duration: 0.09, type: "triangle", gain: 0.5 };
}

const SOUND_ENVELOPES: Readonly<Record<Exclude<SoundName, "brick">, readonly BlipEnvelope[]>> = {
  paddle: [{ frequency: 210, duration: 0.045, type: "sine", gain: 0.14 }],
  wall: [{ frequency: 300, duration: 0.04, type: "sine", gain: 0.11 }],
  powerupDrop: [{ frequency: 520, duration: 0.08, type: "sine", gain: 0.28 }],
  powerupCatch: [
    { frequency: 880, duration: 0.09, type: "sine", gain: 0.5 },
    { frequency: 1318.5, duration: 0.09, type: "sine", gain: 0.42, delay: 0.05 },
  ],
  lifeLost: [{ frequency: 95, duration: 0.16, type: "square", gain: 0.55 }],
  levelClear: [
    { frequency: 523.25, duration: 0.11, type: "triangle", gain: 0.48 },
    { frequency: 659.25, duration: 0.11, type: "triangle", gain: 0.48, delay: 0.09 },
    { frequency: 783.99, duration: 0.12, type: "triangle", gain: 0.52, delay: 0.18 },
  ],
  gameOver: [{ frequency: 320, sweepTo: 110, duration: 0.22, type: "sawtooth", gain: 0.45 }],
};

/**
 * Creates a `GameAudio` instance. Never throws even if WebAudio is
 * unavailable — construction failures silently degrade to a no-op player.
 */
export function createAudio(): GameAudio {
  let muted = readStoredMuted();
  let context: AudioContext | null = null;
  let disposed = false;

  function ensureContext(): AudioContext | null {
    if (disposed) return null;
    if (context) return context;

    try {
      const Ctor = resolveAudioContextConstructor();
      if (!Ctor) return null;
      context = new Ctor();
      return context;
    } catch {
      return null;
    }
  }

  function scheduleBlip(envelope: BlipEnvelope): void {
    const audioCtx = ensureContext();
    if (!audioCtx) return;

    try {
      if (audioCtx.state === "suspended") {
        void audioCtx.resume().catch(() => {});
      }

      const startAt = audioCtx.currentTime + (envelope.delay ?? 0);
      const stopAt = startAt + envelope.duration;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = envelope.type;
      oscillator.frequency.setValueAtTime(envelope.frequency, startAt);
      if (envelope.sweepTo !== undefined) {
        oscillator.frequency.exponentialRampToValueAtTime(envelope.sweepTo, stopAt);
      }

      const peakGain = envelope.gain * MASTER_GAIN;
      gainNode.gain.setValueAtTime(0.0001, startAt);
      gainNode.gain.linearRampToValueAtTime(peakGain, startAt + 0.008);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopAt);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(startAt);
      oscillator.stop(stopAt + 0.02);
    } catch {
      // Scheduling can fail if the context was closed mid-flight; a missed
      // blip is never worth surfacing.
    }
  }

  function play(name: SoundName, combo?: number): void {
    if (muted) return;

    const envelopes = name === "brick" ? [comboEnvelope(combo ?? 0)] : SOUND_ENVELOPES[name];
    for (const envelope of envelopes) {
      scheduleBlip(envelope);
    }
  }

  function setMuted(next: boolean): void {
    muted = next;
    writeStoredMuted(next);
  }

  function isMuted(): boolean {
    return muted;
  }

  function dispose(): void {
    disposed = true;
    if (context) {
      void context.close().catch(() => {});
      context = null;
    }
  }

  return { play, setMuted, isMuted, dispose };
}
