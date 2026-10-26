"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { posterStyle } from "./poster";
import type { RepoGroup } from "./wall-titles";
import { linkParams } from "./wall-track";

interface WallRepoPanelProps {
  id: string;
  group: RepoGroup;
  onClose: () => void;
}

/** Every pull request to one repository, as an episode list under the row. */
export function WallRepoPanel({ id, group, onClose }: WallRepoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panelRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [group.repo]);

  const headingId = `${id}-heading`;

  return (
    <div className="wall-panel" id={id} ref={panelRef} role="region" aria-labelledby={headingId}>
      <div className="wall-panel-poster" style={posterStyle(group.repo) as CSSProperties} aria-hidden="true">
        <span className="wall-panel-poster-title">{group.name}</span>
      </div>
      <div className="wall-panel-body">
        <div className="wall-panel-head">
          <h3 id={headingId} className="wall-panel-title">
            {group.repo}
          </h3>
          <p className="wall-panel-sub">{group.summary}</p>
          <button type="button" className="wall-panel-close" onClick={onClose} aria-label={`Close ${group.repo}`}>
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
        <ol className="wall-pr-list">
          {group.prs.map((pr) => (
            <li key={pr.number}>
              <a
                className="wall-pr"
                href={pr.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("oss_link", { item: `${pr.repo}#${pr.number}`, ...linkParams(pr.href) })}
              >
                <span className="wall-pr-number">#{pr.number}</span>
                <span className="wall-pr-title">{pr.title}</span>
                <span className="wall-pr-state" data-state={pr.state}>
                  {pr.state === "merged" ? "Merged" : "In review"}
                </span>
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
