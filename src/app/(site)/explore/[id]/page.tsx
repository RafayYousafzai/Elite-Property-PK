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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eliteproperty.pk";
  const mainImage = property.images && property.images.length > 0
    ? (typeof property.images[0] === "string" ? property.images[0] : property.images[0].src)
    : "";

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.name,
    "description": property.description || `Premium property listing: ${property.name} in DHA Islamabad.`,
    "url": `${siteUrl}/explore/${property.slug}`,
    "image": mainImage ? [mainImage] : [],
    "datePosted": property.created_at || new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "price": property.rate,
      "priceCurrency": "PKR",
      "businessFunction": property.purpose === "rent" ? "http://purl.org/goodrelations/v1#Rent" : "http://purl.org/goodrelations/v1#Sell"
    },
    "about": {
      "@type": "SingleFamilyResidence",
      "name": property.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.city || "Islamabad",
        "addressRegion": "Punjab",
        "addressCountry": "PK",
        "streetAddress": property.location
      },
      "numberOfBedrooms": property.beds || undefined,
      "numberOfBathroomsTotal": property.baths || undefined
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      <PropertyDetailsClient property={property} />
    </>
  );
}
