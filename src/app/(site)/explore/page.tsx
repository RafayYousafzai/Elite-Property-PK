import { getProperties } from "@/lib/supabase/properties-server";
import SearchPageClient from "./SearchPageClient";

// Pre-render the explore listings statically, revalidate on-demand or every 24 hours fallback
export const revalidate = 86400;

export default async function SearchPage() {
  const initialProperties = await getProperties();
  return <SearchPageClient initialProperties={initialProperties} />;
}
