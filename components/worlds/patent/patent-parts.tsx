"use client";

import { track } from "@/lib/analytics";
import { numeral } from "./patent-figure";

interface PartsLegendProps {
  fig: number;
  parts: readonly string[];
  caseTitle: string;
  active: number | null;
  onPart: (value: number | null) => void;
}

/**
 * The text side of a figure: each part with its reference numeral. Hovering
 * or focusing a numeral lights the same part in the drawing, and the drawing
 * lights the numeral back, so the description and the figure read as one.
 */
export function PartsLegend({ fig, parts, caseTitle, active, onPart }: PartsLegendProps) {
  return (
    <ol className="pp-legend" aria-label={`Parts of Fig. ${fig}`}>
      {parts.slice(0, 5).map((part, index) => {
        const n = numeral(fig, index);
        return (
          <li key={part}>
            <button
              type="button"
              className={`pp-num${active === n ? " is-lit" : ""}`}
              aria-pressed={active === n}
              onMouseEnter={() => onPart(n)}
              onMouseLeave={() => onPart(null)}
              onFocus={() => {
                onPart(n);
                track("figure_part_focus", { part: `${caseTitle}: ${n} ${part}` });
              }}
              onBlur={() => onPart(null)}
            >
              {n}
            </button>
            <span>{part}</span>
          </li>
        );
      })}
    </ol>
  );
}

interface InlinePartsProps {
  fig: number;
  lead: string;
  parts: readonly string[];
  caseTitle: string;
  active: number | null;
  onPart: (value: number | null) => void;
}

/** Names that keep their capital in running text. */
const PROPER_NOUNS: ReadonlySet<string> = new Set([
  "Playwright", "Solana", "Postgres", "Helius", "Arcium", "Prisma", "Prava", "Visa", "Jev",
  "Telegram", "Google", "Express", "MongoDB", "Next.js", "LinkedIn", "Ethereum", "Five",
]);

/** "Closed consumer app" → "closed consumer app"; acronyms and names (MCP, Playwright) stay. */
function inSentence(label: string): string {
  const first = label.split(" ")[0];
  if (PROPER_NOUNS.has(first) || !/^[A-Z][a-z]/.test(label)) return label;
  return label.charAt(0).toLowerCase() + label.slice(1);
}

/** The same numerals, set in running text: "an MCP server 104, …". */
export function InlineParts({ fig, lead, parts, caseTitle, active, onPart }: InlinePartsProps) {
  const shown = parts.slice(0, 5);
  return (
    <p className="pp-inline">
      {lead}{" "}
      {shown.map((part, index) => {
        const n = numeral(fig, index);
        const joiner = index === shown.length - 1 ? "." : index === shown.length - 2 ? " and " : ", ";
        return (
          <span key={part}>
            {inSentence(part)}{" "}
            <button
              type="button"
              className={`pp-num${active === n ? " is-lit" : ""}`}
              aria-pressed={active === n}
              aria-label={`${n}, ${part}`}
              onMouseEnter={() => onPart(n)}
              onMouseLeave={() => onPart(null)}
              onFocus={() => {
                onPart(n);
                track("figure_part_focus", { part: `${caseTitle}: ${n} ${part}` });
              }}
              onBlur={() => onPart(null)}
            >
              {n}
            </button>
            {joiner}
          </span>
        );
      })}
    </p>
  );
}
