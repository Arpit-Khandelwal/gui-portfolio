"use client";

import Link from "next/link";
import { ALL_CARDS, type DossierCard } from "./dossier";

interface DossierDeckProps {
  readonly unlocked: ReadonlySet<string>;
}

/**
 * The collection. Locked cards stay hatched and unnamed so the deck reads as
 * something to finish; unlocked ones become real links out to the work.
 */
export function DossierDeck({ unlocked }: DossierDeckProps) {
  const total = ALL_CARDS.length;
  const found = ALL_CARDS.filter((card) => unlocked.has(card.id)).length;

  return (
    <section className="game-deck" aria-label="Cards unlocked by playing">
      <header className="game-deck-head">
        <h2 className="game-deck-title">Dossier</h2>
        <p className="game-deck-count">
          <strong>{found}</strong> of {total} cards
        </p>
        <p className="game-deck-note">
          Clear a letter or catch a tile to turn one over.
        </p>
      </header>

      <ul className="game-deck-grid">
        {ALL_CARDS.map((card) => (
          <li key={card.id}>
            {unlocked.has(card.id) ? <FoundCard card={card} /> : <LockedCard />}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FoundCard({ card }: { readonly card: DossierCard }) {
  const body = (
    <>
      <span className="game-card-label">{card.label}</span>
      <span className="game-card-line">{card.line}</span>
      {card.href ? <span className="game-card-go" aria-hidden="true">&rarr;</span> : null}
    </>
  );

  if (!card.href) {
    return <article className="game-card is-found">{body}</article>;
  }

  // Internal anchors go through next/link; everything else opens in a new tab
  // so a player mid-run never loses the board.
  return card.href.startsWith("/") ? (
    <Link href={card.href} className="game-card is-found is-link">
      {body}
    </Link>
  ) : (
    <a
      href={card.href}
      target="_blank"
      rel="noreferrer"
      className="game-card is-found is-link"
    >
      {body}
    </a>
  );
}

function LockedCard() {
  return (
    <article className="game-card is-locked" aria-label="Locked card">
      <span className="game-card-lock" aria-hidden="true">
        ?
      </span>
    </article>
  );
}
