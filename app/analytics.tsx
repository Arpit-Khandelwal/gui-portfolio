"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const GTM_ID = "GTM-K2XHHRXL";
const CLARITY_ID = "wslz4bfzte";
const STORAGE_KEY = "analytics-consent";
const CONSENT_EVENT = "analytics-consent-change";

type Consent = "granted" | "denied" | null;

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

  const decide = (value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
          `}</Script>
          <Script id="clarity" strategy="afterInteractive">{`
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");
          `}</Script>
        </>
      )}

      {consent === null && (
        <div className="consent-banner" role="dialog" aria-label="Analytics consent" aria-live="polite">
          <p className="consent-text">
            This site uses Google Tag Manager and Microsoft Clarity (session analytics) to understand usage.
            They set cookies and run only if you accept. See the{" "}
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
