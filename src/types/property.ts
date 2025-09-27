export type Property = {
  id: string;
  name: string;
  slug: string;
  location: string;
  rate: string;
  images: PropertyImage[];
  area: number;
  beds?: number | null; // Only for homes
  baths?: number | null; // Only for homes
  photo_sphere?: string | null; // Optional for all
  property_type: "house" | "apartment" | "plot";
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
  beds: number | null;
  baths: number | null;
  photo_sphere: string | null;
  property_type: "house" | "apartment" | "plot";
  images: PropertyImage[];
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
