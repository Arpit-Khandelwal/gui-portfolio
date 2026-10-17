import Script from "next/script";

// Google Tag Manager is the single entry point: the container loads
// Google Analytics 4 and Microsoft Clarity, so each runs exactly once.
const GTM_ID = "GTM-K2XHHRXL";

export default function Analytics() {
  return (
    <Script id="gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
    `}</Script>
  );
}
