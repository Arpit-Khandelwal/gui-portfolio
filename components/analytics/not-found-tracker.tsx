"use client";

import { useEffect } from "react";
import { setAnalyticsContext, track } from "@/lib/analytics";

/** Reports a 404 with the path only (no query string). Renders nothing. */
export function NotFoundTracker() {
  useEffect(() => {
    setAnalyticsContext("page_type", "not_found");
    track("not_found", { path: window.location.pathname });
  }, []);
  return null;
}
