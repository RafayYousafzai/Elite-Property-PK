import { getProperties } from "@/lib/supabase/properties-server";
import SearchPageClient from "./SearchPageClient";
import { Metadata } from "next";

// Pre-render the explore listings statically, revalidate on-demand or every 24 hours fallback
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Explore Premium Listings | Elite Property Exchange",
  description: "Browse elite apartments, commercial buildings, luxury residential villas, and plots available for sale or rent in DHA Islamabad and Rawalpindi.",
  keywords: ["dha islamabad listings", "plots for sale dha islamabad", "houses for sale dha phase 2", "commercial properties islamabad"],
};

export default async function SearchPage() {
  const initialProperties = await getProperties();
  return <SearchPageClient initialProperties={initialProperties} />;
}
