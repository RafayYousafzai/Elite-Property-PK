"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Meta Pixel + Google Ads tag were previously injected with strategy="lazyOnload",
// which still fires them right after window `load`. Lighthouse traces showed them
// throwing several 50-90ms long tasks between ~4s-6s in, which is exactly the
// window it uses to decide Time to Interactive — so they were the single biggest
// lever holding TTI back even though the JS itself never blocks rendering.
//
// Loading them only once the visitor actually does something (or after a short
// idle fallback for visitors who never interact) keeps that cost out of the
// critical window without dropping tracking coverage for real users.
const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "touchstart",
  "scroll",
];
const FALLBACK_DELAY_MS = 4000;

export default function ThirdPartyScripts() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    const activate = () => setReady(true);

    INTERACTION_EVENTS.forEach((event) =>
      window.addEventListener(event, activate, { once: true, passive: true })
    );
    const fallback = window.setTimeout(activate, FALLBACK_DELAY_MS);

    return () => {
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, activate)
      );
      window.clearTimeout(fallback);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1763559634157665');
          fbq('init', '1605023388022892');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Google tag (gtag.js) - AW-17506316720 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17506316720"
        strategy="afterInteractive"
      />
      <Script id="gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-17506316720');
        `}
      </Script>
    </>
  );
}
