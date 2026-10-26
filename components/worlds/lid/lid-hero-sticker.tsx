"use client";

import { useId, type CSSProperties } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import type { CaseStudy } from "@/components/portfolio/types";
import { track } from "@/lib/analytics";
import { caseAnchor, useFlip } from "./lid-flip";
import type { HeroLook, HeroSlot } from "./lid-layout";
import { DieCut } from "./lid-shapes";

interface LidHeroStickerProps {
  study: CaseStudy;
  look: HeroLook;
  slot: HeroSlot;
}

/**
 * A build on the lid: its own die-cut silhouette with the build's proof on the
 * front. It flips to a short back that points to the full case below.
 */
export function LidHeroSticker({ study, look, slot }: LidHeroStickerProps) {
  const { flipped, frontRef, backFocusRef, flip, onKeyDown } = useFlip(study.title);
  const backId = useId();
  const anchor = caseAnchor(study.title);

  const style = {
    "--r": slot.rotate,
    "--x": slot.left,
    "--y": slot.top,
    "--w": slot.width,
    "--z": slot.z,
    "--ratio": look.ratio,
  } as CSSProperties;

  return (
    <li
      className={`lid-hs lid-shape--${look.shape} lid-c-${look.color}`}
      data-flipped={flipped || undefined}
      style={style}
      onKeyDown={onKeyDown}
    >
      <div className="lid-flip">
        <button
          ref={frontRef}
          type="button"
          className="lid-face lid-face--front"
          aria-expanded={flipped}
          aria-controls={backId}
          inert={flipped}
          onClick={() => flip(true)}
        >
          <DieCut shape={look.shape} />
          <span className="lid-hs-body">
            <span className="lid-hs-title">{study.title}</span>
            <span className="lid-hs-proof">{study.credibility}</span>
          </span>
        </button>
        <div id={backId} className="lid-face lid-face--back" inert={!flipped}>
          <DieCut shape={look.shape} />
          <div className="lid-hs-body">
            <p
              ref={(node) => {
                backFocusRef.current = node;
              }}
              tabIndex={-1} className="lid-hs-back-title">
              {study.type}
            </p>
            <p className="lid-hs-period">{study.period}</p>
            <span className="lid-hs-actions">
              <a
                className="lid-hs-link"
                href={`#${anchor}`}
                onClick={() => track("cta_click", { cta: "read_case", section: "hero" })}
              >
                Read the case
                <ArrowDown aria-hidden="true" size={14} strokeWidth={2.75} />
              </a>
              <button type="button" className="lid-hs-back-btn" aria-label="Flip back" onClick={() => flip(false)}>
                <RotateCcw aria-hidden="true" size={15} strokeWidth={2.75} />
              </button>
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
