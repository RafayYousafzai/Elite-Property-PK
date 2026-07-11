import { getProperties, getPropertyBySlugServer } from "@/lib/supabase/properties-server";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

// Cache the property detail pages statically for 24 hours (86400 seconds) as a fallback.
// They are automatically revalidated on-demand when edited or deleted in the admin dashboard.
export const revalidate = 86400;

// Dynamic SEO metadata for social sharing cards, link previews, and search engines
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await params;
  const property = await getPropertyBySlugServer(data.id);
  const siteName = "Elite Property";

  if (!property) {
    return {
      title: `Not Found | ${siteName}`,
      description: "This property could not be found.",
    };
  }

  const title = `${property.name} | ${siteName}`;
  const description = property.description || `Explore ${property.name} in DHA Islamabad. Premium listings by Elite Property Exchange.`;
  const mainImage = property.images && property.images.length > 0
    ? (typeof property.images[0] === "string" ? property.images[0] : property.images[0].src)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: mainImage ? [{ url: mainImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}

// Pre-render property pages at build time for instant loading
export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: property.slug,
  }));
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const data = await params;
  const property = await getPropertyBySlugServer(data.id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailsClient property={property} />;
}
