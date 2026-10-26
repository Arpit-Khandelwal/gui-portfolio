"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import {
  community,
  engagementGet,
  engagementTerms,
  experience,
  faqs,
  openSource,
  projectArchive,
  sprintSteps,
  workedWith,
} from "@/components/portfolio/data";
import { worldCopy } from "@/lib/world-copy";
import { track } from "@/lib/analytics";
import { linkParams } from "./link-params";

const copy = worldCopy.canon.sections;

interface SectionHeadProps {
  id: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
}

function SectionHead({ id, title, intro, children }: SectionHeadProps) {
  return (
    <header className="c-section-head">
      <h2 id={id} className="c-h2">
        {title}
      </h2>
      <p className="c-intro-text">{intro}</p>
      {children}
    </header>
  );
}

const mergedCount = openSource.filter((item) => item.state === "merged").length;
const reviewCount = openSource.length - mergedCount;

export function CanonOpenSource() {
  return (
    <section id="open-source" className="c-shell c-section" aria-labelledby="c-oss" data-analytics-section="open-source">
      <SectionHead id="c-oss" title={copy.openSource.title} intro={copy.openSource.intro}>
        <p className="c-oss-count">
          <span className="c-num">{mergedCount}</span> merged <span aria-hidden="true">·</span>{" "}
          <span className="c-num">{reviewCount}</span> in review
        </p>
      </SectionHead>
      <table className="c-oss">
        <caption className="c-sr">Pull requests to other projects</caption>
        <thead>
          <tr>
            <th scope="col">Repository</th>
            <th scope="col" className="c-oss-num">
              PR
            </th>
            <th scope="col">Change</th>
            <th scope="col">State</th>
          </tr>
        </thead>
        <tbody>
          {openSource.map((item) => (
            <tr key={item.href} data-state={item.state}>
              <td className="c-oss-repo">{item.repo}</td>
              <td className="c-oss-num">#{item.number}</td>
              <td className="c-oss-title">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("oss_link", { item: `${item.repo}#${item.number}`, ...linkParams(item.href) })
                  }
                >
                  {item.title}
                </a>
              </td>
              <td className="c-oss-state">
                <span className="c-state-dot" aria-hidden="true" />
                {item.state === "merged" ? "Merged" : "In review"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function CanonAbout() {
  return (
    <section id="about" className="c-shell c-section" aria-labelledby="c-about" data-analytics-section="about">
      <SectionHead id="c-about" title={copy.about.title} intro={copy.about.intro} />
      <ol className="c-rows">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}`} className="c-row">
            <p className="c-row-when">{job.period}</p>
            <div>
              <h3 className="c-row-title">{job.company}</h3>
              <p className="c-row-sub">{job.title}</p>
            </div>
            <p className="c-row-text">{job.text}</p>
          </li>
        ))}
      </ol>
      <div className="c-pair">
        <div>
          <h3 className="c-h3">Community</h3>
          <ul className="c-plain-list">
            {community.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="c-h3">Worked with</h3>
          <ul className="c-plain-list">
            {workedWith.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CanonProcess() {
  return (
    <>
      <section id="process" className="c-shell c-section" aria-labelledby="c-process" data-analytics-section="process">
        <SectionHead id="c-process" title={copy.process.title} intro={copy.process.intro} />
        <ol className="c-steps">
          {sprintSteps.map((step) => (
            <li key={step.title} className="c-step">
              <h3 className="c-step-title">{step.title}</h3>
              <p className="c-step-when">{step.label}</p>
              <p className="c-step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="terms" className="c-shell c-section c-section-tight" aria-labelledby="c-terms" data-analytics-section="terms">
        <SectionHead id="c-terms" title={copy.terms.title} intro={copy.terms.intro} />
        <div className="c-pair c-pair-terms">
          <dl className="c-terms">
            {engagementTerms.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="c-h3">What you get</h3>
            <ul className="c-proof c-proof-lg">
              {engagementGet.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export function CanonFaq() {
  return (
    <section id="faq" className="c-shell c-section" aria-labelledby="c-faq" data-analytics-section="faq">
      <SectionHead id="c-faq" title={copy.faq.title} intro={copy.faq.intro} />
      <div className="c-faqs">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="c-faq"
            onToggle={(event) => {
              if (event.currentTarget.open) track("faq_open", { item: faq.q });
            }}
          >
            <summary>
              <span>{faq.q}</span>
              <Plus className="c-plus" size={18} strokeWidth={1.75} aria-hidden="true" />
            </summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CanonArchive() {
  return (
    <section id="archive" className="c-shell c-section" aria-labelledby="c-archive" data-analytics-section="archive">
      <SectionHead id="c-archive" title={copy.archive.title} intro={copy.archive.intro} />
      <ul className="c-archive">
        {projectArchive.map(([title, text, href]) => (
          <li key={title}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("archive_link", { item: title, ...linkParams(href) })}
            >
              <span className="c-archive-title">
                {title}
                <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="c-archive-text">{text}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CanonPlay() {
  return (
    <section className="c-shell c-section c-section-tight" aria-labelledby="c-play" data-analytics-section="play">
      <div className="c-play">
        <div>
          <h2 id="c-play" className="c-h3 c-play-title">
            {copy.play.title}
          </h2>
          <p className="c-play-text">{copy.play.intro}</p>
        </div>
        <Link href="/play" className="c-open c-play-link" onClick={() => track("cta_click", { cta: "play", section: "play" })}>
          Play the game
          <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
