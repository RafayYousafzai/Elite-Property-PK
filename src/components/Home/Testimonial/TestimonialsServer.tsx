import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import TestimonialsClient from "./index";

export default async function Testimonials() {
  const supabase = await createClient(cookies());

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return <TestimonialsClient testimonials={testimonials || []} />;
}
