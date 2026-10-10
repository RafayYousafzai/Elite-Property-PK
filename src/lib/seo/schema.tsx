import type { Property } from "@/types/property";
import { getImageUrl } from "@/lib/utils";
import { kindOf, phaseOf, sizeInMarla } from "@/lib/listing-taxonomy";
import { BUSINESS, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

// Structured data (schema.org JSON-LD) helpers. Escaping "<" keeps listing text
// from ever closing the <script> tag early.
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const businessId = `${SITE_URL}/#business`;

/** The agency itself: shown site-wide so Google can build a local business panel. */
export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": businessId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/elite-logo-brown.png"),
        image: absoluteUrl("/images/hero/hero-bg.webp"),
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        priceRange: "PKR 1 crore – PKR 40 crore",
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.streetAddress,
          addressLocality: BUSINESS.locality,
          postalCode: BUSINESS.postalCode,
          addressCountry: BUSINESS.country,
        },
        geo: { "@type": "GeoCoordinates", ...BUSINESS.geo },
        hasMap: BUSINESS.mapsUrl,
        areaServed: [
          { "@type": "City", name: "Islamabad" },
          { "@type": "City", name: "Rawalpindi" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "09:00",
          closes: "19:00",
        },
        knowsLanguage: ["en", "ur"],
        sameAs: BUSINESS.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-PK",
        publisher: { "@id": businessId },
      },
    ],
  };
}

export function breadcrumbSchema(crumbs: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListSchema(listings: Property[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 30).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/explore/${p.slug}`),
      name: p.name.trim(),
    })),
  };
}

const ACCOMMODATION_TYPE = {
  house: "SingleFamilyResidence",
  apartment: "Apartment",
  plot: "Place",
  commercial: "Place",
} as const;

/** A single property listing. */
export function listingSchema(p: Property) {
  const kind = kindOf(p);
  const phase = phaseOf(p);
  const marla = sizeInMarla(p);
  const images = (p.images ?? []).slice(0, 6).map((img) => getImageUrl(img));
  const url = absoluteUrl(`/explore/${p.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name: p.name.trim(),
    description: (p.description || `${p.name} in DHA Islamabad.`).slice(0, 500),
    image: images,
    datePosted: p.created_at,
    ...(p.updated_at ? { dateModified: p.updated_at } : null),
    offers: {
      "@type": "Offer",
      price: Number(p.rate) || undefined,
      priceCurrency: "PKR",
      availability: p.is_sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      businessFunction: "http://purl.org/goodrelations/v1#Sell",
      seller: { "@id": businessId },
    },
    about: {
      "@type": ACCOMMODATION_TYPE[kind],
      name: p.name.trim(),
      address: {
        "@type": "PostalAddress",
        streetAddress: [p.street, p.sector && `Sector ${p.sector}`, phase && `DHA Phase ${phase}`]
          .filter(Boolean)
          .join(", ") || p.location,
        addressLocality: p.city || "Islamabad",
        addressCountry: "PK",
      },
      ...(marla
        ? { floorSize: { "@type": "QuantitativeValue", value: Math.round(marla * 225), unitCode: "FTK", unitText: "sq ft" } }
        : null),
      ...(kind === "house" || kind === "apartment"
        ? {
            ...(p.beds ? { numberOfBedrooms: Number(p.beds) || undefined } : null),
            ...(p.baths ? { numberOfBathroomsTotal: Number(p.baths) || undefined } : null),
          }
        : null),
    },
  };
}
