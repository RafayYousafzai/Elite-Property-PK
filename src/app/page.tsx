import FeaturedProperty from "@/components/Home/FeaturedProperty";
import Hero from "@/components/Home/Hero";
import Plots from "@/components/Home/Plots";
import Services from "@/components/Home/Services";
import Testimonial from "@/components/Home/Testimonial";
import BlogSmall from "@/components/shared/Blog";
import GetInTouch from "@/components/Home/GetInTouch";
import FAQ from "@/components/Home/FAQs";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <ParallaxScroll />
      <Plots />
      <FeaturedProperty />
      <Testimonial />
      <BlogSmall />
      <GetInTouch />
      <FAQ />
    </main>
  );
}
