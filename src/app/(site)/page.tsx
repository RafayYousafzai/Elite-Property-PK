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
import { properties } from "../api/property";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = await createClient(cookies());
  // const { data: properties } = await supabase
  //   .from("properties")
  //   .select("*")
  //   .limit(10);
  // console.log(properties);
  return (
    <main>
      <Hero />
      <Categories />
      <ParallaxScroll items={properties} />
      <Services />
      <FeaturedProperty />
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
