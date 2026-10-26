"use client";

import Link from "next/link";
import { profile, socials } from "@/components/portfolio/data";
import { WorldSwitcher } from "@/components/worlds/world-switcher";
import { AGENT_ENTRYPOINTS } from "@/lib/site";
import { trackNav, trackOutbound } from "./wall-track";

const NAV = [
  { href: "#shipped", label: "Shipped" },
  { href: "#experiments", label: "Experiments" },
  { href: "#open-source", label: "Open source" },
  { href: "#brief", label: "Brief" },
  { href: "/writing", label: "Writing" },
  { href: "/play", label: "Play" },
] as const;

export function WallHeader() {
  return (
    <header className="wall-header">
      <a className="wall-skip" href="#main">
        Skip to the titles
      </a>
      <h1 className="wall-mark">{profile.name}</h1>
      <nav className="wall-nav" aria-label="Main">
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              {item.href.startsWith("/") ? (
                <Link href={item.href} onClick={() => trackNav(item.href, item.label, "header", "header")}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} onClick={() => trackNav(item.href, item.label, "header", "header")}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <WorldSwitcher current="wall" className="wall-switcher" />
    </header>
  );
}

const SITE_LINKS = [
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: AGENT_ENTRYPOINTS.docs, label: "API docs" },
  { href: AGENT_ENTRYPOINTS.llmsTxt, label: "llms.txt" },
  { href: "/privacy-policy", label: "Privacy policy" },
] as const;

export function WallFooter() {
  const outbound = [
    ...socials.filter((social) => !social.href.startsWith("mailto:")),
    { label: "Résumé", href: profile.resume },
  ];
  return (
    <footer className="wall-footer" data-analytics-section="footer">
      <p className="wall-footer-mark">{profile.name}</p>
      <nav aria-label="Site">
        <ul className="wall-footer-links">
          {SITE_LINKS.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => trackNav(item.href, item.label, "footer", "footer")}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="wall-footer-links" aria-label="Elsewhere">
        {outbound.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutbound(item.href, item.label, "footer")}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <a href={`mailto:${profile.email}`} onClick={() => trackOutbound(`mailto:${profile.email}`, "Email", "footer")}>
            {profile.email}
          </a>
        </li>
      </ul>
      <p className="wall-footer-note">
        {profile.location}. {profile.role}
      </p>
    </footer>
  );
}
