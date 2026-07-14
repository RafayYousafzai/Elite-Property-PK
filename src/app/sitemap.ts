import { MetadataRoute } from "next";
import { getProperties } from "@/lib/supabase/properties-server";
import { createStaticClient } from "@/utils/supabase/static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliteproperty.pk";

  // 1. Static Pages
  const staticRoutes = [
    "",
    "/about",
    "/contactus",
    "/explore",
    "/blogs",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : route === "/explore" ? 0.9 : 0.8,
  }));

  // 2. Dynamic Properties
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await getProperties();
    propertyRoutes = properties.map((property) => ({
      url: `${siteUrl}/explore/${property.slug}`,
      lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating property sitemap routes:", error);
  }

  // 3. Dynamic Blogs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createStaticClient();
    const { data: blogs } = await supabase
      .from("blogs")
      .select("slug, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (blogs) {
      blogRoutes = blogs.map((blog) => ({
        url: `${siteUrl}/blogs/${blog.slug}`,
        lastModified: blog.published_at ? new Date(blog.published_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error generating blog sitemap routes:", error);
  }

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}
