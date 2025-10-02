"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Updated schema interface
export interface PropertyData {
  name: string;
  location: string;
  rate: number;
  area: number;
  beds?: number | null;
  baths?: number | null;
  photo_sphere?: string;
  property_type: "house" | "apartment" | "plot" | "commercial plot";
  images: string[];
  description?: string;
  is_featured: boolean;

  // New fields
  purpose?: string;
  property_category?: string;
  city?: string;
  area_unit?: string;
  installment_available?: boolean;
  video_url?: string;
  advance_amount?: number | null;
  no_of_installments?: number | null;
  monthly_installments?: number | null;
  features?: object;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

    // Create unique slug from name
    const baseSlug = generateSlug(propertyData.name);
    const uniqueSlug =
      baseSlug + "-" + Math.random().toString(36).substring(2, 8);

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

    // Revalidate cache
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

    // Generate slug if name is updated
    let updatedSlug: string | undefined;
    if (propertyData.name) {
      const baseSlug = propertyData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      updatedSlug = baseSlug + "-" + Math.random().toString(36).substring(2, 8);
    }

    const dataToUpdate = {
      ...propertyData,
      ...(updatedSlug ? { slug: updatedSlug } : {}),
    };

    const { data, error } = await supabase
      .from("properties")
      .update(dataToUpdate)
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

    // Revalidate pages
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    if (updatedSlug) {
      revalidatePath(`/properties/${updatedSlug}`);
    }

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
