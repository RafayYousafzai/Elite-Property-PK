import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import ThirdPartyScripts from "@/components/shared/ThirdPartyScripts";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitepropertypk.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Elite Property Exchange | Premium DHA Islamabad Real Estate",
    template: "%s | Elite Property Exchange"
  },
  description: "Find luxury homes, commercial plots, and modern designer villas in DHA Islamabad and Rawalpindi. Elite Property is your premier real estate partner.",
  keywords: ["real estate dha islamabad", "luxury homes islamabad", "dha phase 2 houses", "elite property exchange", "buy plots islamabad", "commercial property dha"],
  authors: [{ name: "Elite Property Team" }],
  creator: "Elite Property Exchange",
  publisher: "Elite Property Exchange",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Elite Property Exchange | Premium DHA Islamabad Real Estate",
    description: "Find luxury homes, commercial plots, and modern designer villas in DHA Islamabad and Rawalpindi. Elite Property is your premier real estate partner.",
    siteName: "Elite Property Exchange",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Property Exchange | Premium DHA Islamabad Real Estate",
    description: "Find luxury homes, commercial plots, and modern designer villas in DHA Islamabad and Rawalpindi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts and static origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preload critical LCP Hero background asset for mobile & desktop */}
        <link rel="preload" as="image" href="/images/hero/hero-bg-mobile.webp" type="image/webp" media="(max-width: 768px)" />
        <link rel="preload" as="image" href="/images/hero/hero-bg.webp" type="image/webp" media="(min-width: 769px)" />

        {/* Meta Pixel + Google Ads tag: deferred until the visitor actually
            interacts (or a short idle fallback), so their long parse/exec
            tasks land outside the window Lighthouse uses to compute TTI. */}
        <ThirdPartyScripts />

        {/* Global JSON-LD Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  "name": "Elite Property Exchange",
                  "url": siteUrl,
                  "logo": `${siteUrl}/elite-logo-brown.png`,
                  "sameAs": [
                    "https://www.facebook.com/elitepropertypk",
                    "https://www.instagram.com/elitepropertypk",
                    "https://www.youtube.com/@elitepropertypk"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+92-300-0511111",
                    "contactType": "customer service",
                    "areaServed": "PK",
                    "availableLanguage": ["English", "Urdu"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  "url": siteUrl,
                  "name": "Elite Property Exchange",
                  "description": "Premium luxury properties in DHA Islamabad and Rawalpindi. Find your dream home, commercial plots, and elite residences.",
                  "publisher": {
                    "@id": `${siteUrl}/#organization`
                  }
                }
              ]
            })
          }}
        />
      </head>

      <body className={`${font.className} bg-white text-slate-900 antialiased`}>
        <NextTopLoader color="#d8b648" showSpinner={false} />
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
