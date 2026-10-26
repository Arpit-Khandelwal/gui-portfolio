"use client";

import { useBrief } from "@/components/worlds/use-brief";
import { selectedWork } from "@/components/portfolio/data";
import type { CaseStudy } from "@/components/portfolio/types";
import { worldCopy } from "@/lib/world-copy";
import { WallBillboard } from "./wall-billboard";
import { WallBrief } from "./wall-brief";
import { WallFooter, WallHeader } from "./wall-chrome";
import { WallFaq, WallGuide } from "./wall-guide";
import { WallRow, type WallPanelProps } from "./wall-row";
import { WallCasePanel } from "./wall-case-panel";
import { WallRepoPanel } from "./wall-repo-panel";
import { WallAboutRow } from "./wall-about-row";
import { archiveTitles, caseTitle, openSourceTitles, playCases, playTitles, repoGroups } from "./wall-titles";
import "./wall.css";
import "./wall-posters.css";
import "./wall-sections.css";
import "./wall-motion.css";

const copy = worldCopy.wall;

function textExtra(key: string): string | undefined {
  const value: unknown = (copy.extra as Readonly<Record<string, unknown>>)[key];
  return typeof value === "string" ? value : undefined;
}

function findFeatured(): CaseStudy {
  const byTitle = selectedWork.find((study) => study.title === textExtra("featuredTitle"));
  return byTitle ?? selectedWork.find((study) => study.credibility.includes("50k+")) ?? selectedWork[0];
}

const defaultFeatured = findFeatured();
const TOP_PICKS_TITLE = "Top picks for you";

/** A CSS-safe name, so each top pick can move as one shape between profiles. */
function transitionName(prefix: string, title: string): string {
  return `${prefix}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function billboardLine(study: CaseStudy): string {
  return study.title === textExtra("featuredTitle") ? (textExtra("featuredLine") ?? study.shipped) : study.shipped;
}
const shipped = selectedWork.filter((study) => study.status === "shipped");
const experiments = selectedWork.filter((study) => study.status === "experiment");
const repos = repoGroups();

function casePanel(cases: readonly CaseStudy[]) {
  function renderCasePanel(key: string, panel: WallPanelProps) {
    const study = cases.find((item) => item.title === key);
    return study ? <WallCasePanel study={study} {...panel} /> : null;
  }
  return renderCasePanel;
}

function renderRepoPanel(key: string, panel: WallPanelProps) {
  const group = repos.find((item) => item.repo === key);
  return group ? <WallRepoPanel group={group} {...panel} /> : null;
}

/** World C: a streaming title wall. Every build is a typographic poster. */
export function WallHome() {
  const brief = useBrief();
  const s = copy.sections;
  const topPicks = brief.orderedWork.filter((study) => brief.isFeatured(study.title));
  const featured = topPicks[0] ?? defaultFeatured;

  return (
    <div data-world="wall" className="world-wall">
      <WallHeader />
      <main id="main" tabIndex={-1}>
        <WallBillboard featured={featured} line={billboardLine(featured)} brief={brief} />
        <WallRow
          key={brief.buyerId}
          id="top-picks"
          title={TOP_PICKS_TITLE}
          intro={brief.buyer.why}
          items={topPicks.map((study) => ({ ...caseTitle(study), transitionName: transitionName("wall-pick", study.title) }))}
          renderPanel={casePanel(topPicks)}
          isRanked
        />
        <WallRow
          id="shipped"
          title={s.work.title}
          intro={s.work.intro}
          items={shipped.map(caseTitle)}
          renderPanel={casePanel(shipped)}
        />
        <WallRow
          id="experiments"
          title={s.experiments.title}
          intro={s.experiments.intro}
          items={experiments.map(caseTitle)}
          renderPanel={casePanel(experiments)}
        />
        <WallRow
          id="open-source"
          title={s.openSource.title}
          intro={s.openSource.intro}
          items={openSourceTitles(repos)}
          renderPanel={renderRepoPanel}
        />
        <WallRow id="small-builds" title={s.archive.title} intro={s.archive.intro} items={archiveTitles()} />
        <WallRow
          id="play"
          title={s.play.title}
          intro={s.play.intro}
          items={playTitles()}
          renderPanel={casePanel(playCases())}
        />
        <WallAboutRow />
        <WallGuide />
        <WallFaq />
        <WallBrief brief={brief} />
      </main>
      <WallFooter />
    </div>
  );
}
