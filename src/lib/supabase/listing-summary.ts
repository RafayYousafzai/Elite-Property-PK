import type { Property } from "@/types/property";
import { getBathsCount, getBedsCount } from "@/lib/supabase/properties";

// Listing grids only need card fields. Long descriptions, feature lists and the
// duplicate image_paths array made up most of the page payload, so resolve
// bed/bath counts (which can fall back to those fields) and drop the rest.
export function toListingSummary(p: Property): Property {
  const { description, features, image_paths, ...rest } = p;
  return { ...rest, beds: getBedsCount(p) || null, baths: getBathsCount(p) || null, images: p.images.slice(0, 1) };
}
