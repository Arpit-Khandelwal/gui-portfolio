"use client";

import type { ReactNode } from "react";
import type { Diagram, DiagramEdge, DiagramNode, DiagramShape, NumeralSide } from "./patent-diagrams";

/**
 * Renders one hand-authored block diagram in patent drawing style: ink
 * outlines, the part's name set inside its block, labelled flows between
 * blocks, and a reference numeral on a leader for every real part.
 */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const LABEL_SIZE = 13;
const CHAR_W = LABEL_SIZE * 0.6;
const PAD = 34;

function cx(b: Box) {
  return b.x + b.w / 2;
}
function cy(b: Box) {
  return b.y + b.h / 2;
}

/** Splits a label into lines that fit a width, at word boundaries. */
function wrap(text: string, width: number): string[] {
  const max = Math.max(6, Math.floor(width / CHAR_W));
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function Outline({ shape, x, y, w, h }: Box & { shape: DiagramShape }): ReactNode {
  switch (shape) {
    case "store": {
      const ry = Math.min(14, h * 0.13);
      return (
        <g>
          <path d={`M${x} ${y + ry}V${y + h - ry}M${x + w} ${y + ry}V${y + h - ry}`} />
          <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} />
          <path d={`M${x} ${y + h - ry}a${w / 2} ${ry} 0 0 0 ${w} 0`} />
        </g>
      );
    }
    case "handset":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={14} />
          <rect x={x + 8} y={y + 16} width={w - 16} height={h - 42} className="pf-thin" />
          <circle cx={x + w / 2} cy={y + h - 13} r={5} />
        </g>
      );
    case "window":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          <path d={`M${x} ${y + 20}H${x + w}`} />
          <circle cx={x + 11} cy={y + 10} r={3.5} />
          <circle cx={x + 23} cy={y + 10} r={3.5} />
        </g>
      );
    case "model":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={Math.min(h, w) / 2.4} />
          <path d={`M${x + w * 0.3} ${y + 12}h${w * 0.4}`} className="pf-thin" />
        </g>
      );
    case "chain":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={x + 10 + i * 24} y={y + 8} width={14} height={14} className="pf-thin" />
          ))}
          <path d={`M${x + 24} ${y + 15}h10M${x + 48} ${y + 15}h10`} className="pf-thin" />
        </g>
      );
    case "rack":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          {[0, 1].map((i) => (
            <g key={i}>
              <path d={`M${x} ${y + 14 + i * 12}H${x + w}`} className="pf-thin" />
              <circle cx={x + w - 10} cy={y + 8 + i * 12} r={2.2} className="pf-thin" />
            </g>
          ))}
        </g>
      );
    case "lock": {
      const sw = Math.min(26, w * 0.2);
      return (
        <g>
          <rect x={x} y={y + 16} width={w} height={h - 16} />
          <path d={`M${x + w - sw - 14} ${y + 16}v-6a${sw / 2} ${sw / 2} 0 0 1 ${sw} 0v6`} />
        </g>
      );
    }
    case "doc":
      return <path d={`M${x} ${y}H${x + w - 18}L${x + w} ${y + 18}V${y + h}H${x}Z M${x + w - 18} ${y}V${y + 18}H${x + w}`} />;
    case "gate":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          {[0.18, 0.82].map((t) => (
            <path key={t} d={`M${x + w * t} ${y}V${y + h}`} className="pf-thin" />
          ))}
        </g>
      );
    case "card":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={8} />
          <path d={`M${x} ${y + 20}H${x + w}`} />
          <rect x={x + 10} y={y + h - 24} width={22} height={14} className="pf-thin" />
        </g>
      );
    case "tag":
      return (
        <g>
          <path d={`M${x + 22} ${y}H${x + w}V${y + h}H${x + 22}L${x} ${y + h / 2}Z`} />
          <circle cx={x + 18} cy={y + h / 2} r={4} className="pf-thin" />
        </g>
      );
    case "mpc": {
      const r = Math.min(w, h) * 0.13;
      const pts = [
        [x + w / 2, y + r + 4],
        [x + r + 4, y + h - r - 4],
        [x + w - r - 4, y + h - r - 4],
      ];
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} className="pf-thin" strokeDasharray="2 4" />
          <path d={`M${pts[0][0]} ${pts[0][1]}L${pts[1][0]} ${pts[1][1]}L${pts[2][0]} ${pts[2][1]}Z`} className="pf-thin" />
          {pts.map(([px, py]) => (
            <circle key={`${px}-${py}`} cx={px} cy={py} r={r} className="pf-node" />
          ))}
        </g>
      );
    }
    case "tiles":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={x + 10 + (i % 3) * ((w - 20) / 3)} y={y + 12 + Math.floor(i / 3) * 24} width={(w - 20) / 3 - 6} height={18} className="pf-thin" />
          ))}
        </g>
      );
    default:
      return <rect x={x} y={y} width={w} height={h} />;
  }
}

/** Where a block's name sits, per shape. */
function labelArea(node: DiagramNode): Box & { align: "middle" | "start" } {
  const { x, y, w, h, shape } = node;
  if (node.container) return { x: x + 12, y: y + (shape === "window" ? 28 : 10), w: w - 24, h: 24, align: "start" };
  switch (shape) {
    case "window":
      return { x: x + 6, y: y + 22, w: w - 12, h: h - 22, align: "middle" };
    case "handset":
      return { x: x - 30, y: y + h + 6, w: w + 60, h: 34, align: "middle" };
    case "lock":
      return { x: x + 6, y: y + 16, w: w - 12, h: h - 16, align: "middle" };
    case "rack":
      return { x: x + 6, y: y + 26, w: w - 12, h: h - 26, align: "middle" };
    case "chain":
      return { x: x + 6, y: y + 24, w: w - 12, h: h - 24, align: "middle" };
    case "model":
      return { x: x + 14, y: y + 6, w: w - 28, h: h - 6, align: "middle" };
    case "store":
      return { x: x + 6, y: y + 24, w: w - 12, h: h - 30, align: "middle" };
    case "tiles":
      return { x: x + 6, y: y + 60, w: w - 12, h: h - 60, align: "middle" };
    case "mpc":
      return { x: x + 6, y: y + h * 0.42, w: w - 12, h: h * 0.3, align: "middle" };
    case "tag":
      return { x: x + 26, y, w: w - 30, h, align: "middle" };
    case "card":
      return { x: x + 36, y: y + 20, w: w - 40, h: h - 20, align: "middle" };
    default:
      return { x: x + 6, y, w: w - 12, h, align: "middle" };
  }
}

function BlockLabel({ node }: { node: DiagramNode }) {
  const area = labelArea(node);
  const lines = wrap(node.context ? node.label : node.label.toUpperCase(), area.w);
  const lineH = LABEL_SIZE + 3;
  const top = area.align === "start" ? area.y + LABEL_SIZE : area.y + area.h / 2 - ((lines.length - 1) * lineH) / 2 + LABEL_SIZE * 0.35;
  return (
    <text
      className={node.context ? "pf-ctx-label" : "pf-label"}
      x={area.align === "start" ? area.x : area.x + area.w / 2}
      y={top}
      textAnchor={area.align === "start" ? "start" : "middle"}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={area.align === "start" ? area.x : area.x + area.w / 2} dy={i === 0 ? 0 : lineH}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

interface Leader {
  from: [number, number];
  to: [number, number];
  anchor: "start" | "end";
  textY: number;
}

function leaderFor(node: DiagramNode, side: NumeralSide): Leader {
  const { x, y, w, h } = node;
  switch (side) {
    case "b":
      return { from: [x + w * 0.3, y + h * 0.8], to: [x + w * 0.3 - 18, y + h + 24], anchor: "end", textY: y + h + 38 };
    case "l":
      return { from: [x + w * 0.2, y + h * 0.35], to: [x - 20, y + h * 0.35 - 18], anchor: "end", textY: y + h * 0.35 - 22 };
    case "r":
      return { from: [x + w * 0.8, y + h * 0.35], to: [x + w + 20, y + h * 0.35 - 18], anchor: "start", textY: y + h * 0.35 - 22 };
    default:
      return { from: [x + w * 0.72, y + Math.min(h * 0.3, 26)], to: [x + w * 0.72 + 16, y - 22], anchor: "start", textY: y - 26 };
  }
}

/** The box wires avoid: a handset's name is set below it, so include it. */
function routeBox(node: DiagramNode): Box {
  return node.shape === "handset" ? { x: node.x, y: node.y, w: node.w, h: node.h + 40 } : node;
}

interface Route {
  d: string;
  head: string;
  lx: number;
  ly: number;
}

function arrowHead(x: number, y: number, dir: "r" | "l" | "u" | "d"): string {
  if (dir === "r") return `M${x - 9} ${y - 5}L${x} ${y}L${x - 9} ${y + 5}`;
  if (dir === "l") return `M${x + 9} ${y - 5}L${x} ${y}L${x + 9} ${y + 5}`;
  if (dir === "d") return `M${x - 5} ${y - 9}L${x} ${y}L${x + 5} ${y - 9}`;
  return `M${x - 5} ${y + 9}L${x} ${y}L${x + 5} ${y + 9}`;
}

function route(a: Box, b: Box, via?: "top" | "bottom", viaY?: number): Route {
  if (via) {
    const ry = viaY ?? (via === "top" ? Math.min(a.y, b.y) - 22 : Math.max(a.y + a.h, b.y + b.h) + 22);
    const sy = via === "top" ? a.y : a.y + a.h;
    const ey = via === "top" ? b.y : b.y + b.h;
    const sx = cx(a) + (cx(b) > cx(a) ? a.w * 0.15 : -a.w * 0.15);
    const ex = cx(b) + (cx(a) > cx(b) ? b.w * 0.15 : -b.w * 0.15);
    return { d: `M${sx} ${sy}V${ry}H${ex}V${ey}`, head: arrowHead(ex, ey, via === "top" ? "d" : "u"), lx: (sx + ex) / 2, ly: ry };
  }
  const hGap = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
  const vGap = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h));
  if (hGap >= vGap) {
    const right = cx(b) > cx(a);
    const sx = right ? a.x + a.w : a.x;
    const ex = right ? b.x : b.x + b.w;
    const sy = Math.max(a.y + 10, Math.min(a.y + a.h - 10, cy(b)));
    const ey = Math.max(b.y + 10, Math.min(b.y + b.h - 10, sy));
    const mx = (sx + ex) / 2;
    const d = sy === ey ? `M${sx} ${sy}H${ex}` : `M${sx} ${sy}H${mx}V${ey}H${ex}`;
    return { d, head: arrowHead(ex, ey, right ? "r" : "l"), lx: mx, ly: Math.min(sy, ey) };
  }
  const down = cy(b) > cy(a);
  const sy = down ? a.y + a.h : a.y;
  const ey = down ? b.y : b.y + b.h;
  const sx = Math.max(a.x + 10, Math.min(a.x + a.w - 10, cx(b)));
  const ex = Math.max(b.x + 10, Math.min(b.x + b.w - 10, sx));
  const my = (sy + ey) / 2;
  const d = sx === ex ? `M${sx} ${sy}V${ey}` : `M${sx} ${sy}V${my}H${ex}V${ey}`;
  return { d, head: arrowHead(ex, ey, down ? "d" : "u"), lx: (sx + ex) / 2 + 8, ly: my };
}

function EdgeLabel({ text, x, y, vertical }: { text: string; x: number; y: number; vertical: boolean }) {
  const width = text.length * (LABEL_SIZE - 1) * 0.6 + 10;
  const tx = vertical ? x : x - width / 2;
  const ty = vertical ? y - 9 : y - 22;
  return (
    <g className="pf-edge-label">
      <rect x={tx} y={ty} width={width} height={LABEL_SIZE + 4} />
      <text x={tx + 5} y={ty + LABEL_SIZE}>
        {text}
      </text>
    </g>
  );
}

interface PatentDiagramProps {
  diagram: Diagram;
  fig: number;
  /** The case's parts, in data order; their index sets the numeral. */
  parts: readonly string[];
  active: number | null;
  onPart: (value: number | null) => void;
  title: string;
}

export function PatentDiagram({ diagram, fig, parts, active, onPart, title }: PatentDiagramProps) {
  const byLabel = new Map(diagram.nodes.map((node) => [node.label, node]));
  const numeralOf = (label: string) => {
    const index = parts.indexOf(label);
    return index === -1 ? null : fig * 100 + (index + 1) * 2;
  };
  const ordered = [...diagram.nodes].sort((a, b) => Number(Boolean(b.container)) - Number(Boolean(a.container)));
  const described = diagram.nodes
    .filter((node) => numeralOf(node.label) !== null)
    .map((node) => `${numeralOf(node.label)} ${node.label}`)
    .join(", ");
  const flows = diagram.edges.map((edge) => `${edge.from} to ${edge.to}${edge.label ? ` (${edge.label})` : ""}`).join("; ");

  return (
    <svg
      viewBox={`${-PAD} ${-PAD - 8} ${diagram.w + PAD * 2} ${diagram.h + PAD * 2 + (diagram.note ? 18 : 0)}`}
      className="pf pf-diagram"
      role="img"
      aria-label={`Fig. ${fig}: ${title}. Parts: ${described}. Flows: ${flows}.`}
    >
      {ordered.map((node) => {
        const n = numeralOf(node.label);
        const lit = n !== null && active === n;
        const leader = n !== null ? leaderFor(node, node.n ?? "t") : null;
        return (
          <g
            key={node.label}
            className={`pf-part${node.context ? " is-context" : ""}${node.container ? " is-container" : ""}${lit ? " is-lit" : ""}`}
            onMouseEnter={n !== null ? () => onPart(n) : undefined}
            onMouseLeave={n !== null ? () => onPart(null) : undefined}
            aria-hidden="true"
          >
            <Outline shape={node.shape} x={node.x} y={node.y} w={node.w} h={node.h} />
            {node.crossed ? <path className="pf-thin" d={`M${node.x} ${node.y}L${node.x + node.w} ${node.y + node.h}M${node.x + node.w} ${node.y}L${node.x} ${node.y + node.h}`} /> : null}
            <BlockLabel node={node} />
            {leader && n !== null ? (
              <>
                <path className="pf-leader" d={`M${leader.from[0]} ${leader.from[1]}L${leader.to[0]} ${leader.to[1]}`} />
                <text className="pf-num" x={leader.to[0] + (leader.anchor === "start" ? 2 : -2)} y={leader.textY + (node.n === "b" ? 0 : 0)} textAnchor={leader.anchor}>
                  {n}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
      <g className="pf-wires" aria-hidden="true">
        {diagram.edges.map((edge: DiagramEdge) => {
          const a = byLabel.get(edge.from);
          const b = byLabel.get(edge.to);
          if (!a || !b) return null;
          const r = route(routeBox(a), routeBox(b), edge.via, edge.viaY);
          const vertical = !edge.via && !/H/.test(r.d.replace(/^M[^VH]*/, "").replace(/V[^H]*$/, "")) && /V/.test(r.d);
          return (
            <g key={`${edge.from}-${edge.to}`} className={edge.dashed ? "pf-return" : undefined}>
              <path d={r.d} />
              <path d={r.head} className="pf-head" />
              {edge.label ? <EdgeLabel text={edge.label} x={r.lx} y={r.ly} vertical={vertical} /> : null}
            </g>
          );
        })}
      </g>
      {diagram.note ? (
        <text className="pf-note" x={0} y={diagram.h + PAD + 6}>
          {diagram.note}
        </text>
      ) : null}
    </svg>
  );
}
