import { createStaticClient } from "@/utils/supabase/static";

export async function getPublishedBlogsStatic() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching published blogs statically:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error in getPublishedBlogsStatic:", error);
    return [];
  }
}
