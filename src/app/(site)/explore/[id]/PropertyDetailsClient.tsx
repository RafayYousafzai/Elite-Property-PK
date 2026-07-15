"use client";

import { useEffect } from "react";
import type { Property } from "@/types/property";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ImageCarousel from "@/components/shared/ImageCarousel";
import GoogleMap from "@/components/shared/GoogleMap";
import formatNumberShort from "@/lib/formatNumberShort";
import { formatLocation } from "@/lib/utils";

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
  // Send ViewContent event when property loads
  useEffect(() => {
    if (!property) return;

    const sendViewContentEvent = () => {
      // Send to Meta Pixel (browser-side)
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
      <style>{`
        @keyframes executive-shake {
          0%, 85%, 100% { transform: translateX(0); }
          88%, 92%, 96% { transform: translateX(-2px); }
          90%, 94%, 98% { transform: translateX(2px); }
        }
        .executive-shake-card {
          animation: executive-shake 5s ease-in-out infinite;
        }
      `}</style>
      <section className="!pt-24 md:!pt-44 pb-32 md:pb-20 relative bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="grid grid-cols-12 items-center gap-6 mb-8">
            {/* Left Column: Title & Location Details */}
            <div className="lg:col-span-8 col-span-12">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {property.is_sold ? (
                  <span className="px-4 py-1.5 bg-red-50 dark:bg-red-955/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-500 rounded-lg text-sm font-medium">
                    SOLD
                  </span>
                ) : (
                  property.purpose && (
                    <span className="px-4 py-1.5 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 rounded-lg text-sm font-medium">
                      For {property.purpose}
                    </span>
                  )
                )}
                {property.property_category && (
                  <span className="px-4 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                    {property.property_category}
                  </span>
                )}
                {property.is_featured && (
                  <span className="px-4 py-1.5 bg-amber-50 dark:bg-amber-955/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 rounded-lg text-sm font-medium flex items-center gap-1.5">
                    <Icon icon="ph:star-fill" width={14} height={14} />
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="lg:text-4xl text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {property.name}
              </h1>
              
              <div className="flex flex-row items-center justify-between gap-4 mt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="ph:map-pin"
                      width={18}
                      height={18}
                      className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                    />
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-extrabold leading-none">
                      {formatLocation(property.location)}
                    </p>
                  </div>
                  {property.city && (
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="ph:buildings"
                        width={16}
                        height={16}
                        className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                      />
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold leading-none">
                        {property.city}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mobile-only Callback Pulse Button */}
                <div className="lg:hidden block shrink-0">
                  <Link
                    href="/request-callback"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#d4af37] hover:bg-[#c19d2f] text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm hover:shadow-md executive-shake-card"
                  >
                    <Icon icon="solar:phone-calling-bold" className="w-3.5 h-3.5" />
                    <span>Request Call</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Desktop Callback Panel (lg:col-span-4, hidden on mobile) */}
            <div className="lg:col-span-4 col-span-12 hidden lg:block">
              <div className="border border-[#d4af37]/30 dark:border-zinc-800 bg-gradient-to-br from-[#d4af37]/[0.05] to-transparent dark:bg-zinc-900 rounded-2xl p-6 flex flex-col justify-between min-h-[145px] hover:shadow-md transition-all duration-300 executive-shake-card shadow-xs">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight leading-tight uppercase">
                    Want an Executive Call Back?
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                    Discuss pricing, installment plans, and DHA listings with our executive property experts.
                  </p>
                </div>
                
                <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                  <Link
                    href="/request-callback"
                    className="w-full inline-flex items-center justify-center py-2.5 bg-[#d4af37] hover:bg-[#c19d2f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-150"
                  >
                    Request Call Back
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Top Section Grid: Image Carousel (Left) & Pricing/Contact Card (Right) on Desktop */}
          <div className="grid grid-cols-12 gap-8 mb-10">
            {/* Left Column: Carousel & Mobile CTA & Property Overview */}
            <div className="lg:col-span-8 col-span-12 space-y-6">
              <ImageCarousel
                images={property.images || []}
                photoSphere={property.photo_sphere || null}
              />
              {/* Mobile-only Price & CTA Card (Shown directly below carousel) */}
              <div className="lg:hidden bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Price</span>
                  <span className="text-2xl font-black text-primary">
                    {formatNumberShort(Number(property.rate))}
                  </span>
                </div>
                <div className="flex gap-3">
                  <a
                    href="tel:+923344111778"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
                  >
                    <Icon icon="solar:phone-calling-linear" className="w-4.5 h-4.5" />
                    <span>Call Agent</span>
                  </a>
                  <a
                    href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I'm interested in: ${property.name} (${formatNumberShort(Number(property.rate))})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm bg-white dark:bg-slate-900"
                  >
                    <Icon icon="ph:whatsapp-logo-fill" className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Mobile-only Compact Property Overview Card */}
              <div className="lg:hidden border border-gray-200 dark:border-gray-800 p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Property Overview
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {property.beds !== null && (
                    <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850">
                      <Icon
                        icon="ph:bed"
                        width={18}
                        height={18}
                        className="text-amber-600 dark:text-amber-500 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Beds</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5">
                          {property.beds}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.baths !== null && (
                    <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850">
                      <Icon
                        icon="ph:bathtub"
                        width={18}
                        height={18}
                        className="text-amber-600 dark:text-amber-500 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Baths</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5">
                          {property.baths}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850">
                    <Icon
                      icon="ph:ruler"
                      width={18}
                      height={18}
                      className="text-amber-600 dark:text-amber-500 shrink-0"
                    />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Area</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5 truncate max-w-[80px]">
                        {property.area} {property.area_unit || "Sq Ft"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850">
                    <Icon
                      icon="ph:house"
                      width={18}
                      height={18}
                      className="text-amber-600 dark:text-amber-500 shrink-0"
                    />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Type</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5 capitalize truncate max-w-[80px]">
                        {property.property_type.replace(/-/g, " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Contact Sidebar Card (Desktop Only) */}
            <div className="lg:col-span-4 col-span-12 hidden lg:flex flex-col gap-6">
              {/* Price Box */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Price
                </p>
                <h4 className="text-gray-900 dark:text-white text-4xl font-bold mb-1">
                  {formatNumberShort(Number(property.rate))}
                </h4>
                <div className="h-1 w-16 bg-amber-500 rounded-full mt-3"></div>
              </div>

              {/* Compact Contact Box */}
              <div className="bg-white p-5 rounded-xl relative overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="relative z-10">
                  <h4 className="text-gray-900 text-lg font-bold mb-1">
                    Interested?
                  </h4>
                  <p className="text-gray-600 text-xs mb-4">
                    Contact us for more details
                  </p>
                  <Link
                    href="tel:+923344111778"
                    className="py-2.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl w-full block text-center transition duration-200 font-bold mb-3 shadow-sm text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon="solar:phone-calling-linear" width={18} height={18} />
                      Call Agent
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && window.fbq) {
                        window.fbq(
                          "track",
                          "Lead",
                          {
                            content_name: property.name,
                            content_category: "WhatsApp Contact",
                            value: Number(property.rate) || 0,
                            currency: "PKR",
                          }
                        );
                      }

                      window.open(
                        `https://wa.me/+923344111778?text=${encodeURIComponent(
                          `I'm interested in ${property.name}`
                        )}`,
                        "_blank"
                      );
                    }}
                    className="py-2.5 px-4 border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-xl w-full block text-center hover:bg-black/5 dark:hover:bg-white/5 transition duration-200 font-bold shadow-sm text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon icon="ph:whatsapp-logo-fill" width={18} height={18} className="text-emerald-600 dark:text-emerald-400" />
                      WhatsApp
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="lg:col-span-8 col-span-12 space-y-8">

              {property.constructed_covered_area && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-amber-200 dark:border-amber-900/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <Icon
                        icon="ph:buildings"
                        width={28}
                        height={28}
                        className="text-amber-600 dark:text-amber-500"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Constructed/Covered Area
                      </h4>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {property.constructed_covered_area}{" "}
                        <span className="font-light">Sqr Ft</span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {property.installment_available && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Icon
                          icon="ph:credit-card"
                          width={24}
                          height={24}
                          className="text-amber-600 dark:text-amber-500"
                        />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Installment Plan Available
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {property.advance_amount !== null && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-850">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Advance
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              PKR{" "}
                              {Number(property.advance_amount).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {property.no_of_installments !== null && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-850">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Installments
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {property.no_of_installments}
                            </p>
                          </div>
                        )}
                        {property.monthly_installments !== null && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-850">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Monthly
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              PKR{" "}
                              {Number(
                                property.monthly_installments
                              ).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {property.description && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    About This Property
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 text-base leading-relaxed whitespace-pre-line">
                    {property.description}
                  </div>
                </div>
              )}

              {/* Mobile-only Property Details (Shown above Features & Amenities on phone) */}
              <div className="lg:hidden border border-gray-200 dark:border-gray-800 p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Property Details
                </h4>
                <div className="space-y-1">
                  {property.property_type && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">Type</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white capitalize">
                        {property.property_type.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                  {property.is_sold ? (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">Status</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Sold</span>
                    </div>
                  ) : property.purpose ? (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">Purpose</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">For {property.purpose}</span>
                    </div>
                  ) : null}
                  {property.city && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">City</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{property.city}</span>
                    </div>
                  )}
                  {property.phase && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">DHA Phase</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {property.phase.toLowerCase().startsWith("dha") ? property.phase : `DHA ${property.phase}`}
                      </span>
                    </div>
                  )}
                  {property.sector && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">Sector</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{property.sector}</span>
                    </div>
                  )}
                  {property.street && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 text-xs font-medium">Street</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{property.street}</span>
                    </div>
                  )}
                  {property.created_at && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-xs font-medium">Listed</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {new Date(property.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {property.features && Object.keys(property.features).length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-5">
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {Object.entries(property.features).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
                      >
                        <Icon
                          icon="ph:check-circle-fill"
                          width={16}
                          height={16}
                          className="text-amber-600 dark:text-amber-500 flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          {typeof value !== "boolean" && (
                            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                              {String(value)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.video_url && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Property Video Tour
                  </h3>
                  <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
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
                      title="Property Video"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Icon
                    icon="ph:map-pin"
                    width={24}
                    height={24}
                    className="text-amber-600 dark:text-amber-500"
                  />
                  Location
                </h3>
                {property.location ? (
                  <div className="rounded-lg overflow-hidden">
                    <GoogleMap
                      address={property.location}
                      height="400"
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      Location not available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 col-span-12 space-y-6">
              {/* Compact Property Overview Widget (Desktop Only) */}
              <div className="hidden lg:block border border-gray-200 dark:border-gray-800 p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Property Overview
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {property.beds !== null && (
                    <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                      <Icon
                        icon="ph:bed"
                        width={18}
                        height={18}
                        className="text-amber-600 dark:text-amber-500 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Beds</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5">
                          {property.beds}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.baths !== null && (
                    <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                      <Icon
                        icon="ph:bathtub"
                        width={18}
                        height={18}
                        className="text-amber-600 dark:text-amber-500 shrink-0"
                      />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Baths</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5">
                          {property.baths}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                    <Icon
                      icon="ph:ruler"
                      width={18}
                      height={18}
                      className="text-amber-600 dark:text-amber-500 shrink-0"
                    />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Area</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5 truncate max-w-[80px]">
                        {property.area} {property.area_unit || "Sq Ft"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-850 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                    <Icon
                      icon="ph:house"
                      width={18}
                      height={18}
                      className="text-amber-600 dark:text-amber-500 shrink-0"
                    />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Type</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5 capitalize truncate max-w-[80px]">
                        {property.property_type.replace(/-/g, " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block border border-gray-200 dark:border-gray-800 p-6 rounded-xl bg-white dark:bg-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                  Property Details
                </h4>
                <div className="space-y-1">
                  {property.property_type && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Type
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold capitalize text-sm">
                        {property.property_type.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                  {property.is_sold ? (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Status
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        Sold
                      </span>
                    </div>
                  ) : property.purpose ? (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Purpose
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        For {property.purpose}
                      </span>
                    </div>
                  ) : null}
                  {property.city && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        City
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        {property.city}
                      </span>
                    </div>
                  )}
                  {property.phase && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        DHA Phase
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        {property.phase.toLowerCase().startsWith("dha") ? property.phase : `DHA ${property.phase}`}
                      </span>
                    </div>
                  )}
                  {property.sector && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Sector
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        {property.sector}
                      </span>
                    </div>
                  )}
                  {property.street && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Street
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        {property.street}
                      </span>
                    </div>
                  )}
                  {property.created_at && (
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Listed
                      </span>
                      <span className="text-gray-900 dark:text-white font-semibold text-sm">
                        {new Date(property.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar for Mobile CTA - Clean & Instant Reach */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-black/10 dark:border-white/10 px-4 py-3.5 flex gap-3 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <a
          href="tel:+923344111778"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
        >
          <Icon icon="solar:phone-calling-linear" className="w-4.5 h-4.5" />
          <span>Call Now</span>
        </a>
        <a
          href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I'm interested in: ${property.name} (${formatNumberShort(Number(property.rate))})`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
        >
          <Icon icon="ph:whatsapp-logo-fill" className="w-4.5 h-4.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}
