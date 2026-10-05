import { getProperties } from "@/lib/supabase/properties-server";
import { getBathsCount, getBedsCount } from "@/lib/supabase/properties";
import type { Property } from "@/types/property";
import { Suspense } from "react";
import SearchPageClient, { SearchPageWithParams } from "./SearchPageClient";
import { Metadata } from "next";
import { display } from "@/lib/fonts";

// Pre-render the explore listings statically, revalidate on-demand or every 24 hours fallback
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Explore Premium Listings | Elite Property Exchange",
  description: "Browse elite apartments, commercial buildings, luxury residential villas, and plots available for sale or rent in DHA Islamabad and Rawalpindi.",
  keywords: ["dha islamabad listings", "plots for sale dha islamabad", "houses for sale dha phase 2", "commercial properties islamabad"],
};

// The listing grid only needs card fields. Long descriptions, feature lists and
// the duplicate image_paths array made up most of the page payload, so resolve
// bed/bath counts (which can fall back to those fields) and drop the rest.
function toListingSummary(p: Property): Property {
  const { description, features, image_paths, ...rest } = p;
  return { ...rest, beds: getBedsCount(p) || null, baths: getBathsCount(p) || null, images: p.images.slice(0, 1) };
}

export default async function SearchPage() {
  const initialProperties = (await getProperties()).map(toListingSummary);
  return (
    <div className={display.variable}>
      <Suspense fallback={<SearchPageClient initialProperties={initialProperties} />}>
        <SearchPageWithParams initialProperties={initialProperties} />
      </Suspense>
    </div>
  );
}
