"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { openSource, projectArchive, selectedWork } from "@/components/portfolio/data";
import type { CaseStudy, OpenSourcePr } from "@/components/portfolio/types";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import type { BriefState } from "../use-brief";
import { LidCaseSticker } from "./lid-case-sticker";
import {
  CASE_NUDGE,
  CASE_SHAPES,
  CASE_WIDTHS,
  MERGED_COLORS,
  SHIPPED_COLORS,
  linkParams,
  rotateStyle,
  tilt,
  type StickerColor,
} from "./lid-layout";
import { LidSectionHead } from "./lid-section-head";

const sections = worldCopy.lid.sections;
/** Hackathon builds are flat, matte vinyl; shipped builds are gloss. */
const EXPERIMENT_COLORS: readonly StickerColor[] = ["lilac", "yellow", "white", "green", "blue", "orange", "ink"];

interface CasePileProps {
  studies: readonly CaseStudy[];
  colors: readonly StickerColor[];
  finish: "gloss" | "matte";
  offset: number;
  isFeatured: (title: string) => boolean;
  readerKey: string;
}

/** A packed, overlapping pile of case stickers: varied size, contour and tilt. */
function CasePile({ studies, colors, finish, offset, isFeatured, readerKey }: CasePileProps) {
  return (
    <ul className={`lid-case-pile lid-finish--${finish}`}>
      {studies.map((study) => {
        const base = BASE_ORDER.indexOf(study.title);
        const index = base === -1 ? 0 : base;
        const slot = index + offset;
        return (
          <LidCaseSticker
            key={study.title}
            study={study}
            color={colors[index % colors.length]}
            shape={CASE_SHAPES[slot % CASE_SHAPES.length]}
            rotate={tilt(slot)}
            nudge={CASE_NUDGE[slot % CASE_NUDGE.length]}
            width={CASE_WIDTHS[slot % CASE_WIDTHS.length]}
            featured={isFeatured(study.title)}
            readerKey={readerKey}
          />
        );
      })}
    </ul>
  );
}

interface LidWorkProps {
  brief: BriefState;
}

/** Look follows the build, not its place in the pile, so a reorder moves the same sticker. */
const BASE_ORDER: readonly string[] = selectedWork.map((study) => study.title);

export function LidWork({ brief }: LidWorkProps) {
  const shipped = brief.orderedWork.filter((study) => study.status === "shipped");
  const experiments = brief.orderedWork.filter((study) => study.status !== "shipped");

  return (
    <section id="work" className="lid-section lid-work" data-analytics-section="work" aria-label="Builds">
      <p className="lid-why" aria-live="polite">
        <span key={brief.buyerId} className="lid-foryou lid-foryou--key lid-slap-in" aria-hidden="true">
          For you
        </span>
        <span>
          <strong>{brief.buyer.ask}:</strong> {brief.buyer.why}
        </span>
      </p>
      <div className="lid-work-group">
        <LidSectionHead id="lid-shipped" title={sections.work.title} intro={sections.work.intro} rotate={-2} />
        <CasePile
          studies={shipped}
          colors={SHIPPED_COLORS}
          finish="gloss"
          offset={0}
          isFeatured={brief.isFeatured}
          readerKey={brief.buyerId}
        />
      </div>
      <div className="lid-work-group">
        <LidSectionHead
          id="lid-experiments"
          title={sections.experiments.title}
          intro={sections.experiments.intro}
          rotate={1.5}
          tone="lilac"
        />
        <CasePile
          studies={experiments}
          colors={EXPERIMENT_COLORS}
          finish="matte"
          offset={3}
          isFeatured={brief.isFeatured}
          readerKey={brief.buyerId}
        />
      </div>
    </section>
  );
}

type RepoGroup = { readonly repo: string; readonly prs: readonly OpenSourcePr[] };

/** Groups PRs by repo, in the order each repo first shows up in the data. */
function groupByRepo(prs: readonly OpenSourcePr[]): readonly RepoGroup[] {
  const order: string[] = [];
  const byRepo = new Map<string, OpenSourcePr[]>();
  for (const pr of prs) {
    const list = byRepo.get(pr.repo);
    if (list) list.push(pr);
    else {
      order.push(pr.repo);
      byRepo.set(pr.repo, [pr]);
    }
  }
  return order.map((repo) => ({ repo, prs: byRepo.get(repo) ?? [] }));
}

function SlapTag({ pr, index, color }: { pr: OpenSourcePr; index: number; color: StickerColor }) {
  const merged = pr.state === "merged";
  return (
    <li className="lid-slap-item" style={rotateStyle(tilt(index + pr.number, 1.5))}>
      <a
        className={`lid-slap ${merged ? `lid-c-${color}` : "lid-c-clear"}`}
        href={pr.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("oss_link", { item: `${pr.repo}#${pr.number}`, ...linkParams(pr.href) })}
      >
        <span className="lid-slap-num">#{pr.number}</span>
        <span className="lid-slap-title">{pr.title}</span>
        <span className="lid-sr">{merged ? " (merged)" : " (in review)"}</span>
      </a>
    </li>
  );
}

export function LidOpenSource() {
  const groups = groupByRepo(openSource);
  const merged = openSource.filter((pr) => pr.state === "merged").length;
  const review = openSource.length - merged;

  return (
    <section
      id="open-source"
      className="lid-section lid-oss"
      data-analytics-section="open-source"
      aria-labelledby="lid-oss-title"
    >
      <LidSectionHead
        id="lid-oss-title"
        title={sections.openSource.title}
        intro={sections.openSource.intro}
        rotate={-1.5}
      />
      <p className="lid-oss-key">
        <span className="lid-key lid-c-green">Merged: {merged}</span>
        <span className="lid-key lid-c-clear">In review: {review}</span>
      </p>
      <ul className="lid-repos">
        {groups.map((group, groupIndex) => {
          const headingId = `lid-repo-${groupIndex}`;
          return (
            <li key={group.repo} className={`lid-repo${group.prs.length > 3 ? " lid-repo--big" : ""}`}>
              <h3 id={headingId} className="lid-repo-tag" style={rotateStyle(tilt(groupIndex, 0.8))}>
                {group.repo}
              </h3>
              <ul className="lid-slaps" aria-labelledby={headingId}>
                {group.prs.map((pr, index) => (
                  <SlapTag
                    key={pr.href}
                    pr={pr}
                    index={index}
                    color={MERGED_COLORS[(groupIndex + index) % MERGED_COLORS.length]}
                  />
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function LidArchive() {
  const [active, setActive] = useState(0);
  const current = projectArchive[active] ?? projectArchive[0];

  return (
    <section className="lid-section lid-archive" data-analytics-section="archive" aria-labelledby="lid-archive-title">
      <LidSectionHead id="lid-archive-title" title={sections.archive.title} intro={sections.archive.intro} rotate={2} />
      <ul className="lid-archive-strip">
        {projectArchive.map(([title, line, href], index) => (
          <li key={href} style={rotateStyle(tilt(index + 2, 1.4))}>
            <a
              className={`lid-stk lid-lift lid-mini lid-c-${MERGED_COLORS[(index + 2) % MERGED_COLORS.length]}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => track("archive_link", { item: title, ...linkParams(href) })}
            >
              <span className="lid-mini-title">{title}</span>
              <span className="lid-mini-line">{line}</span>
            </a>
          </li>
        ))}
      </ul>
      {current ? (
        <p className="lid-archive-readout" aria-hidden="true">
          <span className="lid-archive-readout-title">{current[0]}</span>
          <span>{current[1]}</span>
        </p>
      ) : null}
    </section>
  );
}

export function LidPlay() {
  return (
    <section className="lid-section lid-play" data-analytics-section="play" aria-labelledby="lid-play-title">
      <Link
        href="/play"
        className="lid-stk lid-lift lid-c-ink lid-play-card"
        style={rotateStyle(-2.5)}
        onClick={() => track("cta_click", { cta: "play", section: "play" })}
      >
        <svg className="lid-play-art" viewBox="0 0 220 132" aria-hidden="true" focusable="false">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={8 + col * 34 + (row % 2) * 6}
                y={8 + row * 16}
                width={30}
                height={12}
                rx={2}
                className={`lid-brick lid-brick--${(row + col) % 4}`}
                opacity={row === 3 && col > 1 && col < 4 ? 0 : 1}
              />
            )),
          )}
          <circle cx={118} cy={92} r={6} className="lid-ball" />
          <rect x={88} y={116} width={64} height={8} rx={4} className="lid-paddle" />
        </svg>
        <span className="lid-play-text">
          <span id="lid-play-title" className="lid-play-title" role="heading" aria-level={2}>
            {sections.play.title}
          </span>
          <span className="lid-play-intro">{sections.play.intro}</span>
          <span className="lid-play-cta">
            Play the game
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.5} />
          </span>
        </span>
      </Link>
    </section>
  );
}
