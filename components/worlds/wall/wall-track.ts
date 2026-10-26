import { track } from "@/lib/analytics";
import { linkEventParams } from "@/lib/analytics-helpers";

/** `link_domain` + `link_url` for link events. Relative paths keep the site host. */
export function linkParams(href: string): { link_domain: string; link_url: string } {
  return linkEventParams(href);
}

export function trackCaseLink(caseTitle: string, href: string): void {
  track("case_link", { case_title: caseTitle, ...linkParams(href) });
}

export function trackOutbound(href: string, text: string, section: string): void {
  track("outbound_click", { ...linkParams(href), link_text: text, section });
}

export function trackNav(href: string, text: string, nav: string, section: string): void {
  track("nav_click", { link_url: href, link_text: text, nav, section });
}
