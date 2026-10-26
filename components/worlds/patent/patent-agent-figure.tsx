"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK = [
  "# Arpit Khandelwal",
  "",
  "Backend and AI-systems engineer in Bengaluru.",
  "",
  "## Selected work",
  "",
  "- Reskilll Platform …",
];

const LINES = 14;

/**
 * FIG. 0: the page as an agent reads it. Fetches the real markdown twin of
 * this page when the figure scrolls into view, so the drawing shows what an
 * agent actually receives, not a picture of it.
 */
export function AgentFigure({ caption }: { caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<readonly string[]>(FALLBACK);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fetch("/index.md", { headers: { accept: "text/markdown" } })
          .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
          .then((text) => {
            if (!cancelled) setLines(text.split("\n").slice(0, LINES));
          })
          .catch(() => {
            // The fallback excerpt stays; the figure still explains the idea.
          });
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <figure ref={ref} className="pa-fig0" data-analytics-section="fig-0">
      <div className="pa-fig0-grid">
        <div className="pa-doc" aria-label="First lines of /index.md">
          <span className="pa-doc-tab">GET /index.md</span>
          <pre>{lines.join("\n")}</pre>
        </div>
        <ul className="pa-entry" aria-label="Agent entry points">
          <li>
            <span className="pa-n">02</span>
            <a href="/llms.txt">/llms.txt</a>
          </li>
          <li>
            <span className="pa-n">04</span>
            <a href="/index.md">/index.md</a>
          </li>
          <li>
            <span className="pa-n">06</span>
            <a href="/openapi.json">/openapi.json</a>
          </li>
          <li>
            <span className="pa-n">08</span>
            <a href="/docs">POST /api/contact</a>
          </li>
        </ul>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
