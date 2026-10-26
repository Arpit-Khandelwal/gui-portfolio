"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { setAnalyticsContext, track } from "@/lib/analytics";
import { pageTypeForPath, postSlugForPath, vitalParams } from "@/lib/analytics-helpers";
import { AB_COHORT_COOKIE, WORLD_SOURCE_COOKIE } from "@/lib/worlds";
import {
  attachCopyTracking,
  attachEngagedTime,
  attachLinkTracking,
  attachScrollTracking,
  attachSectionViews,
} from "./listeners";

// Module scope so the callback identity is stable, as useReportWebVitals expects.
function reportVital(metric: { name: string; value: number; rating?: string; navigationType?: string }) {
  const params = vitalParams(metric);
  if (params) track("web_vital", params);
}

function readCookie(name: string): string | null {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;
}

function syncWorld() {
  const world = document.documentElement.dataset.world;
  if (world) setAnalyticsContext("site_world", world);
  setAnalyticsContext("world_source", readCookie(WORLD_SOURCE_COOKIE) ?? "default");
}

const EXPOSURE_KEY = "ab-exposure-sent";

/**
 * A/B/C/D test context. `ab_cohort` is the world the test first assigned (or
 * "none" for visitors who arrived by a shared link or before the test). One
 * `ab_exposure` per browser session records what this visitor is seeing now.
 */
function reportExposure() {
  setAnalyticsContext("ab_cohort", readCookie(AB_COHORT_COOKIE) ?? "none");
  try {
    if (sessionStorage.getItem(EXPOSURE_KEY)) return;
    sessionStorage.setItem(EXPOSURE_KEY, "1");
  } catch {
    // Storage blocked: report anyway, at most once per page load.
  }
  track("ab_exposure", {
    variant: document.documentElement.dataset.world ?? "unknown",
    source: readCookie(WORLD_SOURCE_COOKIE) ?? "default",
  });
}

/**
 * Site-wide instrumentation: page context, link, copy, scroll, section and
 * engaged-time tracking, plus Core Web Vitals. Renders nothing. Mount it once
 * in the root layout, before `{children}`, so the page context is set before
 * any page component's own mount-time events.
 */
export function SiteTracking() {
  const pathname = usePathname();

  useReportWebVitals(reportVital);

  // Listeners that do not depend on the page.
  useEffect(() => {
    syncWorld();
    reportExposure();
    // The world switcher changes data-world in place on non-home pages.
    const worldObserver = new MutationObserver(syncWorld);
    worldObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-world"] });
    const detachLinks = attachLinkTracking();
    const detachCopy = attachCopyTracking();
    return () => {
      worldObserver.disconnect();
      detachLinks();
      detachCopy();
    };
  }, []);

  // Per page view: context, scroll depth, sections and engaged time start over.
  useEffect(() => {
    setAnalyticsContext("page_type", pageTypeForPath(pathname));
    const detachScroll = attachScrollTracking(postSlugForPath(pathname));
    const detachSections = attachSectionViews();
    const detachEngaged = attachEngagedTime();
    return () => {
      detachScroll();
      detachSections();
      detachEngaged();
    };
  }, [pathname]);

  return null;
}
