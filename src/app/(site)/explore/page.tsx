import { getProperties } from "@/lib/supabase/properties-server";
import { toListingSummary } from "@/lib/supabase/listing-summary";
import { Suspense } from "react";
import SearchPageClient, { SearchPageWithParams } from "./SearchPageClient";
import { Metadata } from "next";
import { display } from "@/lib/fonts";

// Pre-render the explore listings statically, revalidate on-demand or every 24 hours fallback
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Properties for Sale in DHA Islamabad – Search & Filter",
  description:
    "Search every verified house, plot, apartment and commercial property for sale in DHA Islamabad. Filter by phase, price, size and bedrooms.",
  // Filter URLs (?type=, ?search=) all canonicalise to the main listing page
  alternates: { canonical: "/explore" },
};

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
