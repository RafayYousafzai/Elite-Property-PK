export type Property = {
  id: string;
  name: string;
  slug: string;
  location: string;
  rate: string;
  images: PropertyImage[];
  area: number;
  beds?: number | null;
  baths?: number | null;
  photo_sphere?: string | null;
  property_type: string; // Accept any property type
  description?: string | null;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  // New fields
  features?: Record<string, string | number | boolean>;
  purpose?: string | null;
  property_category?: string | null;
  city?: string | null;
  area_unit?: string | null;
  installment_available?: boolean;
  video_url?: string | null;
  advance_amount?: number | null;
  no_of_installments?: number | null;
  monthly_installments?: number | null;
  constructed_covered_area?: number | null;
  is_sold?: boolean;
  phase?: string | null;
  sector?: string | null;
  street?: string | null;
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
  property_type: string; // Accept any property type
  images: PropertyImage[];
  description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // New fields
  features: Record<string, string | number | boolean> | null;
  purpose: string | null;
  property_category: string | null;
  city: string | null;
  area_unit: string | null;
  installment_available: boolean | null;
  video_url: string | null;
  advance_amount: number | null;
  no_of_installments: number | null;
  monthly_installments: number | null;
  constructed_covered_area: number | null;
  is_sold: boolean | null;
  phase: string | null;
  sector: string | null;
  street: string | null;
};

interface PropertyImage {
  src: string;
}

export interface SearchFilters {
  propertyType: "all" | "homes" | "apartments" | "plots" | "commercial";
  priceRange: [number, number];
  beds?: number;
  baths?: number;
  minArea: number;
  maxArea: number;
  searchQuery: string;
}
