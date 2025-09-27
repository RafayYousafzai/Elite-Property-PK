import { createClient } from "@/utils/supabase/client";
import { properties } from "@/app/api/property";

// Import the old property type for migration purposes
type OldProperty = {
  name: string;
  slug: string;
  location: string;
  rate: string;
  images: { src: string }[];
  area: number;
  beds?: number;
  baths?: number;
  photoSphere?: string;
  propertyType: "house" | "apartment" | "plot";
};

/**
 * Migration utility to help migrate existing static data to Supabase
 * This is a one-time use utility - run this to populate your database
 */
export async function migratePropertiesToSupabase() {
  const supabase = createClient();

  try {
    console.log("Starting migration of properties to Supabase...");

    const migratedProperties = (properties as any[]).map((property: any) => ({
      name: property.name,
      slug: property.slug,
      location: property.location,
      rate: property.rate,
      area: property.area,
      beds: property.beds || null,
      baths: property.baths || null,
      photo_sphere: property.photoSphere || null,
      property_type: property.propertyType,
      images: property.images || [],
    }));

    console.log(`Migrating ${migratedProperties.length} properties...`);

    const { data, error } = await supabase
      .from("properties")
      .insert(migratedProperties)
      .select();

    if (error) {
      console.error("Migration error:", error);
      throw error;
    }

    console.log(`Successfully migrated ${data?.length || 0} properties!`);
    return data;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

/**
 * Utility to clean up all properties (use with caution!)
 */
export async function clearAllProperties() {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("properties")
      .delete()
      .gte("created_at", "1900-01-01");

    if (error) throw error;

    console.log("All properties cleared from database");
  } catch (error) {
    console.error("Failed to clear properties:", error);
    throw error;
  }
}

/**
 * Get migration statistics
 */
export async function getMigrationStats() {
  const supabase = createClient();

  try {
    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return {
      totalPropertiesInDB: count || 0,
      totalStaticProperties: properties.length,
      migrationNeeded: (count || 0) === 0,
    };
  } catch (error) {
    console.error("Failed to get migration stats:", error);
    throw error;
  }
}
