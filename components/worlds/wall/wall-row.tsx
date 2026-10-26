"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { WallCard, type WallTitle } from "./wall-card";

interface WallRowShellProps {
  id: string;
  title: string;
  intro: string;
  /** Label for the list, for screen readers. */
  listLabel: string;
  /** True when the list has no focusable cards; the scroller then takes focus. */
  isStatic?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLUListElement>) => void;
  children: ReactNode;
  after?: ReactNode;
}

const SCROLL_STEP = 0.82;

/** Section, heading, scroll-snap list and prev/next buttons. Shared by every row. */
export function WallRowShell({ id, title, intro, listLabel, isStatic, onKeyDown, children, after }: WallRowShellProps) {
  const headingId = useId();
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const trackedRef = useRef(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const max = list.scrollWidth - list.clientWidth;
      setEdges({ start: list.scrollLeft <= 2, end: list.scrollLeft >= max - 2 });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    list.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", measure);
    };
  }, []);

  const onScroll = () => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    track("row_scroll", { section: id });
  };

  const step = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * list.clientWidth * SCROLL_STEP, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="wall-row" id={id} aria-labelledby={headingId} data-analytics-section={id}>
      <div className="wall-row-head">
        <h2 id={headingId} className="wall-row-title">
          {title}
        </h2>
        <p className="wall-row-intro">{intro}</p>
        <div className="wall-row-nav">
          <button
            type="button"
            className="wall-row-step"
            aria-controls={listId}
            aria-label={`Show previous titles in ${title}`}
            disabled={edges.start}
            onClick={() => step(-1)}
          >
            <ChevronLeft aria-hidden="true" size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="wall-row-step"
            aria-controls={listId}
            aria-label={`Show next titles in ${title}`}
            disabled={edges.end}
            onClick={() => step(1)}
          >
            <ChevronRight aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
      <ul
        className="wall-row-list"
        id={listId}
        ref={listRef}
        aria-label={listLabel}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        {...(isStatic ? { tabIndex: 0 } : {})}
      >
        {children}
      </ul>
      {after}
    </section>
  );
}

/** Props an inline panel gets from its row. */
export interface WallPanelProps {
  id: string;
  onClose: () => void;
}

interface WallRowProps {
  id: string;
  title: string;
  intro: string;
  items: readonly WallTitle[];
  /** Renders the inline panel for an open card. */
  renderPanel?: (panelKey: string, panel: WallPanelProps) => ReactNode;
  /** Shows rank numerals 1, 2, 3 beside the cards, like a top-titles row. */
  isRanked?: boolean;
}

/** A row of title cards with roving focus and an inline detail panel. */
export function WallRow({ id, title, intro, items, renderPanel, isRanked }: WallRowProps) {
  const panelId = useId();
  const [focusIndex, setFocusIndex] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const onActivate = (item: WallTitle) => {
    if (item.action.kind !== "panel") return;
    const { panelKey, onOpen } = item.action;
    if (openKey === panelKey) {
      setOpenKey(null);
      return;
    }
    setOpenKey(panelKey);
    onOpen?.();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const cards = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-card]"));
    const current = cards.findIndex((card) => card === document.activeElement);
    if (current === -1) return;
    event.preventDefault();
    const last = cards.length - 1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : Math.min(last, Math.max(0, current + (event.key === "ArrowRight" ? 1 : -1)));
    const target = cards[next];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
  };

  const closePanel = () => {
    const key = openKey;
    setOpenKey(null);
    const index = items.findIndex((item) => item.action.kind === "panel" && item.action.panelKey === key);
    const card = document.getElementById(panelId)?.closest("section")?.querySelectorAll<HTMLElement>("[data-card]")[index];
    card?.focus();
  };

  return (
    <WallRowShell
      id={id}
      title={title}
      intro={intro}
      listLabel={`${title} titles`}
      onKeyDown={onKeyDown}
      after={openKey && renderPanel ? renderPanel(openKey, { id: panelId, onClose: closePanel }) : null}
    >
      {items.map((item, index) => (
        <li
          key={item.key}
          className={`wall-row-item${item.wide ? " wall-row-item--wide" : ""}${isRanked ? " wall-row-item--ranked" : ""}`}
        >
          {isRanked ? (
            <span className="wall-rank" aria-hidden="true">
              {index + 1}
            </span>
          ) : null}
          <WallCard
            item={item}
            index={index}
            isTabStop={index === focusIndex}
            isExpanded={item.action.kind === "panel" && item.action.panelKey === openKey}
            panelId={panelId}
            onActivate={onActivate}
            onFocusCard={setFocusIndex}
          />
        </li>
      ))}
    </WallRowShell>
  );
}
