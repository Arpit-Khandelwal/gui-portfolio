import { ArrowDown } from "lucide-react";
import { availability, buyerModes, profile, selectedWork } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import type { BriefState } from "../use-brief";
import { LidHeroSticker } from "./lid-hero-sticker";
import { HERO_SLOTS, heroLook, rotateStyle, tilt } from "./lid-layout";

const copy = worldCopy.lid;
const AUDIENCE_COLORS = ["yellow", "green", "lilac", "blue"] as const;

function extraText(key: "badgeTop" | "badgeSub", fallback: string): string {
  const value: unknown = copy.extra[key];
  return typeof value === "string" ? value : fallback;
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
  const builds = selectedWork.slice(0, HERO_SLOTS.length);

  const chooseAudience = (id: BriefState["buyerId"]) => {
    if (id === brief.buyerId) return;
    brief.setBuyerId(id);
    track("audience_select", { audience: id });
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

        <div className="lid-audience" role="group" aria-labelledby="lid-audience-label">
          <span id="lid-audience-label" className="lid-audience-label">
            I am a
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
              {mode.label}
            </button>
          ))}
        </div>

        <div className="lid-hero-actions">
          <a
            className="lid-stk lid-stk--circle lid-c-yellow lid-send"
            href="#brief"
            style={rotateStyle(8)}
            onClick={() => track("cta_click", { cta: "brief", section: "hero" })}
          >
            <span>Send a brief</span>
            <ArrowDown aria-hidden="true" size={22} strokeWidth={2.5} />
          </a>
          <p className="lid-stk lid-stk--pill lid-c-green lid-status" style={rotateStyle(-3)}>
            <span className="lid-status-dot" aria-hidden="true" />
            {availability.reply}
          </p>
        </div>
      </div>

      <ul className="lid-cluster" aria-label="Builds on the lid. Flip a sticker to read it.">
        {builds.map((study, index) => (
          <LidHeroSticker
            key={study.title}
            study={study}
            look={heroLook(study.title, index)}
            slot={HERO_SLOTS[index]}
          />
        ))}
      </ul>
    </section>
  );
}
