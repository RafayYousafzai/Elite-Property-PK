"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface TestimonialData {
  name: string;
  position: string;
  review: string;
  image: string;
  is_active?: boolean;
  display_order?: number;
}

export async function createTestimonial(testimonialData: TestimonialData) {
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
        error: "You must be authenticated to create testimonials",
      };
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert([testimonialData])
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
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

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

export async function updateTestimonial(
  id: string,
  testimonialData: TestimonialData
) {
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
        error: "You must be authenticated to update testimonials",
      };
    }

    const { data, error } = await supabase
      .from("testimonials")
      .update(testimonialData)
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
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

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

export async function deleteTestimonial(id: string) {
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
        error: "You must be authenticated to delete testimonials",
      };
    }

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Revalidate the testimonials page cache
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

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

export async function toggleTestimonialStatus(id: string, isActive: boolean) {
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
        error: "You must be authenticated to update testimonials",
      };
    }

    const { data, error } = await supabase
      .from("testimonials")
      .update({ is_active: isActive })
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
    revalidatePath("/admin/testimonials");
    revalidatePath("/");

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
