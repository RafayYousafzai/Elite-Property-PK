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
  title: "About Us – Trusted Real Estate Agency in DHA Islamabad",
  description:
    "Elite Property Exchange is a DHA Islamabad real estate agency listing verified properties only. Meet the team, our process, and why buyers and overseas Pakistanis trust us.",
  alternates: { canonical: "/about" },
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
