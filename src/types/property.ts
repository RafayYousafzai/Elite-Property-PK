export type Property = {
  name: string;
  slug: string;
  location: string;
  rate: string;
  images: PropertyImage[];
  area: number;
  beds?: number; // Only for homes
  baths?: number; // Only for homes
  photoSphere?: string; // Optional for all
  propertyType: "house" | "apartment" | "plot";
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
