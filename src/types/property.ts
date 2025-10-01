export type Property = {
  id: string;
  name: string;
  slug: string;
  location: string;
  rate: string;
  images: PropertyImage[];
  area: number;
  area_sqft?: number | null;
  area_sqyards?: number | null;
  area_marla?: number | null;
  area_kanal?: number | null;
  beds?: number | null; // Only for homes
  baths?: number | null; // Only for homes
  photo_sphere?: string | null; // Optional for all
  property_type: "house" | "apartment" | "plot";
  description?: string | null; // Property description
  is_featured?: boolean; // Featured property flag
  created_at?: string;
  updated_at?: string;
};

// Database type matching your Supabase table
export type DatabaseProperty = {
  id: string;
  name: string;
  slug: string;
  location: string;
  rate: string;
  area: number;
  area_sqft?: number | null;
  area_sqyards?: number | null;
  area_marla?: number | null;
  area_kanal?: number | null;
  beds: number | null;
  baths: number | null;
  photo_sphere: string | null;
  property_type: "house" | "apartment" | "plot";
  images: PropertyImage[];
  description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

interface PropertyImage {
  src: string;
}

export interface SearchFilters {
  propertyType: "all" | "homes" | "apartments" | "plots";
  priceRange: [number, number];
  beds?: number;
  baths?: number;
  minArea: number;
  maxArea: number;
  searchQuery: string;
}
