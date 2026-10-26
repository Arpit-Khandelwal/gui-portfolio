"use client";

import Link from "next/link";
import { profile } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { useBrief } from "../use-brief";
import { WorldSwitcher } from "../world-switcher";
import { CanonBrief } from "./canon-brief";
import { CanonFooter } from "./canon-footer";
import { CanonAbout, CanonArchive, CanonFaq, CanonOpenSource, CanonPlay, CanonProcess } from "./canon-sections";
import { CanonWork } from "./canon-work";
import { CanonIntro } from "./canon-intro";
import "./canon.css";
import "./canon-controls.css";
import "./canon-lower.css";
import "./canon-form.css";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Open source", href: "#open-source" },
  { label: "Writing", href: "/writing" },
  { label: "Play", href: "/play" },
  { label: "Contact", href: "#brief" },
] as const;

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

  return (
    <div
      data-world="canon"
      className="world-canon"
      data-swapped={brief.audienceSource !== "default" || undefined}
    >
      <a href="#main" className="c-skip">
        Skip to the content
      </a>
      <CanonHeader />

      <main id="main" tabIndex={-1}>
        <CanonIntro brief={brief} />
        <CanonWork brief={brief} />
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
