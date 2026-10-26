"use client";

import Link from "next/link";
import { availability, buyerModes, profile } from "@/components/portfolio/data";
import { worldCopy } from "@/lib/world-copy";
import { track } from "@/lib/analytics";
import { useBrief } from "../use-brief";
import { WorldSwitcher } from "../world-switcher";
import { CanonBrief } from "./canon-brief";
import { CanonFooter } from "./canon-footer";
import { CanonAbout, CanonArchive, CanonFaq, CanonOpenSource, CanonPlay, CanonProcess } from "./canon-sections";
import { CanonWork } from "./canon-work";
import { Segmented } from "./segmented";
import "./canon.css";
import "./canon-lower.css";

const copy = worldCopy.canon;

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Open source", href: "#open-source" },
  { label: "Writing", href: "/writing" },
  { label: "Play", href: "/play" },
  { label: "Contact", href: "#brief" },
] as const;

function textOf(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function CanonHeader() {
  return (
    <header className="c-header">
      <div className="c-shell c-header-inner">
        <a href="#top" className="c-mark">
          {profile.name}
        </a>
        <nav className="c-nav" aria-label="Main">
          <ul>
            {NAV.map((item) => {
              const onClick = () => track("nav_click", { link_url: item.href, link_text: item.label, nav: "header" });
              return (
                <li key={item.href}>
                  {item.href.startsWith("#") ? (
                    <a href={item.href} onClick={onClick}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} onClick={onClick}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <WorldSwitcher current="canon" className="c-switcher" />
      </div>
    </header>
  );
}

/** World D: the category-standard dark engineer portfolio. */
export function CanonHome() {
  const brief = useBrief();
  const stackLine = textOf(copy.extra.stack);

  return (
    <div data-world="canon" className="world-canon">
      <a href="#main" className="c-skip">
        Skip to the content
      </a>
      <CanonHeader />

      <main id="main" tabIndex={-1}>
        <section id="top" className="c-shell c-intro" aria-labelledby="c-name" data-analytics-section="hero">
          <div className="c-intro-main">
            <h1 id="c-name" className="c-h1">
              {profile.name}
            </h1>
            <p className="c-lead">{copy.headline}</p>
            <p className="c-subline">{copy.subline}</p>
            <p className="c-status">
              <span className="c-dot" aria-hidden="true" />
              <span>{availability.status}.</span>
              <span className="c-status-reply">{availability.reply}.</span>
            </p>
            <div className="c-actions">
              <a
                href="#brief"
                className="c-btn c-btn-primary"
                onClick={() => track("cta_click", { cta: "brief", section: "hero" })}
              >
                Send a brief
              </a>
              <a href="#work" className="c-btn c-btn-quiet">
                See the work
              </a>
            </div>
          </div>

          <div className="c-intro-aside">
            {stackLine ? <p className="c-intro-stack">{stackLine}</p> : null}
            <Segmented
              label="Your role"
              options={buyerModes.map((mode) => ({ value: mode.id, label: mode.label }))}
              value={brief.buyerId}
              onChange={(id) => {
                const mode = buyerModes.find((item) => item.id === id);
                if (!mode) return;
                brief.setBuyerId(mode.id);
                track("audience_select", { audience: mode.id });
              }}
            />
            <p className="c-promise" aria-live="polite">
              {brief.buyer.promise}
            </p>
          </div>
        </section>

        <CanonWork />
        <CanonOpenSource />
        <CanonAbout />
        <CanonProcess />
        <CanonFaq />
        <CanonArchive />
        <CanonPlay />
        <CanonBrief brief={brief} />
      </main>

      <CanonFooter />
    </div>
  );
}
