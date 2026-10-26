"use client";

import { Plus } from "lucide-react";
import type { SyntheticEvent } from "react";
import {
  community,
  engagementGet,
  engagementTerms,
  experience,
  faqs,
  profile,
  sprintSteps,
  workedWith,
} from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";
import { rotateStyle, tilt } from "./lid-layout";
import { LidSectionHead } from "./lid-section-head";
import { DieCut } from "./lid-shapes";

const sections = worldCopy.lid.sections;
const STEP_COLORS = ["yellow", "blue", "green", "orange"] as const;
const BADGE_COLORS = ["orange", "blue", "green", "ink"] as const;

/** The sprint as a run of arrow stickers stuck on the lid, one per step. */
export function LidProcess() {
  return (
    <section className="lid-section lid-process" data-analytics-section="process" aria-labelledby="lid-process-title">
      <LidSectionHead id="lid-process-title" title={sections.process.title} intro={sections.process.intro} rotate={-1.5} />
      <ol className="lid-steps">
        {sprintSteps.map((step, index) => (
          <li
            key={step.title}
            className={`lid-step lid-shape--chevron lid-c-${STEP_COLORS[index % STEP_COLORS.length]}`}
            style={rotateStyle(tilt(index + 1, 0.5))}
          >
            <DieCut shape="chevron" />
            <span className="lid-step-title">{step.title}</span>
            <span className="lid-step-text">{step.text}</span>
            <span className="lid-step-when">{step.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The terms as one printed spec label, taped to the lid. */
export function LidTerms() {
  return (
    <section className="lid-section lid-terms" data-analytics-section="terms" aria-labelledby="lid-terms-title">
      <LidSectionHead id="lid-terms-title" title={sections.terms.title} intro={sections.terms.intro} rotate={1} />
      <div className="lid-spec" style={rotateStyle(-1.2)}>
        <dl className="lid-spec-rows">
          {engagementTerms.map(([term, text]) => (
            <div key={term} className="lid-spec-row">
              <dt>{term}</dt>
              <dd>{text}</dd>
            </div>
          ))}
          <div className="lid-spec-row">
            <dt>You get</dt>
            <dd>
              <ul className="lid-spec-list">
                {engagementGet.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}


/** Experience as a stack of conference badges, plus community ribbons. */
export function LidAbout() {
  return (
    <section className="lid-section lid-about" data-analytics-section="about" aria-labelledby="lid-about-title">
      <LidSectionHead id="lid-about-title" title={sections.about.title} intro={sections.about.intro} rotate={-1} />
      <ul className="lid-badges">
        {experience.map((job, index) => (
          <li
            key={`${job.company}-${job.period}`}
            className={`lid-conf lid-conf--${BADGE_COLORS[index % BADGE_COLORS.length]}`}
            style={rotateStyle(tilt(index + 1, 0.7))}
          >
            <span className="lid-conf-hole" aria-hidden="true" />
            <span className="lid-conf-band">{job.period}</span>
            <span className="lid-conf-body">
              {index === 0 ? (
                // The GitHub avatar is the only remote image; next/image is not configured for it.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="lid-conf-photo" src={profile.avatar} alt="" width={72} height={72} loading="lazy" />
              ) : null}
              <span className="lid-conf-company">{job.company}</span>
              <span className="lid-conf-role">{job.title}</span>
              <span className="lid-conf-text">{job.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="lid-about-extra">
        <div className="lid-ribbons">
          <h3 className="lid-mini-head">Community</h3>
          <ul>
            {community.map((line, index) => (
              <li key={line} className="lid-ribbon" style={rotateStyle(tilt(index + 6, 0.5))}>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="lid-worked">
          <h3 className="lid-mini-head">Worked with</h3>
          <ul>
            {workedWith.map((name, index) => (
              <li key={name} className="lid-stk lid-stk--pill lid-c-white" style={rotateStyle(tilt(index, 0.6))}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function onFaqToggle(question: string) {
  return (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (event.currentTarget.open) track("faq_open", { item: question });
  };
}

/** FAQs as fold-over stickers. */
export function LidFaq() {
  return (
    <section className="lid-section lid-faq" data-analytics-section="faq" aria-labelledby="lid-faq-title">
      <LidSectionHead id="lid-faq-title" title={sections.faq.title} intro={sections.faq.intro} rotate={1.5} />
      <div className="lid-faq-list">
        {faqs.map((faq, index) => (
          <details
            key={faq.q}
            className={`lid-fold lid-c-${index % 2 === 0 ? "white" : "lilac"}`}
            style={rotateStyle(tilt(index + 3, 0.18))}
            onToggle={onFaqToggle(faq.q)}
          >
            <summary>
              <span>{faq.q}</span>
              <Plus className="lid-fold-icon" aria-hidden="true" size={22} strokeWidth={2.75} />
            </summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
