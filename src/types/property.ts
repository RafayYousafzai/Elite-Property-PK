export interface PropertyHome {
  name: string;
  slug: string;
  location: string;
  rate: string;
  beds: number;
  baths: number;
  area: number;
  photoSphere: string;
  images: Array<{
    src: string;
  }>;
}

export interface PropertyPlot {
  name: string;
  slug: string;
  location: string;
  rate: string;
  area: number;
  photoSphere: string;
  images: Array<{
    src: string;
  }>;
}

export type Property = PropertyHome | PropertyPlot;

export interface SearchFilters {
  propertyType: "all" | "homes" | "plots";
  priceRange: [number, number];
  beds?: number;
  baths?: number;
  minArea: number;
  maxArea: number;
  searchQuery: string;
}
