import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { DatabaseProperty, Property, SearchFilters } from "@/types/property";
import { propertyTypes } from "@/components/Admin/PropertyForm";

// Transform database property to app property
export const transformDatabaseProperty = (
  dbProperty: DatabaseProperty
): Property => {
  return {
    id: dbProperty.id,
    name: dbProperty.name,
    slug: dbProperty.slug,
    location: dbProperty.location,
    rate: dbProperty.rate,
    area: dbProperty.area,
    beds: dbProperty.beds,
    baths: dbProperty.baths,
    photo_sphere: dbProperty.photo_sphere,
    property_type: dbProperty.property_type,
    images: dbProperty.images || [],
    description: dbProperty.description,
    is_featured: dbProperty.is_featured,
    created_at: dbProperty.created_at,
    updated_at: dbProperty.updated_at,
    // New fields
    features: dbProperty.features || {},
    purpose: dbProperty.purpose,
    property_category: dbProperty.property_category,
    city: dbProperty.city,
    area_unit: dbProperty.area_unit,
    installment_available: dbProperty.installment_available || false,
    video_url: dbProperty.video_url,
    advance_amount: dbProperty.advance_amount,
    no_of_installments: dbProperty.no_of_installments,
    monthly_installments: dbProperty.monthly_installments,
    constructed_covered_area: dbProperty.constructed_covered_area,
    is_sold: dbProperty.is_sold || false,
    phase: dbProperty.phase,
    sector: dbProperty.sector,
    street: dbProperty.street,
  };
};

// Client-side function to fetch properties
export async function getPropertiesClient(): Promise<Property[]> {
  try {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    return data.map(transformDatabaseProperty);
  } catch (error) {
    console.error("Error in getPropertiesClient:", error);
    return [];
  }
}

// Helper to parse numeric counts from strings/numbers ("5", "5 Beds", 5)
export function parseNumericCount(val: string | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// Smart Bed Extractor (DB integer column -> string parsing -> features object -> title/desc regex fallback)
export function getBedsCount(property: Property): number {
  if (typeof property.beds === "number" && !isNaN(property.beds) && property.beds > 0) {
    return property.beds;
  }
  if (property.beds !== null && property.beds !== undefined && property.beds !== "") {
    const parsed = parseNumericCount(property.beds);
    if (parsed > 0) return parsed;
  }
  if (property.features && typeof property.features === "object") {
    const featObj = property.features as Record<string, any>;
    if (featObj.beds || featObj.bedrooms) {
      const featBeds = parseNumericCount(featObj.beds || featObj.bedrooms);
      if (featBeds > 0) return featBeds;
    }
  }
  const text = `${property.name || ""} ${property.description || ""}`;
  const match = text.match(/(\d+)\s*(?:bed|bedroom|beds)\b/i);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num > 0) return num;
  }
  return 0;
}

// Smart Bath Extractor (DB integer column -> string parsing -> features object -> title/desc regex fallback)
export function getBathsCount(property: Property): number {
  if (typeof property.baths === "number" && !isNaN(property.baths) && property.baths > 0) {
    return property.baths;
  }
  if (property.baths !== null && property.baths !== undefined && property.baths !== "") {
    const parsed = parseNumericCount(property.baths);
    if (parsed > 0) return parsed;
  }
  if (property.features && typeof property.features === "object") {
    const featObj = property.features as Record<string, any>;
    if (featObj.baths || featObj.bathrooms) {
      const featBaths = parseNumericCount(featObj.baths || featObj.bathrooms);
      if (featBaths > 0) return featBaths;
    }
  }
  const text = `${property.name || ""} ${property.description || ""}`;
  const match = text.match(/(\d+)\s*(?:bath|bathroom|baths)\b/i);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num > 0) return num;
  }
  return 0;
}

// Helper to reliably parse rates (numbers, numeric strings, "16 Crore", "50 Lakh")
export function parsePropertyRate(rate: string | number | null | undefined): number {
  if (rate === null || rate === undefined) return 0;
  if (typeof rate === "number") return rate;

  const cleanStr = String(rate).trim().toLowerCase();
  if (!cleanStr) return 0;

  if (cleanStr.includes("crore")) {
    const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  if (cleanStr.includes("lakh") || cleanStr.includes("lac")) {
    const num = parseFloat(cleanStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }

  const numericOnly = parseFloat(cleanStr.replace(/[^0-9.]/g, ""));
  return isNaN(numericOnly) ? 0 : numericOnly;
}

// Function to get properties with filters
export async function getFilteredProperties(
  filters: SearchFilters
): Promise<Property[]> {
  try {
    const supabase = createBrowserClient();

    let query = supabase.from("properties").select("*");

    // Apply property type & subCategory filter
    if (filters.propertyType !== "all") {
      if (filters.propertyType === "homes") {
        const homeTypes = propertyTypes.Home.map((type) => type.toLowerCase());

        if (filters.subCategory) {
          query = query.or(
            `property_type.ilike.%${filters.subCategory}%,property_category.ilike.%${filters.subCategory}%`
          );
        } else {
          query = query.in("property_type", homeTypes);
        }
      } else if (filters.propertyType === "apartments") {
        query = query.in("property_type", [
          "flat",
          "apartment",
          "flat/appartment",
          "penthouse",
        ]);
      } else if (filters.propertyType === "plots") {
        const plotTypes = propertyTypes.Plots.map((type) => type.toLowerCase());

        if (filters.subCategory) {
          query = query.or(
            `property_type.ilike.%${filters.subCategory}%,property_category.ilike.%${filters.subCategory}%`
          );
        } else {
          query = query.in("property_type", plotTypes);
        }
      } else if (filters.propertyType === "commercial") {
        const commercialTypes = propertyTypes.Commercial.map((type) =>
          type.toLowerCase()
        );

        if (filters.subCategory) {
          query = query.or(
            `property_type.ilike.%${filters.subCategory}%,property_category.ilike.%${filters.subCategory}%`
          );
        } else {
          query = query.in("property_type", commercialTypes);
        }
      }
    } else if (filters.subCategory) {
      query = query.or(
        `property_type.ilike.%${filters.subCategory}%,property_category.ilike.%${filters.subCategory}%`
      );
    }

    // Apply multi-column search query (Name, Location, Phase, Sector, City, Type, Category)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim();
      query = query.or(
        `name.ilike.%${q}%,location.ilike.%${q}%,phase.ilike.%${q}%,sector.ilike.%${q}%,city.ilike.%${q}%,property_type.ilike.%${q}%,property_category.ilike.%${q}%`
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered properties from Supabase:", error);
      return [];
    }

    let properties = (data || []).map(transformDatabaseProperty);

    // Post-process beds filter accurately using getBedsCount
    if (filters.beds && filters.beds > 0) {
      properties = properties.filter((property) => {
        const bedsCount = getBedsCount(property);
        return bedsCount >= filters.beds!;
      });
    }

    // Post-process baths filter accurately using getBathsCount
    if (filters.baths && filters.baths > 0) {
      properties = properties.filter((property) => {
        const bathsCount = getBathsCount(property);
        return bathsCount >= filters.baths!;
      });
    }

    // Post-process price range filter accurately using parsePropertyRate
    const [minPrice, maxPrice] = filters.priceRange || [0, 1000000000];
    if (minPrice > 0 || maxPrice < 1000000000) {
      properties = properties.filter((property) => {
        const price = parsePropertyRate(property.rate);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Failsafe post-process for search query if phase search is used
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const term = filters.searchQuery.trim().toLowerCase();
      properties = properties.filter((property) => {
        const fullText = [
          property.name,
          property.location,
          property.phase,
          property.sector,
          property.city,
          property.property_type,
          property.property_category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return fullText.includes(term);
      });
    }

    return properties;
  } catch (error) {
    console.error("Error in getFilteredProperties:", error);
    return [];
  }
}

// Function to get a single property by slug
export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  try {
    const supabase = createBrowserClient();

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching property:", error);
      return null;
    }

    return transformDatabaseProperty(data);
  } catch (error) {
    console.error("Error in getPropertyBySlug:", error);
    return null;
  }
}

// Function to get properties count by type
export async function getPropertiesCount(): Promise<{
  total: number;
  houses: number;
  apartments: number;
  plots: number;
  commercial: number;
}> {
  try {
    const supabase = createBrowserClient();

    const [
      { count: total },
      { count: houses },
      { count: apartments },
      { count: plots },
      { count: commercial },
    ] = await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }),
      // Count all home types
      supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .in("property_type", [
          "house",
          "flat",
          "upper portion",
          "lower portion",
          "farm house",
          "room",
          "penthouse",
        ]),
      // Count apartment types
      supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .in("property_type", ["apartment", "flat", "penthouse"]),
      // Count plot types
      supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .in("property_type", [
          "plot",
          "residential plot",
          "agricultural land",
          "industrial land",
          "plot file",
          "plot form",
        ]),
      // Count commercial types
      supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .in("property_type", [
          "commercial plot",
          "office",
          "shop",
          "warehouse",
          "factory",
          "building",
          "other",
        ]),
    ]);

    return {
      total: total || 0,
      houses: houses || 0,
      apartments: apartments || 0,
      plots: plots || 0,
      commercial: commercial || 0,
    };
  } catch (error) {
    console.error("Error in getPropertiesCount:", error);
    return {
      total: 0,
      houses: 0,
      apartments: 0,
      plots: 0,
      commercial: 0,
    };
  }
}

// Function to update property featured status
export async function updatePropertyFeaturedStatus(
  id: string,
  is_featured: boolean
): Promise<boolean> {
  try {
    const supabase = createBrowserClient();

    const { error } = await supabase
      .from("properties")
      .update({ is_featured })
      .eq("id", id);

    if (error) {
      console.error("Error updating property featured status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updatePropertyFeaturedStatus:", error);
    return false;
  }
}
