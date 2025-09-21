export type PropertyHomes = {
  name: string;
  slug: string;
  location: string;
  rate: string;
  beds: number;
  baths: number;
  area: number;
  images: PropertyImage[];
  photoSphere: string;
};

interface PropertyImage {
  src: string;
}
