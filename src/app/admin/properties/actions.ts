"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface PropertyData {
  name: string;
  slug: string;
  location: string;
  rate: string;
  area: number;
  area_sqft?: number;
  area_sqyards?: number;
  area_marla?: number;
  area_kanal?: number;
  beds?: number;
  baths?: number;
  photo_sphere?: string;
  property_type: "house" | "apartment" | "plot";
  images: string[];
  description?: string;
  is_featured: boolean;
}

export async function createProperty(propertyData: PropertyData) {
  try {
    const supabase = await createClient(cookies());

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be authenticated to create properties",
      };
    }

    // Add unique suffix to slug to ensure uniqueness
    const uniqueSlug =
      propertyData.slug + "-" + Math.random().toString(36).substring(2, 8);

    // Prepare data with unique slug
    const dataToInsert = {
      ...propertyData,
      slug: uniqueSlug,
    };

    const { data, error } = await supabase
      .from("properties")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Revalidate the properties page cache
    revalidatePath("/admin/properties");
    revalidatePath("/properties");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function updateProperty(id: string, propertyData: PropertyData) {
  try {
    const supabase = await createClient(cookies());

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be authenticated to update properties",
      };
    }

    const { data, error } = await supabase
      .from("properties")
      .update(propertyData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Revalidate the properties page cache
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${propertyData.slug}`);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteProperty(id: string) {
  try {
    const supabase = await createClient(cookies());

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be authenticated to delete properties",
      };
    }

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Revalidate the properties page cache
    revalidatePath("/admin/properties");
    revalidatePath("/properties");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
