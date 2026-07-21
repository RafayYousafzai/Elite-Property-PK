import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import SessionProviderComp from "@/components/nextauth/SessionProvider";
import { Providers } from "./providers";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliteproperty.pk";

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
  session,
}: Readonly<{
  children: React.ReactNode;
  session: unknown;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
          async
        />
        <Script id="gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());

            gtag('config', 'AW-17506316720');
          `}
        </Script>


        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1763559634157665&ev=PageView&noscript=1"
            alt=""
          />
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1605023388022892&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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

      <body className={`${font.className} bg-white dark:bg-black antialiased`}>
        <NextTopLoader color="#d8b648" showSpinner={false} />
        <SessionProviderComp session={session}>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            <Providers>
              <Suspense fallback={null}>{children}</Suspense>
            </Providers>
          </ThemeProvider>
        </SessionProviderComp>
        <Analytics />
      </body>
    </html>
  );
}
