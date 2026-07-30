"use client";

import Link from "next/link";
import { ALL_CARDS, chapterForLevel } from "./dossier";

interface SprintReportProps {
  readonly score: number;
  readonly bestCombo: number;
  readonly level: number;
  readonly unlocked: ReadonlySet<string>;
  readonly onRestart: () => void;
}

/**
 * Shown on game over. This is the most-seen screen in the game, so it reports
 * the collection rather than just the score — what you learned, what is still
 * locked, and the one action worth taking next.
 */
export function SprintReport({
  score,
  bestCombo,
  level,
  unlocked,
  onRestart,
}: SprintReportProps) {
  const total = ALL_CARDS.length;
  const found = ALL_CARDS.filter((card) => unlocked.has(card.id)).length;
  const locked = total - found;

  return (
    <div className="game-overlay">
      <p className="game-overlay-eyebrow">Sprint report</p>
      <p className="game-overlay-title">
        {found} of {total} cards
      </p>

      <dl className="game-report-stats">
        <div>
          <dt>Score</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>Best combo</dt>
          <dd>&times;{bestCombo}</dd>
        </div>
        <div>
          <dt>Reached</dt>
          <dd>{chapterForLevel(level).word}</dd>
        </div>
      </dl>

      <p className="game-overlay-score">
        {locked > 0
          ? `${locked} still locked behind the wall.`
          : "Whole dossier open. Now come build something."}
      </p>

      <div className="game-overlay-actions">
        <button type="button" onClick={onRestart} className="game-overlay-button">
          Play again
        </button>
        <Link href="/#contact" className="game-overlay-button is-primary">
          Start a sprint &rarr;
        </Link>
      </div>
    </div>
  );
}
