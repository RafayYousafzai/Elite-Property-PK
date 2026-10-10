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
  title: { absolute: "Elite Property Exchange | Houses & Plots for Sale in DHA Islamabad" },
  description:
    "Verified houses, plots and commercial property for sale in DHA Islamabad Phases 1–7. Real photos, current prices, video tours and expert advisors in DHA Phase II, Islamabad.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [featuredProperties, allProperties, team] = await Promise.all([
    getFeaturedProperties(),
    getProperties(),
    getTeamMembersServer(),
  ]);


  return (
    <main className={`${display.variable} bg-[#faf8f3] text-[#1a1714]`}>
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
