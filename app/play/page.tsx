import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrickBreaker } from "@/components/game/brick-breaker";
import { blockColor, type StampGlyph } from "@/components/game/theme";

export const metadata: Metadata = {
  title: "Play | Arpit Khandelwal",
  description:
    "A browser brick-breaker where every wall is a chapter of my CV. Break a letter, catch a tile or lose a ball and it turns over one of 42 cards. Canvas, no dependencies.",
  alternates: { canonical: "/play" },
  openGraph: {
    type: "website",
    url: "/play",
    title: "Play | Arpit Khandelwal",
    description:
      "A brick-breaker that hands you my CV one card at a time. Break a letter, catch a tile, collect all 42.",
  },
};

interface PowerupEntry {
  readonly name: string;
  readonly description: string;
  readonly colorIndex: number;
  readonly glyph: StampGlyph;
}

const GLYPH_CHARACTERS: Readonly<Record<StampGlyph, string>> = {
  x: "×",
  plus: "+",
  slash: "/",
};

/** Names match the cards each tile turns over, so the legend and the toast agree. */
const POWERUPS: readonly PowerupEntry[] = [
  {
    name: "Agents · multiball",
    description: "Splits your ball into three, fanned out at the same speed.",
    colorIndex: 0,
    glyph: "x",
  },
  {
    name: "API surface · wide",
    description: "Paddle grows wider for a few seconds.",
    colorIndex: 2,
    glyph: "plus",
  },
  {
    name: "MCP · sticky",
    description: "Catch the ball on the paddle and re-aim before you serve.",
    colorIndex: 4,
    glyph: "slash",
  },
  {
    name: "Week 0 · slow-mo",
    description: "Every ball in play drops to a crawl for a few seconds.",
    colorIndex: 6,
    glyph: "x",
  },
  {
    name: "Handoff · extra life",
    description: "One more ball banked for later.",
    colorIndex: 5,
    glyph: "plus",
  },
];

export default function PlayPage() {
  return (
    <div className="epoch-shell min-h-screen">
      <main className="mx-auto flex w-full max-w-[42rem] flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <Link href="/" className="epoch-back">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the portfolio
        </Link>

        <header className="flex flex-col gap-2">
          <p className="epoch-kicker">Coffee break</p>
          <h1 className="epoch-title">Break the wall, read the CV.</h1>
          <p className="epoch-lede">
            Each wall is a chapter &mdash; who I am, where I have worked, what I am building now.
            Break a whole letter and it hands you a card. So does catching a tile, and so does
            losing a ball. There are 42 to find, and they keep what you have already turned over.
          </p>
        </header>

        <BrickBreaker />

        <hr className="epoch-rule" />

        <section aria-labelledby="powerup-legend-heading" className="flex flex-col gap-3">
          <h2 id="powerup-legend-heading" className="epoch-kicker">
            Powerups
          </h2>
          <ul className="powerup-legend">
            {POWERUPS.map((powerup) => {
              const swatchStyle: CSSProperties & { "--legend-color"?: string } = {
                "--legend-color": blockColor(powerup.colorIndex),
              };

              return (
                <li key={powerup.name} className="powerup-legend-item">
                  <span
                    className="powerup-legend-glyph"
                    style={swatchStyle}
                    aria-hidden="true"
                  >
                    {GLYPH_CHARACTERS[powerup.glyph]}
                  </span>
                  <span className="powerup-legend-body">
                    <p className="powerup-legend-name">{powerup.name}</p>
                    <p className="powerup-legend-desc">{powerup.description}</p>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
