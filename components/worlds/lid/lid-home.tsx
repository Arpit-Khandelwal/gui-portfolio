"use client";

import "./lid.css";
import "./lid-cases.css";
// Last: holds the responsive and reduced-motion overrides.
import "./lid-sheet.css";
import { useBrief } from "../use-brief";
import { LidBrief } from "./lid-brief";
import { LidAbout, LidFaq, LidProcess, LidTerms } from "./lid-details";
import { LidFooter } from "./lid-footer";
import { LidHeader } from "./lid-header";
import { LidHero } from "./lid-hero";
import { DieCutDefs } from "./lid-shapes";
import { LidArchive, LidOpenSource, LidPlay, LidWork } from "./lid-showcase";

/**
 * World B: the archive as a sticker-bombed hackathon laptop lid. Every build
 * is a die-cut sticker that lifts on hover or focus and flips to its case.
 */
export function LidHome() {
  const brief = useBrief();

  return (
    <div data-world="lid" className="world-lid">
      <DieCutDefs />
      <LidHeader />
      <main id="main" tabIndex={-1}>
        <LidHero brief={brief} />
        <LidWork />
        <LidOpenSource />
        <LidArchive />
        <LidPlay />
        <LidProcess />
        <LidTerms />
        <LidAbout />
        <LidFaq />
        <LidBrief brief={brief} />
      </main>
      <LidFooter />
    </div>
  );
}
