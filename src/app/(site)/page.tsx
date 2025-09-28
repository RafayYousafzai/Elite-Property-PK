import FeaturedProperty from "@/components/Home/FeaturedProperty";
import Hero from "@/components/Home/Hero";
// import Plots from "@/components/Home/Plots";
import Categories from "@/components/Home/Categories";
import Testimonial from "@/components/Home/Testimonial";
import BlogSmall from "@/components/shared/Blog";
import GetInTouch from "@/components/Home/GetInTouch";
import FAQ from "@/components/Home/FAQs";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import Services from "@/components/Home/Services";
import {
  getFeaturedProperties,
  getProperties,
} from "@/lib/supabase/properties-server";
import VideoShowcase from "@/components/shared/video-showcase";
import LocationMap from "@/components/Home/Office";

export default async function Home() {
  // Fetch properties from Supabase
  const properties = await getProperties();
  const featuredProperties = await getFeaturedProperties();

  return (
    <main>
      <Hero />
      <Categories />
      <ParallaxScroll items={properties} />
      <Services />
      <VideoShowcase
        videos={[
          {
            id: "1",
            title: "Why DHA Islamabad is the Best Investment",
            description: "Learn why DHA remains the top choice for investors.",
            youtubeId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            category: "Investment Insights",
            highlightText: "Smart property decisions.",
          },
          {
            id: "2",
            title: "Luxury Villas Tour",
            description:
              "Step inside modern luxury homes designed for families.",
            youtubeId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            // category: "Property Tours",
            highlightText: "Exclusive lifestyle access.",
          },
        ]}
      />

      <FeaturedProperty properties={featuredProperties} />
      <LocationMap />
      <BlogSmall />
      {/* <Plots /> */}
      <FAQ />
      <GetInTouch />
      <br />
      <br />
      <br />
      <Testimonial />
      <br />
      <br />
      <br />
    </main>
  );
}
