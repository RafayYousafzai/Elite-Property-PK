import Hero from "@/components/Home/Hero";
import FeaturedEditorial from "@/components/Home/FeaturedEditorial";
import BrowseListings from "@/components/Home/BrowseListings";
import VideoTours from "@/components/Home/VideoTours";
import ClientStories from "@/components/Home/ClientStories";
import VisitAndFAQ from "@/components/Home/VisitAndFAQ";
import WhyChooseUs from "@/components/About/WhyChooseUs";
import Team from "@/components/About/Team";
import BlogSmall from "@/components/shared/Blog/BlogSmallServer";
import {
  getFeaturedProperties,
  getProperties,
} from "@/lib/supabase/properties-server";
import { getTeamMembersServer } from "@/lib/supabase/team-server";
import { display } from "@/lib/fonts";
import { Metadata } from "next";

// Statically rendered; refreshed in the background every 10 minutes so new
// listings, testimonials and team changes from the admin panel show up quickly.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Elite Property Exchange | Buy, Sell & Rent in DHA Islamabad",
  description: "Explore elite real estate listings in DHA Islamabad Phase 1, Phase 2, and DHA Valley. View luxury villas, residential plots, and premium commercial listings.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [featuredProperties, allProperties, team] = await Promise.all([
    getFeaturedProperties(),
    getProperties(),
    getTeamMembersServer(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitepropertypk.com";
  const agentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Elite Property Exchange",
    "image": `${siteUrl}/elite-logo-brown.png`,
    "@id": `${siteUrl}/#realestateagent`,
    "url": siteUrl,
    "telephone": "+92-334-4111778",
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
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    }
  };

  return (
    <main className={`${display.variable} bg-[#faf8f3] text-[#1a1714]`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }}
      />
      <Hero />
      <FeaturedEditorial properties={featuredProperties} />
      <BrowseListings properties={allProperties} />
      <VideoTours />
      <ClientStories />
      <WhyChooseUs />
      <Team members={team.slice(0, 3)} />
      <BlogSmall />
      <VisitAndFAQ />
    </main>
  );
}
