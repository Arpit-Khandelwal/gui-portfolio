import { describe, expect, test } from "vitest";
import { selectedWork } from "@/components/portfolio/data";
import { DIAGRAMS } from "@/components/worlds/patent/patent-diagrams";

describe("patent diagrams", () => {
  test("every build has a hand-authored diagram", () => {
    for (const work of selectedWork) expect(DIAGRAMS[work.title], work.title).toBeDefined();
  });

  test("every real part is drawn, and every numbered node is a real part", () => {
    for (const work of selectedWork) {
      const diagram = DIAGRAMS[work.title];
      const parts = work.parts ?? [];
      const drawn = diagram.nodes.filter((node) => !node.context).map((node) => node.label);
      expect(new Set(drawn), work.title).toEqual(new Set(parts));
    }
  });

  test("edges only connect nodes that exist", () => {
    for (const [title, diagram] of Object.entries(DIAGRAMS)) {
      const labels = new Set(diagram.nodes.map((node) => node.label));
      for (const edge of diagram.edges) {
        expect(labels.has(edge.from), `${title}: ${edge.from}`).toBe(true);
        expect(labels.has(edge.to), `${title}: ${edge.to}`).toBe(true);
      }
    }
  });

  test("nodes stay inside the drawing area", () => {
    for (const [title, diagram] of Object.entries(DIAGRAMS)) {
      for (const node of diagram.nodes) {
        expect(node.x >= 0 && node.x + node.w <= diagram.w, `${title}: ${node.label} x`).toBe(true);
        expect(node.y >= 0 && node.y + node.h <= diagram.h, `${title}: ${node.label} y`).toBe(true);
      }
    }
  });
});

describe("patent diagram legibility", () => {
  test("a label on a side-by-side edge fits in the gap between the blocks", () => {
    const tooWide: string[] = [];
    for (const [title, diagram] of Object.entries(DIAGRAMS)) {
      const byLabel = new Map(diagram.nodes.map((node) => [node.label, node]));
      for (const edge of diagram.edges) {
        const a = byLabel.get(edge.from);
        const b = byLabel.get(edge.to);
        if (!a || !b || !edge.label || edge.via || a.container || b.container) continue;
        const hGap = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
        const vGap = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h));
        if (hGap < vGap) continue;
        const width = edge.label.length * 12 * 0.6 + 10;
        if (width > hGap) tooWide.push(`${title}: "${edge.label}" needs ${Math.ceil(width)}, gap ${hGap}`);
      }
    }
    expect(tooWide).toEqual([]);
  });
});
