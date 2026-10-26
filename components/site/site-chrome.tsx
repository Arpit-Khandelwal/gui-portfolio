import Link from "next/link";
import { profile } from "@/components/portfolio/data";
import { WorldSwitcher } from "@/components/worlds/world-switcher";

const NAV: readonly { href: string; label: string }[] = [
  { href: "/", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/play", label: "Play" },
];

/** Header for every page outside the homepage. Takes its look from the active world. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>
      <Link href="/" className="site-mark">
        {profile.name}
      </Link>
      <nav aria-label="Primary" className="site-nav-links">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <WorldSwitcher />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        &copy; {new Date().getFullYear()} {profile.name} · {profile.location}
      </span>
      <span className="flex flex-wrap gap-x-5 gap-y-1">
        <Link href="/docs">API docs</Link>
        <a href="/llms.txt">llms.txt</a>
        <Link href="/privacy-policy">Privacy</Link>
        <a href={profile.github} rel="noreferrer" target="_blank">
          GitHub
        </a>
        <a href={profile.resume} rel="noreferrer" target="_blank">
          R&eacute;sum&eacute;
        </a>
      </span>
    </footer>
  );
}
