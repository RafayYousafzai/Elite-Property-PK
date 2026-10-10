import { MetadataRoute } from "next";
import { getProperties } from "@/lib/supabase/properties-server";
import { createStaticClient } from "@/utils/supabase/static";
import { allLandingPages } from "@/lib/seo/landing";
import { getImageUrl } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

// Rebuilt with the listings so new properties and landing pages appear quickly
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${SITE_URL}${path}`;
  const properties = await getProperties().catch(() => []);

  // Freshest listing change drives lastModified for pages that show listings
  const latest = properties.reduce<Date | undefined>((acc, p) => {
    const d = new Date(p.updated_at || p.created_at || 0);
    return !acc || d > acc ? d : acc;
  }, undefined);

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: url("/dha-islamabad"), lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: url("/explore"), lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: url("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/team"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contactus"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/blogs"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const landing: MetadataRoute.Sitemap = allLandingPages(properties).map((p) => ({
    url: url(`/dha-islamabad/${p.slug}`),
    lastModified: latest,
    changeFrequency: "daily" as const,
    priority: p.filter.phase && p.filter.kind ? 0.8 : 0.85,
  }));

  const listings: MetadataRoute.Sitemap = properties.map((p) => ({
    url: url(`/explore/${p.slug}`),
    lastModified: new Date(p.updated_at || p.created_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: p.is_sold ? 0.3 : 0.7,
    images: (p.images ?? []).slice(0, 5).map((img) => getImageUrl(img)),
  }));

  let blogs: MetadataRoute.Sitemap = [];
  try {
    const { data } = await createStaticClient()
      .from("blogs")
      .select("slug, published_at, cover_image")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    blogs = (data ?? []).map((b) => ({
      url: url(`/blogs/${b.slug}`),
      lastModified: new Date(b.published_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(b.cover_image ? { images: [b.cover_image] } : null),
    }));
  } catch (error) {
    console.error("Error generating blog sitemap routes:", error);
  }

  return [...pages, ...landing, ...listings, ...blogs];
}
