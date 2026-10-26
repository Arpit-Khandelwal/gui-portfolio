"use client";

import Link from "next/link";
import { availability, profile } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { linkParams } from "./link-params";

const SITE_LINKS = [
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Docs", href: "/docs" },
  { label: "Privacy", href: "/privacy-policy" },
] as const;

const ELSEWHERE = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "X", href: profile.x },
  { label: "Résumé", href: profile.resume },
] as const;

export function CanonFooter() {
  return (
    <footer className="c-footer">
      <div className="c-shell c-footer-inner">
        <div className="c-footer-id">
          <p className="c-footer-name">{profile.name}</p>
          <p className="c-footer-role">{profile.role}</p>
          <p className="c-footer-role">
            {profile.location} <span aria-hidden="true">·</span> {availability.reply}.
          </p>
          <a className="c-footer-mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>

        <nav className="c-footer-col" aria-labelledby="c-foot-site">
          <h2 id="c-foot-site" className="c-footer-head">
            Site
          </h2>
          <ul>
            {SITE_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a href="/llms.txt">llms.txt</a>
            </li>
          </ul>
        </nav>

        <nav className="c-footer-col" aria-labelledby="c-foot-out">
          <h2 id="c-foot-out" className="c-footer-head">
            Elsewhere
          </h2>
          <ul>
            {ELSEWHERE.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("outbound_click", { ...linkParams(item.href), link_text: item.label, section: "footer" })}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
