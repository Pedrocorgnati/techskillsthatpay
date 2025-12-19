import Script from "next/script";

import { analyticsProvider, ga4Id, plausibleDomain } from "@/lib/config";

export default function Analytics() {
  const provider = analyticsProvider.toLowerCase();
  if (provider === "ga4" && ga4Id) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');`}
        </Script>
      </>
    );
  }

  if (provider === "plausible" && plausibleDomain) {
    return (
      <Script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
