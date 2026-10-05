import type { Metadata } from "next";
import { display } from "@/lib/fonts";
import { getTeamMembersServer } from "@/lib/supabase/team-server";
import AboutHero from "@/components/About/AboutHero";
import OurStory from "@/components/About/OurStory";
import WhyChooseUs from "@/components/About/WhyChooseUs";
import Team from "@/components/About/Team";
import AboutCTA from "@/components/About/AboutCTA";

// Statically rendered; the team preview refreshes in the background.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "About Us - Elite Property | Premium Real Estate in DHA Islamabad",
  description:
    "Discover the story behind Elite Property - your trusted partner in luxury real estate. Learn about our mission, vision, and commitment to excellence in DHA Islamabad properties.",
  keywords:
    "about Elite Property, real estate company, DHA Islamabad, luxury properties, property investment, real estate experts",
};

export default async function AboutPage() {
  const members = await getTeamMembersServer();

  return (
    <main className={`${display.variable} min-h-screen bg-[#faf8f3] text-[#1a1714]`}>
      <AboutHero />
      <OurStory />
      <WhyChooseUs />
      <Team members={members.slice(0, 3)} />
      <AboutCTA />
    </main>
  );
}
