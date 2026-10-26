/**
 * DOM wiring for site-wide tracking. Each `attach*` adds passive listeners or
 * observers and returns a cleanup. Nothing here writes to the DOM or reads
 * layout outside a requestAnimationFrame, so none of it can cause layout
 * thrash. No form values, names, emails or message text are ever read.
 */
import { track, type AnalyticsEventName, type AnalyticsParams } from "@/lib/analytics";
import {
  classifyLink,
  cleanLinkText,
  ENGAGED_MILESTONES,
  newMilestones,
  POST_READ_MILESTONES,
  readProgress,
  SCROLL_MILESTONES,
  scrollPercent,
} from "@/lib/analytics-helpers";

type Cleanup = () => void;

/** The analytics section an element sits in: an explicit tag, else the enclosing section's id. */
export function sectionFor(node: Node | null): string | undefined {
  const element = node instanceof Element ? node : node?.parentElement;
  if (!element) return undefined;
  const tagged = element.closest<HTMLElement>("[data-analytics-section]");
  if (tagged?.dataset.analyticsSection) return tagged.dataset.analyticsSection;
  return element.closest("section[id]")?.id || undefined;
}

type LinkEvent = { readonly name: AnalyticsEventName; readonly params: AnalyticsParams };

function linkEventFor(anchor: HTMLAnchorElement): LinkEvent | null {
  const link = classifyLink(anchor.href, window.location.href);
  const section = sectionFor(anchor);
  const linkText = cleanLinkText(anchor.getAttribute("aria-label") ?? anchor.textContent);

  if (link.kind === "email") return { name: "cta_click", params: { cta: "email", section } };
  if (link.kind === "phone") return { name: "cta_click", params: { cta: "phone", section } };
  if (link.kind === "outbound") {
    return {
      name: "outbound_click",
      params: { link_domain: link.domain, link_url: link.url, link_text: linkText, section },
    };
  }
  if (link.kind === "internal") {
    const nav = anchor.closest("nav");
    if (!nav) return null;
    return {
      name: "nav_click",
      params: { link_url: link.path, link_text: linkText, nav: nav.getAttribute("aria-label") ?? undefined, section },
    };
  }
  return null;
}

function onLinkActivate(event: MouseEvent): void {
  // Left click, or middle click via auxclick; right clicks open a menu, not the link.
  if (event.button !== 0 && event.button !== 1) return;
  const anchor = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
  if (!anchor) return;
  const linkEvent = linkEventFor(anchor);
  if (!linkEvent) return;

  // This listener runs in the capture phase, before React's own click
  // handlers. Some components send the same event with richer params; if one
  // did during this click, the site-wide copy is dropped so nothing counts twice.
  const before = window.dataLayer?.length ?? 0;
  setTimeout(() => {
    const pushedSince = window.dataLayer?.slice(before) ?? [];
    if (pushedSince.some((entry) => entry.event === linkEvent.name)) return;
    track(linkEvent.name, linkEvent.params);
  }, 0);
}

/** outbound_click, nav_click and mailto/tel cta_click, from one delegated listener. */
export function attachLinkTracking(): Cleanup {
  const options = { capture: true, passive: true } as const;
  document.addEventListener("click", onLinkActivate, options);
  document.addEventListener("auxclick", onLinkActivate, options);
  return () => {
    document.removeEventListener("click", onLinkActivate, options);
    document.removeEventListener("auxclick", onLinkActivate, options);
  };
}

/** `copy` with the section the selection started in. The copied text is never read. */
export function attachCopyTracking(): Cleanup {
  const onCopy = () => {
    track("copy", { section: sectionFor(document.getSelection()?.anchorNode ?? null) });
  };
  document.addEventListener("copy", onCopy, { passive: true });
  return () => document.removeEventListener("copy", onCopy);
}

/**
 * `scroll_depth` at 25/50/75/90/100% once per page view, and `post_read` at
 * 50/100% of a writing post's body. Scroll events only schedule a single
 * rAF; the read happens there, once per frame at most.
 */
export function attachScrollTracking(postSlug: string | null): Cleanup {
  const depthSent = new Set<number>();
  const readSent = new Set<number>();
  const article = postSlug ? document.querySelector<HTMLElement>("article .writing-body") : null;
  let frame = 0;

  const check = () => {
    frame = 0;
    const root = document.documentElement;
    const percent = scrollPercent(window.scrollY, window.innerHeight, root.scrollHeight);
    if (percent !== null) {
      for (const milestone of newMilestones(percent, SCROLL_MILESTONES, depthSent)) {
        depthSent.add(milestone);
        track("scroll_depth", { percent: milestone });
      }
    }
    if (article && postSlug) {
      const rect = article.getBoundingClientRect();
      const progress = readProgress(rect.top, rect.height, window.innerHeight);
      for (const milestone of newMilestones(progress, POST_READ_MILESTONES, readSent)) {
        readSent.add(milestone);
        track("post_read", { slug: postSlug, percent: milestone });
      }
    }
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (frame) cancelAnimationFrame(frame);
  };
}

/** Elements this taller than the viewport count as seen once they fill half of it. */
const SECTION_VISIBLE_SHARE = 0.5;

/**
 * `section_view` the first time each `[data-analytics-section]` element is at
 * least half visible (or, for sections taller than the viewport, fills at
 * least half the viewport). Once per section per page view.
 */
export function attachSectionViews(): Cleanup {
  const targets = document.querySelectorAll<HTMLElement>("[data-analytics-section]");
  if (targets.length === 0 || typeof IntersectionObserver === "undefined") return () => {};

  const seen = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const viewport = entry.rootBounds?.height ?? window.innerHeight;
        const visible =
          entry.intersectionRatio >= SECTION_VISIBLE_SHARE ||
          entry.intersectionRect.height >= viewport * SECTION_VISIBLE_SHARE;
        if (!visible) continue;

        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        const section = element.dataset.analyticsSection;
        if (!section || seen.has(section)) continue;
        seen.add(section);
        track("section_view", { section });
      }
    },
    { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
  );

  targets.forEach((target) => observer.observe(target));
  return () => observer.disconnect();
}

/**
 * `page_engaged` at 30/60/180 seconds of visible time on one page. Time in a
 * background tab does not count: the clock pauses on visibilitychange.
 */
export function attachEngagedTime(): Cleanup {
  const sent = new Set<number>();
  let accumulated = 0;
  let visibleSince: number | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const elapsed = () => accumulated + (visibleSince === null ? 0 : performance.now() - visibleSince);

  const schedule = () => {
    clearTimeout(timer);
    const next = ENGAGED_MILESTONES.find((seconds) => !sent.has(seconds));
    if (next === undefined || visibleSince === null) return;
    timer = setTimeout(fire, Math.max(0, next * 1000 - elapsed()));
  };

  const fire = () => {
    for (const seconds of newMilestones(elapsed() / 1000, ENGAGED_MILESTONES, sent)) {
      sent.add(seconds);
      track("page_engaged", { seconds });
    }
    schedule();
  };

  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      if (visibleSince === null) visibleSince = performance.now();
    } else if (visibleSince !== null) {
      accumulated += performance.now() - visibleSince;
      visibleSince = null;
    }
    schedule();
  };

  onVisibility();
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
