"use client";

import { useId } from "react";
import { engagementGet, engagementTerms, faqs, sprintSteps } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { worldCopy } from "@/lib/world-copy";

const copy = worldCopy.wall.sections;

/** The sprint, told as an episode guide: four episodes, then the terms. */
export function WallGuide() {
  const processId = useId();
  const termsId = useId();
  return (
    <>
      <section className="wall-block" id="process" aria-labelledby={processId} data-analytics-section="process">
        <div className="wall-block-head">
          <h2 id={processId} className="wall-row-title">
            {copy.process.title}
          </h2>
          <p className="wall-row-intro">{copy.process.intro}</p>
        </div>
        <ol className="wall-episodes">
          {sprintSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="wall-episode">
                <span className="wall-episode-number" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="wall-episode-title">{step.title}</h3>
                <p className="wall-episode-when">
                  <Icon aria-hidden="true" size={15} strokeWidth={2} />
                  {step.label}
                </p>
                <p className="wall-episode-text">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="wall-block" id="terms" aria-labelledby={termsId} data-analytics-section="terms">
        <div className="wall-block-head">
          <h2 id={termsId} className="wall-row-title">
            {copy.terms.title}
          </h2>
          <p className="wall-row-intro">{copy.terms.intro}</p>
        </div>
        <div className="wall-terms">
          <dl className="wall-terms-list">
            {engagementTerms.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <ul className="wall-terms-get">
            {engagementGet.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function WallFaq() {
  const headingId = useId();
  return (
    <section className="wall-block" id="faq" aria-labelledby={headingId} data-analytics-section="faq">
      <div className="wall-block-head">
        <h2 id={headingId} className="wall-row-title">
          {copy.faq.title}
        </h2>
        <p className="wall-row-intro">{copy.faq.intro}</p>
      </div>
      <div className="wall-faq">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="wall-faq-item"
            onToggle={(event) => {
              if (event.currentTarget.open) track("faq_open", { item: faq.q });
            }}
          >
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
