"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface BlogData {
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author: string;
  author_image?: string;
  content: string;
  detail?: string;
  tag?: string;
  is_published?: boolean;
  published_at?: string;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Get all blogs (published only for public, all for admin)
export async function getAllBlogs(includeUnpublished: boolean = false) {
  try {
    const supabase = await createClient(cookies());

    let query = supabase
      .from("blogs")
      .select("*")
      .order("published_at", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching blogs:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to fetch blogs" };
  }
}

// Get a single blog by slug
export async function getBlogBySlug(slug: string) {
  try {
    const supabase = await createClient(cookies());

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching blog:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

// Get a single blog by ID
export async function getBlogById(id: string) {
  try {
    const supabase = await createClient(cookies());

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching blog:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

// Create a new blog
export async function createBlog(blogData: BlogData) {
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
        error: "You must be authenticated to create blogs",
      };
    }

    // Auto-generate slug if not provided or make it unique
    let slug = blogData.slug || generateSlug(blogData.title);

    // Check if slug exists and make it unique
    const { data: existingBlog } = await supabase
      .from("blogs")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existingBlog) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const dataToInsert = {
      ...blogData,
      slug,
      is_published: blogData.is_published ?? true,
      published_at: blogData.published_at || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blogs")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate cache
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Update a blog
export async function updateBlog(id: string, blogData: Partial<BlogData>) {
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
        error: "You must be authenticated to update blogs",
      };
    }

    // If slug is being updated, check for uniqueness
    if (blogData.slug) {
      const { data: existingBlog } = await supabase
        .from("blogs")
        .select("id, slug")
        .eq("slug", blogData.slug)
        .neq("id", id)
        .single();

      if (existingBlog) {
        return {
          success: false,
          error: "A blog with this slug already exists",
        };
      }
    }

    const { data, error } = await supabase
      .from("blogs")
      .update(blogData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate cache
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    if (data.slug) {
      revalidatePath(`/blogs/${data.slug}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Delete a blog
export async function deleteBlog(id: string) {
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
        error: "You must be authenticated to delete blogs",
      };
    }

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate cache
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Toggle blog published status
export async function toggleBlogPublished(id: string, isPublished: boolean) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be authenticated to update blogs",
      };
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({ is_published: isPublished })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
