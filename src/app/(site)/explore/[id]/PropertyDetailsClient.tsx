"use client";

import { useEffect, useState } from "react";
import type { Property } from "@/types/property";
import { Icon } from "@iconify/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import formatNumberShort from "@/lib/formatNumberShort";
import { formatLocation, getImageUrl } from "@/lib/utils";
import { getBedsCount, getBathsCount } from "@/lib/supabase/properties";

const PhotoSphereViewer = dynamic(() => import("@/components/shared/PhotoSphereViewer"), {
  ssr: false,
});
const LightboxModal = dynamic(() => import("@/components/shared/LightboxModal"), {
  ssr: false,
});

// Extend Window interface for Meta Pixel
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      data?: object,
      options?: object
    ) => void;
  }
}

interface PropertyDetailsClientProps {
  property: Property;
}

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = property.images && property.images.length > 0 ? property.images : [];
  const heroImage = getImageUrl(images[0]);
  const formattedPrice = formatNumberShort(Number(property.rate)).replace("Rs", "PKR");
  const bedNum = getBedsCount(property);
  const bathNum = getBathsCount(property);

  const lightboxSlides = images.map((img) => ({
    src: getImageUrl(img),
  }));

  // Send ViewContent event when property loads
  useEffect(() => {
    if (!property) return;

    const sendViewContentEvent = () => {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq(
          "track",
          "ViewContent",
          {
            content_name: property.name,
            content_category: property.property_type,
            content_ids: [property.id],
            content_type: "product",
            value: Number(property.rate) || 0,
            currency: "PKR",
          }
        );
      }
    };

    sendViewContentEvent();
  }, [property]);

  return (
    <>
      <div className="w-full max-w-full overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        {/* Fullscreen Hero Background Section */}
        <section className="!py-0 relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-end">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url(${heroImage})` }}
          />

          {/* Dark Overlay Gradient Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-black/40 pointer-events-none" />

          {/* Overlay Hero Content (Bottom Positioned with Top Padding for Navbar) */}
          <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-40 pb-20 sm:pb-12 space-y-3 sm:space-y-4">
            {/* Purpose & Category Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {property.is_sold ? (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg">
                  SOLD
                </span>
              ) : (
                property.purpose && (
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-primary text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg">
                    FOR {property.purpose}
                  </span>
                )
              )}
              {property.property_category && (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg">
                  {property.property_category}
                </span>
              )}
              {property.property_type && (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/10 backdrop-blur-md text-slate-300 text-[10px] sm:text-xs font-medium capitalize rounded-lg">
                  {property.property_type.replace(/-/g, " ")}
                </span>
              )}
            </div>

            {/* Main Property Title */}
            <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md max-w-4xl line-clamp-3 sm:line-clamp-none">
              {property.name}
            </h1>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-4xl font-black text-primary tracking-tight">
                {formattedPrice}
              </span>
            </div>

            {/* Key Specs Bar (Beds, Baths, Area, Location) */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-200 flex-wrap pt-0.5">
              {bedNum > 0 && (
                <span className="flex items-center gap-1">
                  <Icon icon="solar:bed-linear" className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                  {bedNum} Beds
                </span>
              )}
              {bathNum > 0 && (
                <span className="flex items-center gap-1">
                  <Icon icon="solar:bath-linear" className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                  {bathNum} Baths
                </span>
              )}
              {property.area && (
                <span className="flex items-center gap-1">
                  <Icon icon="lineicons:arrow-all-direction" className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                  {property.area} {property.area_unit || "Sq Ft"}
                </span>
              )}
              {property.location && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Icon icon="ph:map-pin" className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                  {formatLocation(property.location)}
                </span>
              )}
            </div>

            {/* Action Buttons & Gallery Trigger */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 flex-wrap">
              <a
                href="tel:+923344111778"
                className="flex-1 sm:flex-none h-11 px-4 sm:px-5 rounded-xl bg-primary hover:bg-primary/90 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition border-0 shadow-none"
              >
                <Icon icon="solar:phone-calling-linear" className="w-4 h-4" />
                <span>Call Agent</span>
              </a>

              <a
                href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I'm interested in: ${property.name} (${formattedPrice})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none h-11 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition border-0 shadow-none"
              >
                <Icon icon="ph:whatsapp-logo-fill" className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  className="w-full sm:w-auto h-11 px-4 sm:px-5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition border-0 shadow-none cursor-pointer"
                >
                  <Icon icon="ph:images-fill" className="w-4 h-4 text-primary" />
                  <span>See More Photos ({images.length})</span>
                </button>
              )}
            </div>

            {/* Photo Reel (Visible on Mobile & Desktop) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pt-2 pb-1 no-scrollbar max-w-full">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                    className="relative w-16 h-12 sm:w-24 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-white/30 hover:border-primary transition-all cursor-pointer opacity-90 hover:opacity-100"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    {idx === 4 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold z-10">
                        +{images.length - 5}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Animated Scroll Down Indicator */}
          <div className="relative z-10 flex justify-center pb-3 sm:pb-4">
            <a
              href="#about-details"
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-primary transition-colors cursor-pointer group"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                Scroll For Details
              </span>
              <Icon icon="ph:caret-double-down-bold" className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce text-primary" />
            </a>
          </div>
        </section>

        {/* Borderless & Shadowless Details Flow */}
        <section id="about-details" className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 space-y-12 border-0">
          {/* Constructed / Covered Area Highlight */}
          {property.constructed_covered_area && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                Constructed Covered Area
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {property.constructed_covered_area} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">Sq Ft</span>
              </p>
            </div>
          )}

          {/* Property Overview Specifications */}
          <div className="space-y-4 -mt-10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Property Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
              {property.property_type && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Property Type</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {property.property_type.replace(/-/g, " ")}
                  </p>
                </div>
              )}
              {property.purpose && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Purpose</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">For {property.purpose}</p>
                </div>
              )}
              {property.city && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">City</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{property.city}</p>
                </div>
              )}
              {property.phase && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">DHA Phase</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {property.phase.toLowerCase().startsWith("dha") ? property.phase : `DHA ${property.phase}`}
                  </p>
                </div>
              )}
              {property.sector && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sector</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{property.sector}</p>
                </div>
              )}
              {property.street && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Street</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{property.street}</p>
                </div>
              )}
              {property.created_at && (
                <div className="space-y-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Date Listed</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(property.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Installment Plan */}
          {property.installment_available && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon icon="ph:credit-card" className="w-5 h-5 text-primary" />
                <span>Installment Plan Available</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {property.advance_amount !== null && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 space-y-1 border-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Advance Amount</p>
                    <p className="text-lg font-bold text-primary">
                      PKR {Number(property.advance_amount).toLocaleString()}
                    </p>
                  </div>
                )}
                {property.no_of_installments !== null && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 space-y-1 border-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No. of Installments</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {property.no_of_installments}
                    </p>
                  </div>
                )}
                {property.monthly_installments !== null && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 space-y-1 border-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Installment</p>
                    <p className="text-lg font-bold text-primary">
                      PKR {Number(property.monthly_installments).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Property Description */}
          {property.description && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">About This Property</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-4xl">
                {property.description}
              </p>
            </div>
          )}



          {/* Features & Amenities */}
          {property.features && Object.keys(property.features).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {Object.entries(property.features).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start sm:items-center gap-2 py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 text-xs font-medium border-0 min-w-0"
                  >
                    <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                    <div className="flex-1 min-w-0 break-words">
                      <span className="capitalize">{key.replace(/_/g, " ")}</span>
                      {typeof value !== "boolean" && value && String(value).trim() !== "" && (
                        <span className="text-slate-500 dark:text-slate-400 ml-1 font-normal break-all">
                          ({String(value)})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* 360° Photo Sphere (If available) */}
          {property.photo_sphere && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon icon="ph:cube" className="w-5 h-5 text-primary" />
                <span>360° Photo Sphere</span>
              </h3>
              <div className="rounded-2xl overflow-hidden h-[450px]">
                <PhotoSphereViewer src={property.photo_sphere} height="450px" />
              </div>
            </div>
          )}

          {/* Property Video Tour (If available) */}
          {property.video_url && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon icon="ph:youtube-logo-fill" className="w-5 h-5 text-red-500" />
                <span>Property Video Tour</span>
              </h3>
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900">
                <iframe
                  src={
                    property.video_url.includes("youtube.com") ||
                    property.video_url.includes("youtu.be")
                      ? property.video_url
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "youtube.com/embed/")
                      : property.video_url
                  }
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Property Video"
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Interactive Lightbox Modal for Photo Carousel */}
      {/* Interactive Lightbox Modal for Photo Carousel */}
      {lightboxOpen && (
        <LightboxModal
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
        />
      )}
    </>
  );
}
