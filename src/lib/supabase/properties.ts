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

// Function to get properties with filters
export async function getFilteredProperties(
  filters: SearchFilters
): Promise<Property[]> {
  try {
    const supabase = createBrowserClient();

    let query = supabase.from("properties").select("*");

    // Apply property type filter - now supports all property types
    if (filters.propertyType !== "all") {
      if (filters.propertyType === "homes") {
        query = query.in("property_type", [
          ...propertyTypes.Home.map((type) => type.toLowerCase()),
        ]);
      } else if (filters.propertyType === "apartments") {
        query = query.in("property_type", [
          "flat",
          "apartment",
          "flat/appartment",
        ]);
      } else if (filters.propertyType === "plots") {
        query = query.in("property_type", [
          ...propertyTypes.Plots.map((type) => type.toLowerCase()),
        ]);
      } else if (filters.propertyType === "commercial") {
        query = query.in("property_type", [
          ...propertyTypes.Commercial.map((type) => type.toLowerCase()),
        ]);
      }
    }

    // Apply price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
      query = query
        .gte("rate", filters.priceRange[0])
        .lte("rate", filters.priceRange[1]);
    }

    // Apply area filter
    if (filters.minArea > 0) {
      query = query.gte("area", filters.minArea);
    }
    if (filters.maxArea < 500) {
      query = query.lte("area", filters.maxArea);
    }

    // Apply beds filter
    if (filters.beds) {
      query = query.gte("beds", filters.beds);
    }

    // Apply baths filter
    if (filters.baths) {
      query = query.gte("baths", filters.baths);
    }

    // Apply search query
    if (filters.searchQuery) {
      query = query.or(
        `name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching filtered properties:", error);
      return [];
    }

    let properties = data.map(transformDatabaseProperty);

    // Post-process price range filter (since rate is stored as text)
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
      properties = properties.filter((property) => {
        const price = parseFloat(property.rate.replace(/,/g, ""));
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
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
