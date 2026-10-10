import { getProperties, getPropertyBySlugServer } from "@/lib/supabase/properties-server";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { formatLocation, getImageUrl } from "@/lib/utils";
import { getBedsCount } from "@/lib/supabase/properties";
import { formatPrice, kindOf, phaseOf, sizeInMarla, sizeLabel } from "@/lib/listing-taxonomy";
import { JsonLd, breadcrumbSchema, listingSchema } from "@/lib/seo/schema";
import type { Property } from "@/types/property";

// Up to three available listings of the same type, preferring the same DHA phase
function getRelatedProperties(property: Property, all: Property[]): Property[] {
  const phase = phaseOf(property);
  return all
    .filter((p) => p.slug !== property.slug && !p.is_sold)
    .map((p) => ({
      p,
      score:
        (p.property_type === property.property_type ? 2 : 0) +
        (phase && phaseOf(p) === phase ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ p }) => p);
}

type PageProps = {
  params: Promise<{ id: string }>;
};

// Cache the property detail pages statically for 24 hours (86400 seconds) as a fallback.
// They are automatically revalidated on-demand when edited or deleted in the admin dashboard.
export const revalidate = 86400;

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/[\s,|–-]+\S*$/, "")}…`;

/** "Luxury 2.5 Kanal Villa | 15kW Solar | …" -> "Luxury 2.5 Kanal Villa" (keeps titles readable). */
const headline = (name: string) => name.split(/\s[|–]\s/)[0].trim();

function seoCopy(property: Property) {
  const kind = kindOf(property);
  const phase = phaseOf(property);
  const marla = sizeInMarla(property);
  const place = phase ? `DHA Phase ${phase} Islamabad` : formatLocation(property.location) || "DHA Islamabad";
  const price = formatPrice(property.rate);
  const size = marla ? sizeLabel(marla) : "";
  const beds = getBedsCount(property);
  const kindWord = { house: "House", plot: "Plot", apartment: "Apartment", commercial: "Commercial Property" }[kind];

  const name = headline(property.name);
  const mentionsPlace = /dha|phase/i.test(name);
  // Clip the name, never the price — it's what people scan for in results
  const suffix = ` | ${price}`;
  const titlePlace = phase ? `DHA Phase ${phase}` : place;
  const title = `${clip(`${name}${mentionsPlace ? "" : ` – ${titlePlace}`}`, 62 - suffix.length)}${suffix}`;

  const facts = [size && `${size} ${kindWord.toLowerCase()}`, beds && `${beds} bedrooms`, price].filter(Boolean).join(", ");
  const firstSentence = (property.description || "").replace(/\s+/g, " ").split(/(?<=[.!?])\s/)[0] || "";
  const description = clip(
    `${property.is_sold ? "Sold: " : "For sale: "}${facts} in ${place}. ${firstSentence}`.trim(),
    158,
  );
  return { title, description, place, kindWord };
}

// Dynamic SEO metadata for social sharing cards, link previews, and search engines
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await params;
  const property = await getPropertyBySlugServer(data.id);

  if (!property) {
    return { title: "Property not found", robots: { index: false } };
  }

  const { title, description } = seoCopy(property);
  const url = `/explore/${property.slug}`;
  const mainImage = property.images && property.images.length > 0 ? getImageUrl(property.images[0]) : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: mainImage ? [{ url: mainImage, alt: property.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : undefined,
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
  const [property, allProperties] = await Promise.all([
    getPropertyBySlugServer(data.id),
    getProperties(),
  ]);

  if (!property) {
    notFound();
  }

  const related = getRelatedProperties(property, allProperties);

  const phase = phaseOf(property);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "DHA Islamabad", href: "/dha-islamabad" },
    ...(phase ? [{ name: `DHA Phase ${phase}`, href: `/dha-islamabad/phase-${phase}` }] : []),
    { name: headline(property.name), href: `/explore/${property.slug}` },
  ];

  return (
    <>
      <JsonLd data={listingSchema(property)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PropertyDetailsClient property={property} related={related} />
    </>
  );
}
