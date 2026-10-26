import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { availability, buyerModes, profile, selectedWork } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import type { BriefState } from "../use-brief";
import { LidHeroSticker } from "./lid-hero-sticker";
import { ForYouDot } from "./lid-for-you";
import { HERO_SLOTS, heroLook, rotateStyle, tilt, type HeroLook, type HeroSlot } from "./lid-layout";

const copy = worldCopy.lid;
const AUDIENCE_COLORS = ["yellow", "green", "lilac", "blue"] as const;

function extraText(key: "badgeTop" | "badgeSub", fallback: string): string {
  const value: unknown = copy.extra[key];
  return typeof value === "string" ? value : fallback;
}

/**
 * Each slot is sized for the build that sits there by default. When the
 * reader's pick moves a build into another slot, it is fitted inside that
 * box and centred, so a tall shape never spills onto its neighbours.
 */
function fitSlot(slot: HeroSlot, index: number, look: HeroLook): HeroSlot {
  const home = selectedWork[index];
  const homeRatio = home ? heroLook(home.title, index).ratio : look.ratio;
  const height = slot.width / homeRatio;
  const width = Math.min(slot.width, height * look.ratio);
  return { ...slot, width, left: slot.left + (slot.width - width) / 2 };
}

/** The reader's builds go on top, the first pick highest. */
function stackSlot(slot: HeroSlot, featuredRank: number): HeroSlot {
  return featuredRank === -1 ? slot : { ...slot, z: 40 - featuredRank };
}

/** Splits "First Last" so the badge can stack the name. */
function nameParts(name: string): readonly [string, string] {
  const space = name.indexOf(" ");
  return space === -1 ? [name, ""] : [name.slice(0, space), name.slice(space + 1)];
}

interface LidHeroProps {
  brief: BriefState;
}

export function LidHero({ brief }: LidHeroProps) {
  const [first, last] = nameParts(profile.name);
  const builds = brief.orderedWork.slice(0, HERO_SLOTS.length);
  const groupRef = useRef<HTMLDivElement>(null);
  const [noteClosed, setNoteClosed] = useState(false);
  const inferred = brief.audienceSource === "referrer" || brief.audienceSource === "param";
  const cta = brief.buyer.cta;
  const external = /^https?:/.test(cta.href);

  const chooseAudience = (id: BriefState["buyerId"]) => {
    if (id === brief.buyerId) return;
    setNoteClosed(true);
    brief.setBuyerId(id);
  };

  const focusQuestion = () => {
    groupRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
  };

  return (
    <section className="lid-hero" aria-labelledby="lid-name" data-analytics-section="hero">
      <div className="lid-hero-badge-col">
        <div className="lid-badge" style={rotateStyle(-2)}>
          <div className="lid-badge-top" aria-hidden="true">
            <span className="lid-badge-hello">{extraText("badgeTop", "HELLO")}</span>
            <span className="lid-badge-sub">{extraText("badgeSub", "my name is")}</span>
          </div>
          <div className="lid-badge-body">
            <h1 id="lid-name" className="lid-badge-name">
              <span>{first}</span> <span className="lid-badge-last">{last}</span>
            </h1>
            <div className="lid-badge-pitch" aria-live="polite">
              <p className="lid-badge-promise">{brief.buyer.promise}</p>
              <p className="lid-badge-text">{brief.buyer.body}</p>
            </div>
          </div>
          <p className="lid-badge-foot">{availability.status}</p>
        </div>

        <div ref={groupRef} className="lid-audience" role="group" aria-labelledby="lid-audience-label">
          <span id="lid-audience-label" className="lid-audience-label">
            What brings you here?
          </span>
          {buyerModes.map((mode, index) => (
            <button
              key={mode.id}
              type="button"
              className={`lid-stk lid-stk--pill lid-c-${AUDIENCE_COLORS[index % AUDIENCE_COLORS.length]} lid-audience-option`}
              style={rotateStyle(tilt(index + 3, 0.8))}
              aria-pressed={brief.buyerId === mode.id}
              onClick={() => chooseAudience(mode.id)}
            >
              {mode.ask}
            </button>
          ))}
        </div>

        {inferred && !noteClosed ? (
          <p className="lid-note lid-slap-in" role="note">
            <span>
              {brief.audienceSource === "referrer"
                ? "Picked for you because you came from LinkedIn."
                : "Picked from your link."}
            </span>
            <button type="button" className="lid-note-btn" onClick={focusQuestion}>
              Change
            </button>
            <button
              type="button"
              className="lid-note-close"
              aria-label="Close the note"
              onClick={() => setNoteClosed(true)}
            >
              <X aria-hidden="true" size={16} strokeWidth={2.75} />
            </button>
          </p>
        ) : null}

        <div className="lid-hero-actions">
          <a
            key={brief.buyerId}
            className="lid-stk lid-stk--circle lid-c-yellow lid-send lid-slap-in"
            href={cta.href}
            style={rotateStyle(8)}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            onClick={() => track("cta_click", { cta: external ? "resume" : "brief", section: "hero" })}
          >
            <span>{cta.label}</span>
            {external ? (
              <ArrowUpRight aria-hidden="true" size={22} strokeWidth={2.5} />
            ) : (
              <ArrowDown aria-hidden="true" size={22} strokeWidth={2.5} />
            )}
          </a>
          <div className="lid-hero-side">
            {cta.href !== "#brief" ? (
              <a
                className="lid-stk lid-stk--pill lid-c-white lid-second"
                href="#brief"
                style={rotateStyle(-2)}
                onClick={() => track("cta_click", { cta: "brief", section: "hero" })}
              >
                Or send a brief
                <ArrowDown aria-hidden="true" size={16} strokeWidth={2.75} />
              </a>
            ) : null}
            <p className="lid-stk lid-stk--pill lid-c-green lid-status" style={rotateStyle(-3)}>
              <span className="lid-status-dot" aria-hidden="true" />
              {availability.reply}
            </p>
          </div>
        </div>
      </div>

      <div className="lid-pile">
        <p className="lid-why lid-why--hero" aria-live="polite">
          <ForYouDot slapKey={brief.buyerId} />
          <span>{brief.buyer.why}</span>
        </p>
      <ul className="lid-cluster" aria-label="Builds on the lid. Flip a sticker to read it.">
        {builds.map((study, index) => (
          <LidHeroSticker
            key={study.title}
            study={study}
            look={heroLook(study.title, index)}
            slot={stackSlot(
              fitSlot(HERO_SLOTS[index], index, heroLook(study.title, index)),
              brief.buyer.featured.indexOf(study.title),
            )}
            featured={brief.isFeatured(study.title)}
            readerKey={brief.buyerId}
          />
        ))}
      </ul>
      </div>
    </section>
  );
}
