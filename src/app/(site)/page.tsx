import FeaturedProperty from "@/components/Home/FeaturedProperty";
import Hero from "@/components/Home/Hero";
// import Plots from "@/components/Home/Plots";
import Categories from "@/components/Home/Categories";
import Testimonial from "@/components/Home/Testimonial/TestimonialsServer";
import BlogSmall from "@/components/shared/Blog/BlogSmallServer";
import GetInTouch from "@/components/Home/GetInTouch";
import FAQ from "@/components/Home/FAQs";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import Services from "@/components/Home/Services";
import {
  getFeaturedProperties,
  // getProperties,
} from "@/lib/supabase/properties-server";
import VideoShowcase from "@/components/shared/video-showcase";
import LocationMap from "@/components/Home/Office";

export default async function Home() {
  // Fetch properties from Supabase
  // const properties = await getProperties();
  const featuredProperties = await getFeaturedProperties();

  return (
    <main>
      <Hero />
      <Categories />
      <ParallaxScroll items={featuredProperties} />
      <Services />

      <VideoShowcase
        videos={[
          {
            id: "1",
            title: "Casa Prisma – Modern Design Meets Timeless Elegance",
            description:
              "Tour Casa Prisma, a stunning fusion of sleek modern architecture and classic luxury — redefining elegant living.",
            youtubeId: "https://www.youtube.com/watch?v=mTwsTzWOzA8",
          },
          {
            id: "2",
            title: "Villa Arista – 1 Kanal Modern Designer House",
            description:
              "Step inside Villa Arista in DHA Phase 2, Islamabad — a 1 Kanal masterpiece featuring 3D marble elevation and premium interiors.",
            youtubeId: "https://www.youtube.com/watch?v=mmrFAQyZUbU",
          },
          {
            id: "3",
            title: "Villa Novella – 2 Kanal Italian Dream Home",
            description:
              "Explore Villa Novella, an Italian-inspired 2 Kanal luxury villa with multi-level design, grand spaces, and modern interiors.",
            youtubeId: "https://www.youtube.com/watch?v=WLnZEtiRZO0",
          },
          {
            id: "4",
            title: "Ultra Modern 1 Kanal Straight Line House",
            description:
              "A sleek, ultra-modern straight-line residence in DHA Phase 2, Islamabad — minimalist elegance meets smart architecture.",
            youtubeId: "https://www.youtube.com/watch?v=DfdVx44EClk",
          },
          {
            id: "5",
            title: "The Prestige Manor – 1 Kanal Elite Luxury",
            description:
              "Experience The Prestige Manor: a 1 Kanal luxury home in DHA Phase 2, crafted with elite finishing and refined sophistication.",
            youtubeId: "https://www.youtube.com/watch?v=qlL4TzZD3wU",
          },
          {
            id: "6",
            title: "The Grand Haven – 1 Kanal Luxury Residence",
            description:
              "Discover The Grand Haven, a lavish 1 Kanal residence in DHA Phase 2 featuring elite finishes and contemporary architecture.",
            youtubeId: "https://youtu.be/kSyNG7QE93M?si=XLAmujqLz11DQgWr",
          },
        ]}
      />

      <FeaturedProperty properties={[featuredProperties[0]]} />
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
