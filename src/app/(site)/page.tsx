import FeaturedProperty from "@/components/Home/FeaturedProperty";
import Hero from "@/components/Home/Hero";
// import Plots from "@/components/Home/Plots";
import Categories from "@/components/Home/Categories";
import Testimonial from "@/components/Home/Testimonial/TestimonialsServer";
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
            title: "Solar powered 5 bed designer residence in DHA Phase 2.",
            description:
              "A stunning 5-bedroom designer residence powered by solar energy, located in the prestigious DHA Phase 2.",
            youtubeId: "https://youtu.be/0niH-x7L3Zk?si=k_-76bAIiX-YsbQE",
            // category: "Investment Insights",
            // highlightText: "Smart property decisions.",
          },
          {
            id: "2",
            title:
              "Elite Lounge Podcast Ep 2 | Real Estate, RECA & Realtor Insights",
            description:
              "Dive into the world of real estate with Sheraz Saleem, exploring market trends, investment strategies, and the future of property in this insightful podcast episode.",
            youtubeId: "https://youtu.be/kFCfQoVB90Q?si=QFJh23B7qRy3MzQj",
            // category: "Property Tours",
            // highlightText: "Exclusive lifestyle access.",
          },
          {
            id: "1",
            title: "Solar powered 5 bed designer residence in DHA Phase 2.",
            description:
              "A stunning 5-bedroom designer residence powered by solar energy, located in the prestigious DHA Phase 2.",
            youtubeId: "https://youtu.be/0niH-x7L3Zk?si=k_-76bAIiX-YsbQE",
            // category: "Investment Insights",
            // highlightText: "Smart property decisions.",
          },
          {
            id: "2",
            title:
              "Elite Lounge Podcast Ep 2 | Real Estate, RECA & Realtor Insights",
            description:
              "Dive into the world of real estate with Sheraz Saleem, exploring market trends, investment strategies, and the future of property in this insightful podcast episode.",
            youtubeId: "https://youtu.be/kFCfQoVB90Q?si=QFJh23B7qRy3MzQj",
            // category: "Property Tours",
            // highlightText: "Exclusive lifestyle access.",
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
