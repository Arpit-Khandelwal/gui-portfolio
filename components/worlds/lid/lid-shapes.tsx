/**
 * Die-cut sticker silhouettes, drawn as SVG outlines in a 100x100 box that
 * stretches to the sticker. The white vinyl rim is a non-scaling stroke, so it
 * stays the same width on every size; the shadow is a drop-shadow filter that
 * follows the real contour.
 */

export type ShapeId =
  | "card"
  | "ticket"
  | "label"
  | "leaf"
  | "folder"
  | "bubble"
  | "shield"
  | "hexagon"
  | "star"
  | "tag"
  | "circle"
  | "pill"
  | "pennant"
  | "octagon"
  | "tombstone"
  | "chevron";

/** A 12-point starburst, built once from fixed numbers (same on server and client). */
function starPath(points: number, outer: number, inner: number): string {
  const steps = points * 2;
  const coords = Array.from({ length: steps }, (_, step) => {
    const radius = step % 2 === 0 ? outer : inner;
    const angle = (Math.PI * step) / points - Math.PI / 2;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `M${coords.join(" L")} Z`;
}

export const SHAPE_PATHS: Readonly<Record<ShapeId, string>> = {
  card: "M6 1 H94 Q99 1 99 6 V94 Q99 99 94 99 H6 Q1 99 1 94 V6 Q1 1 6 1 Z",
  ticket:
    "M5 1 H95 Q99 1 99 5 V43 Q94 43 94 50 Q94 57 99 57 V95 Q99 99 95 99 H5 Q1 99 1 95 V57 Q6 57 6 50 Q6 43 1 43 V5 Q1 1 5 1 Z",
  label: "M5 1 H82 L99 16 V95 Q99 99 95 99 H5 Q1 99 1 95 V5 Q1 1 5 1 Z",
  leaf: "M14 1 H97 Q99 1 99 3 V86 Q99 99 86 99 H3 Q1 99 1 97 V14 Q1 1 14 1 Z",
  folder: "M5 7 H52 L58 1 H95 Q99 1 99 5 V95 Q99 99 95 99 H5 Q1 99 1 95 V11 Q1 7 5 7 Z",
  bubble: "M5 1 H95 Q99 1 99 5 V85 Q99 89 95 89 H34 L18 99 L22 89 H5 Q1 89 1 85 V5 Q1 1 5 1 Z",
  shield: "M50 1 L97 11 V48 Q97 83 50 99 Q3 83 3 48 V11 Z",
  hexagon: "M25 2 H75 L99 50 L75 98 H25 L1 50 Z",
  star: starPath(12, 49, 39),
  tag: "M24 2 H95 Q99 2 99 6 V94 Q99 98 95 98 H24 L1 50 Z",
  circle: "M50 1 A49 49 0 1 1 49.99 1 Z",
  pill: "M24 2 H76 Q99 2 99 50 Q99 98 76 98 H24 Q1 98 1 50 Q1 2 24 2 Z",
  pennant: "M1 2 H99 L86 50 L99 98 H1 Z",
  octagon: "M30 1 H70 L99 30 V70 L70 99 H30 L1 70 V30 Z",
  tombstone: "M1 99 V44 Q1 1 50 1 Q99 1 99 44 V99 Z",
  chevron: "M1 2 H84 L99 50 L84 98 H1 L13 50 Z",
};

interface DieCutProps {
  shape: ShapeId;
}

/**
 * The vinyl itself: a resting layer and a lifted-shadow layer. The lifted layer
 * only changes opacity, so the lift animates on the compositor.
 */
export function DieCut({ shape }: DieCutProps) {
  const d = SHAPE_PATHS[shape];
  return (
    <>
      <svg className="lid-cut lid-cut--lift" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={d} vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="lid-cut" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={d} vectorEffect="non-scaling-stroke" />
        <path className="lid-cut-gloss" d={d} />
        {shape === "tag" ? <circle className="lid-cut-hole" cx="13" cy="50" r="3.2" /> : null}
      </svg>
    </>
  );
}

/** Shared paint for the gloss highlight. Rendered once per page. */
export function DieCutDefs() {
  return (
    <svg className="lid-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lid-gloss" x1="0" y1="0" x2="0.55" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.36" />
          <stop offset="0.42" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
