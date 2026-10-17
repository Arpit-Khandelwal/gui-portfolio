"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";

// Google Tag Manager is the single entry point: the container loads
// Google Analytics 4 and Microsoft Clarity, so each runs exactly once.
const GTM_ID = "GTM-K2XHHRXL";
const STORAGE_KEY = "analytics-consent";
const CONSENT_EVENT = "analytics-consent-change";

type Consent = "granted" | "denied" | null;
/** "ask": EU/EEA/UK/CH visitor (or unknown) — opt-in first. "open": load straight away. */
type Region = "pending" | "ask" | "open";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getConsent(): Consent {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

function getServerConsent(): Consent {
  return null;
}

export default function Analytics() {
  const consent = useSyncExternalStore(subscribe, getConsent, getServerConsent);
  const [region, setRegion] = useState<Region>("pending");

  useEffect(() => {
    fetch("/consent-region", { cache: "no-store" })
      .then((res) => res.json() as Promise<{ requiresConsent?: boolean }>)
      .then((data) => setRegion(data.requiresConsent === false ? "open" : "ask"))
      // If we can't tell where the visitor is, ask rather than assume.
      .catch(() => setRegion("ask"));
  }, []);

  const decide = (value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const shouldLoad = region === "open" || (region === "ask" && consent === "granted");
  const showBanner = region === "ask" && consent === null;

  return (
    <>
      {shouldLoad && (
        <Script id="gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      )}

      {showBanner && (
        <div className="consent-banner" role="dialog" aria-label="Analytics consent" aria-live="polite">
          <p className="consent-text">
            This site uses Google Analytics and Microsoft Clarity (session analytics) to understand
            usage. They set cookies and run only if you accept. See the{" "}
            <a href="/privacy-policy" className="consent-link">privacy policy</a>.
          </p>
          <div className="consent-actions">
            <button type="button" onClick={() => decide("denied")} className="consent-button consent-button-ghost">
              Decline
            </button>
            <button type="button" onClick={() => decide("granted")} className="consent-button consent-button-solid">
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
