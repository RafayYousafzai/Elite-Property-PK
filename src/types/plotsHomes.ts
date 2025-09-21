export type PlotsHomes = {
  name: string;
  slug: string;
  location: string;
  rate: string;
  area: number;
  images: PlotsImage[];
  photoSphere: string;
};

interface PlotsImage {
  src: string;
}
