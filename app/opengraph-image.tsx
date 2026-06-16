import { ImageResponse } from "next/og";

export const alt = "Arpit Khandelwal — Fractional AI & Backend Engineer for build sprints";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09110e",
          color: "#f5f7ef",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#8fd8ff" }}>
          Arpit Khandelwal
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            Fractional AI &amp; backend engineer
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#40d991" }}>
            for build sprints.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "rgba(245,247,239,0.7)" }}>
          AI agents &middot; Backend &amp; APIs &middot; Privacy / crypto infra &nbsp;&nbsp;&middot;&nbsp;&nbsp; arpitkhandelwal.com
        </div>
      </div>
    ),
    size,
  );
}
