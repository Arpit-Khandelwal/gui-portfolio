import { ImageResponse } from "next/og";

export const alt = "Arpit Khandelwal — backend and AI-systems engineer. Fig. 1: an AI concierge operating a closed consumer app.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#141414";
const RED = "#c8261a";
const SHEET = "#fbfbf8";

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

/** Fetches one Google Font as TTF for Satori, subset to the text it draws. */
async function loadFont(family: string, weight: 400 | 700, text: string): Promise<OgFont | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return { name: family, data: await (await fetch(url)).arrayBuffer(), weight, style: "normal" };
  } catch {
    // Offline build: Satori falls back to its default face.
    return null;
  }
}

const TITLE = "Apparatus and method for shipping the awkward middle of a product";
const TYPED = "Specification AK-2026 · Sheet 1 Arpit Khandelwal · Bengaluru arpitkhandelwal.com 102 104 106 108";

/** Social card in the default (patent) world: one specification sheet. */
export default async function OpengraphImage() {
  const fonts = (
    await Promise.all([
      loadFont("Old Standard TT", 400, `${TITLE} Fig. 1`),
      loadFont("Courier Prime", 400, TYPED),
      loadFont("Courier Prime", 700, TYPED),
    ])
  ).filter((font): font is OgFont => font !== null);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f5f2", padding: 28 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            border: `3px solid ${INK}`,
            background: SHEET,
            color: INK,
            fontFamily: "Old Standard TT",
          }}
        >
          <div style={{ width: 520, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 44, borderRight: `2px solid ${INK}` }}>
            <div style={{ display: "flex", fontFamily: "Courier Prime", fontSize: 20 }}>Specification AK-2026 · Sheet 1</div>
            <div style={{ display: "flex", fontSize: 58, lineHeight: 1.04 }}>
              {TITLE}
            </div>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Courier Prime", fontSize: 22, gap: 6 }}>
              <span>Arpit Khandelwal · Bengaluru</span>
              <span style={{ color: RED }}>arpitkhandelwal.com</span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 40 }}>
            <div style={{ position: "relative", display: "flex", width: 560, height: 330 }}>
            <svg width="560" height="300" style={{ position: "absolute", top: 15, left: 0 }} viewBox="0 0 560 300" fill="none" stroke={INK} strokeWidth="3">
              <rect x="10" y="90" width="110" height="100" />
              <path d="M30 120h70M30 140h50M30 160h70" strokeWidth="1.5" />
              <rect x="160" y="140" width="110" height="100" />
              <path d="M160 166h110" strokeWidth="1.5" />
              <rect x="310" y="90" width="120" height="100" />
              <path d="M310 112h120" />
              <rect x="470" y="110" width="70" height="130" rx="14" />
              <path d="M120 140h20v50h20M270 190h20v-50h20M430 140h20v35h20" strokeWidth="2" />
              <path d="M75 140L60 40M215 190l15 90M370 140l20-100M505 175l40 105" strokeWidth="1.5" />
            </svg>
              {[
                ["102", 40, 0],
                ["104", 210, 300],
                ["106", 368, 0],
                ["108", 496, 300],
              ].map(([label, left, top]) => (
                <div
                  key={label}
                  style={{ position: "absolute", left: Number(left), top: Number(top), display: "flex", color: RED, fontSize: 28, fontFamily: "Courier Prime", fontWeight: 700 }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 40, fontStyle: "italic", marginTop: 18 }}>Fig. 1</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
