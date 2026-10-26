import Link from "next/link";
import { availability, profile } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { linkParams } from "./lid-layout";

type FooterLink = { readonly label: string; readonly href: string; readonly kind: "route" | "file" | "out" };

const LINKS: readonly FooterLink[] = [
  { label: "Writing", href: "/writing", kind: "route" },
  { label: "About", href: "/about", kind: "route" },
  { label: "Contact", href: "/contact", kind: "route" },
  { label: "API docs", href: "/docs", kind: "route" },
  { label: "llms.txt", href: "/llms.txt", kind: "file" },
  { label: "Privacy", href: "/privacy-policy", kind: "route" },
  { label: "GitHub", href: profile.github, kind: "out" },
  { label: "LinkedIn", href: profile.linkedin, kind: "out" },
  { label: "X", href: profile.x, kind: "out" },
  { label: "Résumé", href: profile.resume, kind: "out" },
  { label: "Email", href: `mailto:${profile.email}`, kind: "out" },
];

function onOut(link: FooterLink) {
  track("outbound_click", { ...linkParams(link.href), link_text: link.label, section: "footer" });
}

export function LidFooter() {
  return (
    <footer className="lid-footer">
      <p className="lid-footer-name">
        {profile.name} <span>{profile.location}</span>
      </p>
      <p className="lid-footer-status">
        {availability.status}. {availability.reply}.
      </p>
      <nav aria-label="Footer">
        <ul className="lid-footer-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              {link.kind === "route" ? (
                <Link href={link.href}>{link.label}</Link>
              ) : link.kind === "file" ? (
                <a href={link.href}>{link.label}</a>
              ) : (
                <a
                  href={link.href}
                  {...(link.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  onClick={() => onOut(link)}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
