import { openSource, projectArchive, selectedWork } from "@/components/portfolio/data";
import type { CaseStudy, OpenSourcePr } from "@/components/portfolio/types";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import { metricNumeral } from "./poster";
import type { WallTitle } from "./wall-card";
import { linkParams, trackNav } from "./wall-track";

/** Playful builds that also run in the Play row. Titles match data.ts verbatim. */
const PLAY_ARCHIVE_TITLES = ["XOXO"] as const;
const PLAY_CASE_TITLES = ["sold.", "Slop Filter for LinkedIn"] as const;
const PLAY_PATH = "/play";

function hostLabel(href: string): string {
  return linkParams(href).link_domain.replace(/^www\./, "");
}

export function caseTitle(study: CaseStudy): WallTitle {
  const details = [{ label: "Stack", value: study.stack.join(", ") }];
  if (study.parts?.length) details.push({ label: "Parts", value: study.parts.join(" → ") });
  return {
    key: study.title,
    title: study.title,
    foot: `${study.type} · ${study.period}`,
    numeral: metricNumeral(study.credibility),
    lead: study.credibility,
    details,
    action: {
      kind: "panel",
      panelKey: study.title,
      onOpen: () => track("case_open", { case_title: study.title, surface: "row" }),
    },
  };
}

export interface RepoGroup {
  repo: string;
  owner: string;
  name: string;
  prs: readonly OpenSourcePr[];
  merged: number;
  inReview: number;
  /** "4 merged, 1 in review". */
  summary: string;
}

function countLabel(merged: number, inReview: number): string {
  const parts = [];
  if (merged) parts.push(`${merged} merged`);
  if (inReview) parts.push(`${inReview} in review`);
  return parts.join(", ");
}

/** One poster per repository, in the order the data first names it. */
export function repoGroups(): RepoGroup[] {
  const byRepo = new Map<string, OpenSourcePr[]>();
  for (const pr of openSource) byRepo.set(pr.repo, [...(byRepo.get(pr.repo) ?? []), pr]);
  return Array.from(byRepo, ([repo, prs]) => {
    const [owner, name] = repo.split("/");
    const merged = prs.filter((pr) => pr.state === "merged").length;
    const inReview = prs.length - merged;
    return { repo, owner, name: name ?? repo, prs, merged, inReview, summary: countLabel(merged, inReview) };
  });
}

export function openSourceTitles(groups: readonly RepoGroup[]): WallTitle[] {
  return groups.map((group) => {
    const pullRequests = group.prs.length === 1 ? "1 pull request" : `${group.prs.length} pull requests`;
    return {
      key: group.repo,
      title: group.name,
      hueSeed: group.repo,
      glyph: String(group.prs.length),
      foot: `${group.owner} · ${pullRequests}`,
      lead: group.prs[0].title,
      details: [{ label: "Pull requests", value: group.summary }],
      badge: group.merged
        ? { label: group.inReview ? `${group.merged} merged` : "Merged", tone: "solid" }
        : { label: "In review", tone: "outline" },
      action: { kind: "panel", panelKey: group.repo },
    };
  });
}

function archiveTitle([title, text, href]: (typeof projectArchive)[number]): WallTitle {
  return {
    key: title,
    title,
    foot: hostLabel(href),
    numeral: metricNumeral(text),
    lead: text,
    action: {
      kind: "link",
      href,
      external: true,
      onFollow: () => track("archive_link", { item: title, ...linkParams(href) }),
    },
  };
}

export function archiveTitles(): WallTitle[] {
  return projectArchive.map(archiveTitle);
}

export function playCases(): CaseStudy[] {
  return selectedWork.filter((study) => (PLAY_CASE_TITLES as readonly string[]).includes(study.title));
}

export function playTitles(): WallTitle[] {
  const intro = worldCopy.wall.sections.play.intro;
  const game: WallTitle = {
    key: PLAY_PATH,
    title: "Brick-breaker",
    foot: `Play it here · ${PLAY_PATH}`,
    lead: intro,
    wide: true,
    action: {
      kind: "link",
      href: PLAY_PATH,
      external: false,
      onFollow: () => trackNav(PLAY_PATH, "Brick-breaker", "row", "play"),
    },
  };
  const archive = projectArchive
    .filter(([title]) => (PLAY_ARCHIVE_TITLES as readonly string[]).includes(title))
    .map(archiveTitle);
  return [game, ...archive, ...playCases().map(caseTitle)];
}
