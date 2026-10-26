"use client";

import { community, experience, workedWith } from "@/components/portfolio/data";
import { worldCopy } from "@/lib/world-copy";
import { WallRowShell } from "./wall-row";

const copy = worldCopy.wall.sections.about;

/**
 * Experience, community and past employers as static cards. They are not
 * titles, so they carry no hue and show all their text.
 */
export function WallAboutRow() {
  return (
    <WallRowShell id="about" title={copy.title} intro={copy.intro} listLabel={`${copy.title} cards`} isStatic>
      {experience.map((job) => (
        <li key={`${job.company}-${job.period}`} className="wall-row-item">
          <article className="wall-note">
            <h3 className="wall-note-title">{job.company}</h3>
            <p className="wall-note-sub">
              {job.title} · {job.period}
            </p>
            <p className="wall-note-text">{job.text}</p>
          </article>
        </li>
      ))}
      {community.map((line) => (
        <li key={line} className="wall-row-item">
          <article className="wall-note wall-note--quote">
            <p className="wall-note-text wall-note-text--large">{line}</p>
          </article>
        </li>
      ))}
      <li className="wall-row-item">
        <article className="wall-note">
          <h3 className="wall-note-title">Worked with</h3>
          <ul className="wall-note-list">
            {workedWith.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </article>
      </li>
    </WallRowShell>
  );
}
