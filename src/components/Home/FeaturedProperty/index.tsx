"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { formatLocation, getImageUrl, getThumbnailUrl } from "@/lib/utils";
import formatNumberShort from "@/lib/formatNumberShort";
import { ArrowRight, ChevronLeft, ChevronRight, Bed, Bath, Maximize2 } from "lucide-react";

interface FeaturedPropertyProps {
  properties: Property[];
}

const FeaturedProperty: React.FC<FeaturedPropertyProps> = ({ properties }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 lg:py-20 overflow-hidden w-full">
      <div className="container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0">
        {/* Header Bar Aligned To Container Grid */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase block mb-2">
              EXCLUSIVE LISTINGS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Properties
            </h2>
          </div>

          {/* Navigation Scroll Controls */}
          {properties.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-none border-0"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-none border-0"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Scroll Track: Aligned to left container margin, extends to right screen edge */}
        <div className="relative -mr-4 sm:-mr-6 lg:-mr-8 2xl:-mr-[50vw]">
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 pr-12 sm:pr-24 lg:pr-32"
          >
            {properties.map((property) => {
              const mainImage = property.images?.[0]
                ? getThumbnailUrl(property.images[0])
                : "/images/placeholder.jpg";

              return (
                <div
                  key={property.id || property.slug}
                  className="w-[90vw] sm:w-[680px] md:w-[840px] lg:w-[980px] shrink-0 snap-start"
                >
                  <div className="group relative h-[450px] sm:h-[520px] lg:h-[580px] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-none border-0">
                    {/* Hero Background Image */}
                    <Image
                      src={mainImage}
                      alt={property.name}
                      fill
                      sizes="(max-width: 768px) 85vw, 720px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={false}
                      onError={(e) => {
                        if (property.images?.[0]) {
                          (e.currentTarget as HTMLImageElement).src = getImageUrl(property.images[0]);
                        }
                      }}
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    {/* Top Badge: Purpose */}
                    {property.purpose && (
                      <div className="absolute top-5 left-5 z-10">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border-0">
                          {property.purpose === "Rent" ? "For Rent" : "For Sale"}
                        </span>
                      </div>
                    )}

                    {/* Bottom Overlaid Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 flex flex-col justify-end space-y-4">
                      {/* Location Badge */}
                      <div className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                        {formatLocation(property.location)}
                      </div>

                      {/* Property Title */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white line-clamp-1">
                        {property.name}
                      </h3>

                      {/* Price Row & Action Button */}
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight block">
                            {formatNumberShort(Number(property.rate))}
                          </span>
                        </div>

                        <Link
                          href={`/explore/${property.slug}`}
                          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white/20 hover:bg-primary backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shrink-0 border-0 group/btn"
                          aria-label={`View details for ${property.name}`}
                        >
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                        </Link>
                      </div>

                      {/* Spec Bar */}
                      <div className="pt-3 border-t border-white/20 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-200">
                        {property.beds && (
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-primary" />
                            <span>{property.beds} Beds</span>
                          </div>
                        )}
                        {property.baths && (
                          <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-primary" />
                            <span>{property.baths} Baths</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-1.5">
                            <Maximize2 className="w-4 h-4 text-primary" />
                            <span>
                              {property.area} {property.area_unit || "Sq Ft"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperty;
