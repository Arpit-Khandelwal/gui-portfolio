"use client";

import type { ReactNode } from "react";
import { PatentDiagram } from "./patent-diagram";
import { DIAGRAMS } from "./patent-diagrams";

/**
 * Patent-style line drawings. A build with a hand-authored diagram in
 * `patent-diagrams.ts` draws that; anything else falls back to a figure
 * generated from the case study's `parts` list.
 * Each part becomes a drawn element with a reference numeral on a leader
 * line; the shape follows what the part is (a store is a cylinder, an app is a
 * handset, a browser is a window), so every figure is specific to its build.
 */

export type PartShape = "store" | "handset" | "window" | "model" | "chain" | "box";

export function shapeFor(label: string): PartShape {
  const text = label.toLowerCase();
  if (/(postgres|database|db\b|store|index|ledger|sql|mongo|table)/.test(text)) return "store";
  if (/(app|phone|mobile|wallet|extension|client|user)/.test(text)) return "handset";
  if (/(browser|playwright|session|page|web|ui|feed)/.test(text)) return "window";
  if (/(llm|model|agent|concierge|ai\b|jev|judge)/.test(text)) return "model";
  if (/(solana|chain|program|arcium|zk|proof|mpc|x402|payment|visa|mandate)/.test(text)) return "chain";
  return "box";
}

/** Reference numeral for part `index` of figure `fig`: FIG. 3 → 302, 304, … */
export function numeral(fig: number, index: number): number {
  return fig * 100 + (index + 1) * 2;
}

interface ShapeProps {
  x: number;
  y: number;
  w: number;
  h: number;
  shape: PartShape;
}

function Shape({ x, y, w, h, shape }: ShapeProps): ReactNode {
  switch (shape) {
    case "store": {
      const ry = Math.min(14, h * 0.14);
      return (
        <g>
          <path d={`M${x} ${y + ry}V${y + h - ry}M${x + w} ${y + ry}V${y + h - ry}`} />
          <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} />
          <path d={`M${x} ${y + h - ry}a${w / 2} ${ry} 0 0 0 ${w} 0`} />
          <path d={`M${x} ${y + h / 2}a${w / 2} ${ry} 0 0 0 ${w} 0`} className="pf-thin" />
        </g>
      );
    }
    case "handset": {
      const hw = Math.min(w, h * 0.55);
      const hx = x + (w - hw) / 2;
      return (
        <g>
          <rect x={hx} y={y} width={hw} height={h} rx={14} />
          <rect x={hx + 9} y={y + 18} width={hw - 18} height={h - 46} className="pf-thin" />
          <circle cx={hx + hw / 2} cy={y + h - 14} r={5} />
        </g>
      );
    }
    case "window":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          <path d={`M${x} ${y + 20}H${x + w}`} />
          <circle cx={x + 12} cy={y + 10} r={3.5} />
          <circle cx={x + 24} cy={y + 10} r={3.5} />
          <rect x={x + 14} y={y + 34} width={w - 28} height={h - 48} className="pf-dash" />
        </g>
      );
    case "model":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          {[0.3, 0.5, 0.7].map((t) => (
            <path key={t} d={`M${x + 14} ${y + h * t}H${x + w - 14 - (t === 0.5 ? w * 0.25 : 0)}`} className="pf-thin" />
          ))}
        </g>
      );
    case "chain":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={x + i * (w / 3)} y={y + (i % 2) * 10} width={w / 3 - 6} height={h - 10} />
          ))}
          <path d={`M${x + w / 3 - 6} ${y + h / 2}h6M${x + (2 * w) / 3 - 6} ${y + h / 2}h6`} />
        </g>
      );
    default:
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          <path d={`M${x} ${y + 22}H${x + w}`} className="pf-thin" />
        </g>
      );
  }
}

interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Leader end point for the numeral. */
  lx: number;
  ly: number;
}

const VIEW_W = 640;
const VIEW_H = 400;

/** Three arrangements so consecutive figures do not read as copies. */
function layout(count: number, variant: number): Slot[] {
  const n = Math.max(1, Math.min(count, 5));
  if (variant % 3 === 0) {
    // A chain left to right, staggered.
    const w = 96;
    const gap = (VIEW_W - 60 - n * w) / Math.max(1, n - 1);
    return Array.from({ length: n }, (_, i) => {
      const x = 30 + i * (w + gap);
      const y = i % 2 === 0 ? 120 : 200;
      return { x, y, w, h: 96, lx: x + w / 2 + 20, ly: i % 2 === 0 ? 50 : 360 };
    });
  }
  if (variant % 3 === 1) {
    // A hub: the first part in the middle, the rest around it.
    const hub = { x: 262, y: 150, w: 116, h: 100, lx: 330, ly: 40 };
    const around = [
      { x: 40, y: 60, w: 110, h: 90, lx: 30, ly: 200 },
      { x: 490, y: 60, w: 110, h: 90, lx: 620, ly: 200 },
      { x: 40, y: 270, w: 110, h: 90, lx: 180, ly: 385 },
      { x: 490, y: 270, w: 110, h: 90, lx: 470, ly: 385 },
    ];
    return [hub, ...around].slice(0, n);
  }
  // Two tiers: a stack that falls to a store.
  const top = Math.min(n, 3);
  const w = 120;
  const gap = (VIEW_W - 60 - top * w) / Math.max(1, top - 1);
  const slots: Slot[] = Array.from({ length: top }, (_, i) => ({
    x: 30 + i * (w + gap),
    y: 60,
    w,
    h: 96,
    lx: 30 + i * (w + gap) + w + 14,
    ly: 30,
  }));
  if (n > 3) slots.push({ x: 140, y: 250, w: 140, h: 100, lx: 110, ly: 385 });
  if (n > 4) slots.push({ x: 380, y: 250, w: 140, h: 100, lx: 560, ly: 385 });
  return slots;
}

function center(slot: Slot) {
  return { cx: slot.x + slot.w / 2, cy: slot.y + slot.h / 2 };
}

/** The box a part actually occupies; a handset is narrower than its slot. */
function bbox(slot: Slot, shape: PartShape): Slot {
  if (shape !== "handset") return slot;
  const w = Math.min(slot.w, slot.h * 0.55);
  return { ...slot, x: slot.x + (slot.w - w) / 2, w };
}

/** Orthogonal wire between two parts with an arrowhead at the receiver. */
function wire(a: Slot, b: Slot, key: string): ReactNode {
  const { cx: ax, cy: ay } = center(a);
  const { cx: bx, cy: by } = center(b);
  const fromX = bx > ax ? a.x + a.w : bx < ax ? a.x : ax;
  const toX = bx > ax ? b.x : bx < ax ? b.x + b.w : bx;
  const midX = (fromX + toX) / 2;
  const sameColumn = Math.abs(bx - ax) < 4;
  const d = sameColumn
    ? `M${ax} ${ay < by ? a.y + a.h : a.y}V${ay < by ? b.y : b.y + b.h}`
    : `M${fromX} ${ay}H${midX}V${by}H${toX}`;
  const dir = sameColumn ? (ay < by ? "down" : "up") : bx > ax ? "right" : "left";
  const tip = sameColumn ? { x: bx, y: ay < by ? b.y : b.y + b.h } : { x: toX, y: by };
  const head =
    dir === "right"
      ? `M${tip.x - 8} ${tip.y - 5}L${tip.x} ${tip.y}L${tip.x - 8} ${tip.y + 5}`
      : dir === "left"
        ? `M${tip.x + 8} ${tip.y - 5}L${tip.x} ${tip.y}L${tip.x + 8} ${tip.y + 5}`
        : dir === "down"
          ? `M${tip.x - 5} ${tip.y - 8}L${tip.x} ${tip.y}L${tip.x + 5} ${tip.y - 8}`
          : `M${tip.x - 5} ${tip.y + 8}L${tip.x} ${tip.y}L${tip.x + 5} ${tip.y + 8}`;
  return (
    <g key={key}>
      <path d={d} />
      <path d={head} />
    </g>
  );
}

interface PatentFigureProps {
  fig: number;
  parts: readonly string[];
  /** The numeral currently lit from the text, or null. */
  active: number | null;
  onPart: (value: number | null) => void;
  title: string;
  /** Arrangement; defaults to one derived from the figure number. */
  variant?: number;
}

export function PatentFigure({ fig, parts, active, onPart, title, variant = fig }: PatentFigureProps) {
  const diagram = DIAGRAMS[title];
  if (diagram) {
    return <PatentDiagram diagram={diagram} fig={fig} parts={parts} active={active} onPart={onPart} title={title} />;
  }
  const shown = parts.slice(0, 5);
  const slots = layout(shown.length, variant);
  const boxes = slots.map((slot, i) => bbox(slot, shapeFor(shown[i] ?? "")));
  const hubLayout = variant % 3 === 1;

  // Crop the view to the drawing and its numerals so every figure fills its panel.
  const PAD = 34;
  const ys = slots.flatMap((slot) => [slot.y, slot.y + slot.h, slot.ly]);
  const top = Math.max(0, Math.min(...ys) - PAD);
  const bottom = Math.min(VIEW_H, Math.max(...ys) + PAD);

  return (
    <svg
      viewBox={`0 ${top} ${VIEW_W} ${bottom - top}`}
      className="pf"
      role="img"
      aria-label={`Fig. ${fig}: ${title}. Parts: ${shown.map((part, i) => `${numeral(fig, i)} ${part}`).join(", ")}.`}
    >
      <g className="pf-wires" aria-hidden="true">
        {boxes.slice(1).map((box, i) => wire(hubLayout ? boxes[0] : boxes[i], box, `w${i}`))}
      </g>
      {shown.map((part, i) => {
        const slot = slots[i];
        const n = numeral(fig, i);
        const lit = active === n;
        const { cx, cy } = center(slot);
        return (
          <g
            key={part}
            className={`pf-part${lit ? " is-lit" : ""}`}
            onMouseEnter={() => onPart(n)}
            onMouseLeave={() => onPart(null)}
            aria-hidden="true"
          >
            <Shape x={slot.x} y={slot.y} w={slot.w} h={slot.h} shape={shapeFor(part)} />
            <path className="pf-leader" d={`M${cx} ${cy}L${slot.lx} ${slot.ly}`} />
            <text className="pf-num" x={slot.lx + (slot.lx >= cx ? 4 : -4)} y={slot.ly + (slot.ly < cy ? -4 : 14)} textAnchor={slot.lx >= cx ? "start" : "end"}>
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
