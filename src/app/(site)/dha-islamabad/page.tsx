import type { Metadata } from "next";
import { getProperties } from "@/lib/supabase/properties-server";
import { toListingSummary } from "@/lib/supabase/listing-summary";
import { allLandingPages, landingFaqs, statsFor } from "@/lib/seo/landing";
import { JsonLd, breadcrumbSchema, faqSchema, itemListSchema } from "@/lib/seo/schema";
import { display } from "@/lib/fonts";
import LandingView, { type Crumb } from "./LandingView";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const listings = (await getProperties()).filter((p) => !p.is_sold);
  const stats = statsFor(listings);
  const title = `Property for Sale in DHA Islamabad – ${stats.count} Houses & Plots`;
  const description = `${stats.count} verified houses, plots, apartments and commercial properties for sale in DHA Islamabad Phases 1–7, from ${stats.minPrice}. Browse by phase, size and type.`;
  return {
    title,
    description,
    alternates: { canonical: "/dha-islamabad" },
    openGraph: { title, description, url: "/dha-islamabad", type: "website" },
  };
}

export default async function DhaIslamabadHub() {
  const properties = await getProperties();
  const listings = properties.filter((p) => !p.is_sold);
  const stats = statsFor(listings);
  const pages = allLandingPages(properties);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "DHA Islamabad", href: "/dha-islamabad" },
  ];
  const faqs = landingFaqs({}, stats);

  return (
    <div className={display.variable}>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={itemListSchema(listings)} />
      <JsonLd data={faqSchema(faqs)} />
      <LandingView
        h1="Property for Sale in DHA Islamabad"
        intro={`Browse ${stats.count} verified houses, plots, apartments and commercial properties for sale across DHA Islamabad ${stats.phases
          .map((p) => `Phase ${p}`)
          .join(", ")}, priced from ${stats.minPrice} to ${stats.maxPrice}. Every listing is checked for ownership and inspected in person by our advisors. Pick a phase, size or property type below to narrow your search.`}
        crumbs={crumbs}
        stats={stats}
        listings={listings.slice(0, 12).map(toListingSummary)}
        related={[
          { title: "By DHA phase", pages: pages.filter((p) => p.filter.phase && !p.filter.kind) },
          { title: "By property type", pages: pages.filter((p) => !p.filter.phase && !p.filter.sizeMarla && p.filter.kind) },
          { title: "Popular searches", pages: pages.filter((p) => p.filter.sizeMarla || (p.filter.phase && p.filter.kind)) },
        ]}
        faqs={faqs}
        exploreHref="/explore"
      />
    </div>
  );
}
