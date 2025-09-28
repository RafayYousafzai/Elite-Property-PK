import type { Metadata } from "next";
import AboutHero from "@/components/About/AboutHero";
import OurStory from "@/components/About/OurStory";
import Team from "@/components/About/Team";
import WhyChooseUs from "@/components/About/WhyChooseUs";
import AboutCTA from "@/components/About/AboutCTA";

export const metadata: Metadata = {
  title: "About Us - Homely | Premium Real Estate in DHA Islamabad",
  description:
    "Discover the story behind Homely - your trusted partner in luxury real estate. Learn about our mission, vision, and commitment to excellence in DHA Islamabad properties.",
  keywords:
    "about homely, real estate company, DHA Islamabad, luxury properties, property investment, real estate experts",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <OurStory />
      <WhyChooseUs />
      {/* <Team /> */}
      <AboutCTA />
    </main>
  );
}
