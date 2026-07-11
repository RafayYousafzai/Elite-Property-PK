import { createStaticClient } from "@/utils/supabase/static";
import TestimonialsClient from "./index";

export default async function Testimonials() {
  const supabase = createStaticClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return <TestimonialsClient testimonials={testimonials || []} />;
}

