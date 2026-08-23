"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/types/property";

const ParallaxScroll = dynamic(
  () => import("@/components/ui/parallax-scroll").then((mod) => mod.ParallaxScroll),
  { ssr: false }
);

const VideoShowcase = dynamic(
  () => import("@/components/shared/video-showcase"),
  { ssr: false }
);

const LocationMap = dynamic(
  () => import("@/components/Home/Office"),
  { ssr: false }
);

const Testimonial = dynamic(
  () => import("@/components/Home/Testimonial/TestimonialsServer"),
  { ssr: false }
);

const videoList = [
  {
    id: "1",
    title: "Casa Prisma – Modern Design Meets Timeless Elegance",
    description:
      "Tour Casa Prisma, a stunning fusion of sleek modern architecture and classic luxury — redefining elegant living.",
    youtubeId: "https://www.youtube.com/watch?v=mTwsTzWOzA8",
  },
  {
    id: "2",
    title: "Villa Arista – 1 Kanal Modern Designer House",
    description:
      "Step inside Villa Arista in DHA Phase 2, Islamabad — a 1 Kanal masterpiece featuring 3D marble elevation and premium interiors.",
    youtubeId: "https://www.youtube.com/watch?v=mmrFAQyZUbU",
  },
  {
    id: "3",
    title: "Villa Novella – 2 Kanal Italian Dream Home",
    description:
      "Explore Villa Novella, an Italian-inspired 2 Kanal luxury villa with multi-level design, grand spaces, and modern interiors.",
    youtubeId: "https://www.youtube.com/watch?v=WLnZEtiRZO0",
  },
  {
    id: "4",
    title: "Ultra Modern 1 Kanal Straight Line House",
    description:
      "A sleek, ultra-modern straight-line residence in DHA Phase 2, Islamabad — minimalist elegance meets smart architecture.",
    youtubeId: "https://www.youtube.com/watch?v=DfdVx44EClk",
  },
  {
    id: "5",
    title: "The Prestige Manor – 1 Kanal Elite Luxury",
    description:
      "Experience The Prestige Manor: a 1 Kanal luxury home in DHA Phase 2, crafted with elite finishing and refined sophistication.",
    youtubeId: "https://www.youtube.com/watch?v=qlL4TzZD3wU",
  },
  {
    id: "6",
    title: "The Grand Haven – 1 Kanal Luxury Residence",
    description:
      "Discover The Grand Haven, a lavish 1 Kanal residence in DHA Phase 2 featuring elite finishes and contemporary architecture.",
    youtubeId: "https://youtu.be/kSyNG7QE93M?si=XLAmujqLz11DQgWr",
  },
];

interface HomeClientSectionsProps {
  featuredProperties: Property[];
}

export function HomeParallaxSection({ featuredProperties }: HomeClientSectionsProps) {
  return <ParallaxScroll items={featuredProperties} />;
}

export function HomeVideoSection() {
  return <VideoShowcase videos={videoList} />;
}

export function HomeLocationSection() {
  return <LocationMap />;
}

export function HomeTestimonialSection() {
  return <Testimonial />;
}
