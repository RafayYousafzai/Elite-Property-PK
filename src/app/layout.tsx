import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import ThirdPartyScripts from "@/components/shared/ThirdPartyScripts";
import { display } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { JsonLd, businessSchema } from "@/lib/seo/schema";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Elite Property Exchange | Houses & Plots for Sale in DHA Islamabad",
    template: "%s | Elite Property",
  },
  description:
    "Verified houses, plots and commercial property for sale in DHA Islamabad Phases 1–7. Real photos, current prices and expert advisors in DHA Phase II, Islamabad.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: SITE_NAME,
    title: "Elite Property Exchange | Houses & Plots for Sale in DHA Islamabad",
    description:
      "Verified houses, plots and commercial property for sale in DHA Islamabad Phases 1–7, with real photos and current prices.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Property Exchange | Houses & Plots for Sale in DHA Islamabad",
    description: "Verified houses, plots and commercial property for sale in DHA Islamabad Phases 1–7.",
  },
  formatDetection: { telephone: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PK">
      <head>
        {/* Meta Pixel + Google Ads tag: deferred until the visitor actually
            interacts (or a short idle fallback), so their long parse/exec
            tasks land outside the window Lighthouse uses to compute TTI. */}
        <ThirdPartyScripts />

        <JsonLd data={businessSchema()} />
      </head>

      <body className={`${font.className} ${display.variable} bg-white text-slate-900 antialiased`}>
        <NextTopLoader color="#d8b648" showSpinner={false} />
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
