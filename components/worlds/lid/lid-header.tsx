import Link from "next/link";
import { profile } from "@/components/portfolio/data";
import { track } from "@/lib/analytics";
import { WorldSwitcher } from "../world-switcher";

type NavItem = { readonly label: string; readonly href: string; readonly route?: boolean };

const NAV: readonly NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Open source", href: "#open-source" },
  { label: "Brief", href: "#brief" },
  { label: "Writing", href: "/writing", route: true },
  { label: "Play", href: "/play", route: true },
];

function onNav(item: NavItem) {
  track("nav_click", { link_url: item.href, link_text: item.label, nav: "header", section: "header" });
}

export function LidHeader() {
  return (
    <header className="lid-header">
      <a className="lid-skip" href="#main">
        Skip to the content
      </a>
      <a className="lid-mark" href="#main" aria-label={`${profile.name}, go to the top`}>
        <span aria-hidden="true">{profile.name}</span>
      </a>
      <nav className="lid-nav" aria-label="Main">
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              {item.route ? (
                <Link href={item.href} onClick={() => onNav(item)}>
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} onClick={() => onNav(item)}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <WorldSwitcher current="lid" className="lid-switcher" />
    </header>
  );
}
