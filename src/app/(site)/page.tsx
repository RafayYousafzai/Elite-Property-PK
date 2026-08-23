import FeaturedProperty from "@/components/Home/FeaturedProperty";
import Hero from "@/components/Home/Hero";
import Categories from "@/components/Home/Categories";
import BlogSmall from "@/components/shared/Blog/BlogSmallServer";
import GetInTouch from "@/components/Home/GetInTouch";
import FAQ from "@/components/Home/FAQs";
import Services from "@/components/Home/Services";
import {
  HomeParallaxSection,
  HomeVideoSection,
  HomeLocationSection,
  HomeTestimonialSection,
} from "@/components/Home/HomeClientSections";
import {
  getFeaturedProperties,
} from "@/lib/supabase/properties-server";
import { Metadata } from "next";

// Cache the homepage statically for 24 hours (86400 seconds) as a fallback.
// The cache is automatically revalidated on-demand whenever a change is made from the admin panel.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Elite Property Exchange | Buy, Sell & Rent in DHA Islamabad",
  description: "Explore elite real estate listings in DHA Islamabad Phase 1, Phase 2, and DHA Valley. View luxury villas, residential plots, and premium commercial listings.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  // Fetch properties from Supabase
  const featuredProperties = await getFeaturedProperties();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitepropertypk.com";
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Elite Property Exchange",
    "image": `${siteUrl}/elite-logo-brown.png`,
    "@id": `${siteUrl}/#realestateagent`,
    "url": siteUrl,
    "telephone": "+92-300-0511111",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "DHA Phase 2",
      "addressLocality": "Islamabad",
      "postalCode": "44000",
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.5244,
      "longitude": 73.1492
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }}
      />
      <Hero />
      <Categories />
      <HomeParallaxSection featuredProperties={featuredProperties} />
      <Services />

      <HomeVideoSection />

      <FeaturedProperty properties={featuredProperties} />
      <HomeLocationSection />
      <BlogSmall />
      <FAQ />
      <GetInTouch />
      <br />
      <br />
      <br />
      <HomeTestimonialSection />
      <br />
      <br />
      <br />
    </main>
  );
}
