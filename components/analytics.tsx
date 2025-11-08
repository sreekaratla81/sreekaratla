"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/config";

export function Analytics() {
  if (siteConfig.analyticsProvider === "none") return null;

  if (siteConfig.analyticsProvider === "plausible" && siteConfig.plausibleDomain) {
    return (
      <Script
        src="https://plausible.io/js/script.js"
        data-domain={siteConfig.plausibleDomain}
        strategy="afterInteractive"
      />
    );
  }

  if (siteConfig.analyticsProvider === "ga4" && siteConfig.ga4Id) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4Id}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteConfig.ga4Id}');
          `}
        </Script>
      </>
    );
  }

  return null;
}
