"use client";

import { useId, type CSSProperties, type FocusEvent, type ReactNode } from "react";
import { fitTitleSize, numeralSize, posterGlyph, posterLayout, posterStyle, type PosterLayout } from "./poster";

/** One title on the wall. A panel card opens an inline panel; a link card leaves. */
export interface WallTitle {
  key: string;
  title: string;
  /** Seeds the hue and the composition. Defaults to the title. */
  hueSeed?: string;
  /** Small line under the title (type, period, owner). Always visible. */
  foot: string;
  /** Large background glyph. Defaults to the first letter of the title. */
  glyph?: string;
  /** A headline number from the data ("50k+"). Switches to the numeral layout. */
  numeral?: string;
  /** Lead line in the reveal strip (credibility, PR title, description). */
  lead: string;
  /** Extra reveal lines (stack, parts). */
  details?: readonly { label: string; value: string }[];
  /** Small badge on the poster, for example a PR state. */
  badge?: { label: string; tone: "solid" | "outline" };
  wide?: boolean;
  action:
    | { kind: "panel"; panelKey: string; onOpen?: () => void }
    | { kind: "link"; href: string; external: boolean; onFollow?: () => void };
}

interface WallCardProps {
  item: WallTitle;
  index: number;
  isTabStop: boolean;
  isExpanded: boolean;
  panelId: string;
  onActivate: (item: WallTitle) => void;
  onFocusCard: (index: number) => void;
}

const WIDE_TITLE_BOX = { width: 86, height: 18, max: 10, min: 4 };
const RIBBON_REPEAT = 4;

function PosterArt({ item, layout }: { item: WallTitle; layout: PosterLayout }): ReactNode {
  if (layout === "numeral" && item.numeral) {
    return (
      <span className="wall-card-numeral" aria-hidden="true" style={{ fontSize: `${numeralSize(item.numeral)}cqw` }}>
        {item.numeral}
      </span>
    );
  }
  const glyph = item.glyph ?? posterGlyph(item.title);
  if (layout === "ribbon") {
    return (
      <span className="wall-card-ribbon" aria-hidden="true">
        {Array.from({ length: RIBBON_REPEAT }, () => item.title).join("  ·  ")}
      </span>
    );
  }
  if (layout === "split") {
    return (
      <span className="wall-card-split" aria-hidden="true">
        <span>{glyph}</span>
      </span>
    );
  }
  return (
    <span className="wall-card-glyph" aria-hidden="true">
      {glyph}
    </span>
  );
}

function PosterFace({ item, titleId, metaId }: { item: WallTitle; titleId: string; metaId: string }): ReactNode {
  const titleSize = fitTitleSize(item.title, item.wide ? WIDE_TITLE_BOX : undefined);
  const layout = posterLayout(item.hueSeed ?? item.title, item.numeral);
  return (
    <>
      <PosterArt item={item} layout={layout} />
      <span className="wall-card-title" id={titleId} style={{ fontSize: `${titleSize}cqi` }}>
        {item.title}
      </span>
      <span className="wall-card-foot">
        {item.badge ? (
          <span className="wall-card-badge" data-tone={item.badge.tone}>
            {item.badge.label}
          </span>
        ) : null}
        <span>{item.foot}</span>
      </span>
      <span className="wall-card-meta" id={metaId}>
        <span className="wall-card-lead">{item.lead}</span>
        {item.details?.map((detail) => (
          <span className="wall-card-detail" key={detail.label}>
            <span className="wall-card-detail-label">{detail.label}:</span> {detail.value}
          </span>
        ))}
      </span>
    </>
  );
}

export function WallCard({ item, index, isTabStop, isExpanded, panelId, onActivate, onFocusCard }: WallCardProps) {
  const titleId = useId();
  const metaId = useId();
  const seed = item.hueSeed ?? item.title;
  const style = posterStyle(seed) as CSSProperties;
  const common = {
    className: `wall-card${item.wide ? " wall-card--wide" : ""}`,
    style,
    tabIndex: isTabStop ? 0 : -1,
    "data-card": "",
    "data-layout": posterLayout(seed, item.numeral),
    "aria-labelledby": titleId,
    "aria-describedby": metaId,
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.target === event.currentTarget) onFocusCard(index);
    },
  };

  if (item.action.kind === "panel") {
    return (
      <button
        {...common}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => onActivate(item)}
      >
        <PosterFace item={item} titleId={titleId} metaId={metaId} />
      </button>
    );
  }

  const { href, external, onFollow } = item.action;
  return (
    <a
      {...common}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => onFollow?.()}
    >
      <PosterFace item={item} titleId={titleId} metaId={metaId} />
    </a>
  );
}
