import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperties } from "@/lib/supabase/properties-server";
import { toListingSummary } from "@/lib/supabase/listing-summary";
import {
  allLandingPages,
  buildSlug,
  describe,
  landingFaqs,
  matches,
  parseSlug,
  statsFor,
  type LandingFilter,
} from "@/lib/seo/landing";
import { KIND_COPY } from "@/lib/listing-taxonomy";
import { JsonLd, breadcrumbSchema, faqSchema, itemListSchema } from "@/lib/seo/schema";
import { display } from "@/lib/fonts";
import LandingView, { type Crumb } from "../LandingView";

// Rebuilt in the background so counts and prices track the live inventory
export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const filter = parseSlug(slug);
  if (!filter) return null;
  const properties = await getProperties();
  const listings = properties.filter((p) => matches(p, filter));
  if (listings.length === 0) return null;
  return { filter, properties, listings, stats: statsFor(listings), copy: describe(filter) };
}

export async function generateStaticParams() {
  return allLandingPages(await getProperties()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Not found", robots: { index: false } };
  const { copy, stats } = data;
  const title = `${copy.h1} – ${stats.count} Listings`;
  const description = `${stats.count} verified ${copy.plural} for sale in ${copy.place}, from ${stats.minPrice} to ${stats.maxPrice}${
    stats.sizes.length ? ` · ${stats.sizes.slice(0, 3).join(", ")}` : ""
  }. Real photos & verified prices.`;
  const url = `/dha-islamabad/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

function introFor(filter: LandingFilter, copy: ReturnType<typeof describe>, stats: ReturnType<typeof statsFor>) {
  const sizes = stats.sizes.length > 1 ? ` Sizes range from ${stats.sizes[0]} to ${stats.sizes[stats.sizes.length - 1]}.` : "";
  const phases =
    !filter.phase && stats.phases.length > 1
      ? ` Listings span DHA ${stats.phases.map((p) => `Phase ${p}`).join(", ")}.`
      : "";
  return `Browse ${stats.count} verified ${stats.count === 1 ? copy.plural.replace(/s$/, "") : copy.plural} for sale in ${copy.place}, with asking prices from ${stats.minPrice} to ${stats.maxPrice}.${sizes}${phases} Every listing is checked for ownership and inspected in person by our advisors, so the photos, price and details you see are accurate.`;
}

export default async function LandingPageRoute({ params }: Props) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { filter, properties, listings, stats, copy } = data;

  const pages = allLandingPages(properties);
  const others = (fn: (f: LandingFilter) => boolean) => pages.filter((p) => p.slug !== slug && fn(p.filter));

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "DHA Islamabad", href: "/dha-islamabad" },
    ...(filter.phase && filter.kind
      ? [{ name: `DHA Phase ${filter.phase}`, href: `/dha-islamabad/${buildSlug({ phase: filter.phase })}` }]
      : []),
    { name: copy.h1, href: `/dha-islamabad/${slug}` },
  ];

  const related = [
    {
      title: filter.kind ? `${KIND_COPY[filter.kind].title} in other phases` : "Other DHA phases",
      pages: others((f) => !f.sizeMarla && f.kind === filter.kind && Boolean(f.phase) && f.phase !== filter.phase),
    },
    {
      title: filter.phase ? `More in DHA Phase ${filter.phase}` : "Other property types",
      pages: others((f) =>
        filter.phase ? f.phase === filter.phase && f.kind !== filter.kind && !f.sizeMarla : !f.phase && !f.sizeMarla && f.kind !== filter.kind,
      ),
    },
    {
      title: "Popular sizes",
      pages: others((f) => Boolean(f.sizeMarla) && (!filter.kind || f.kind === filter.kind)),
    },
  ];

  const faqs = landingFaqs(filter, stats);
  const exploreParams = new URLSearchParams();
  if (filter.kind) exploreParams.set("type", filter.kind === "house" ? "homes" : `${filter.kind}s`.replace("commercials", "commercial"));
  if (filter.phase) exploreParams.set("search", `Phase ${filter.phase}`);

  return (
    <div className={display.variable}>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={itemListSchema(listings)} />
      <JsonLd data={faqSchema(faqs)} />
      <LandingView
        h1={copy.h1}
        intro={introFor(filter, copy, stats)}
        crumbs={crumbs}
        stats={stats}
        listings={listings.map(toListingSummary)}
        related={related}
        faqs={faqs}
        exploreHref={`/explore${exploreParams.size ? `?${exploreParams}` : ""}`}
      />
    </div>
  );
}
