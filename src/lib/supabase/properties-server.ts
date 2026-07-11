import { createStaticClient } from "@/utils/supabase/static";
import { transformDatabaseProperty } from "./properties";
import { Property } from "@/types/property";

// Server-side function to fetch properties
export async function getProperties(): Promise<Property[]> {
  try {
    const supabase = createStaticClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    return data.map(transformDatabaseProperty);
  } catch (error) {
    console.error("Error in getProperties:", error);
    return [];
  }
}

// Server-side function to get a single property by slug
export async function getPropertyBySlugServer(
  slug: string
): Promise<Property | null> {
  try {
    const supabase = createStaticClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return null;
    }

    return transformDatabaseProperty(data);
  } catch (error) {
    console.error("Error in getPropertyBySlugServer:", error);
    return null;
  }
}

// Server-side function to fetch featured properties only
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const supabase = createStaticClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true) // 👈 only fetch featured properties
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }

    return data.map(transformDatabaseProperty);
  } catch (error) {
    console.error("Error in getFeaturedProperties:", error);
    return [];
  }
}

