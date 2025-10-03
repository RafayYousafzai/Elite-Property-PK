"use client";
import React, { useState, useEffect } from "react";
import { getPropertyBySlug } from "@/lib/supabase/properties";
import { Property } from "@/types/property";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ImageCarousel from "@/components/shared/ImageCarousel";
import GoogleMap from "@/components/shared/GoogleMap";

export default function Details() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || typeof id !== "string") {
        setError("Invalid property ID");
        setLoading(false);
        return;
      }

      try {
        const propertyData = await getPropertyBySlug(id);
        if (propertyData) {
          setProperty(propertyData);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <section className="!pt-44 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="flex items-center justify-center h-screen">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !property) {
    return (
      <section className="!pt-44 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center py-20">
            <Icon
              icon="ph:house-x"
              width={80}
              height={80}
              className="text-dark/20 dark:text-white/20 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">
              Property Not Found
            </h1>
            <p className="text-dark/50 dark:text-white/50 mb-8">
              {error || "The property you're looking for doesn't exist."}
            </p>
            <Link
              href="/explore"
              className="py-4 px-8 bg-primary text-white rounded-full hover:bg-dark duration-300 inline-block"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!pt-44 pb-20 relative">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        {/* Header */}
        <div className="grid grid-cols-12 items-end gap-6 mb-8">
          <div className="lg:col-span-8 col-span-12">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {property.purpose && (
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  For {property.purpose}
                </span>
              )}
              {property.property_category && (
                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {property.property_category}
                </span>
              )}
              {property.is_featured && (
                <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>
            <h1 className="lg:text-5xl text-4xl font-bold text-dark dark:text-white mb-4">
              {property.name}
            </h1>
            <div className="flex items-start gap-2.5 mb-2">
              <Icon
                icon="ph:map-pin"
                width={24}
                height={24}
                className="text-dark/50 dark:text-white/50 flex-shrink-0 mt-1"
              />
              <p className="text-dark/60 dark:text-white/60 text-base">
                {property.location}
              </p>
            </div>
            {property.city && (
              <div className="flex items-center gap-2.5">
                <Icon
                  icon="ph:buildings"
                  width={20}
                  height={20}
                  className="text-dark/50 dark:text-white/50"
                />
                <p className="text-dark/50 dark:text-white/50 text-sm font-medium">
                  {property.city}
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-2xl shadow-lg">
              <p className="text-white/80 text-sm mb-1">Price</p>
              <h4 className="text-white text-4xl font-bold mb-2">
                PKR {Number(property.rate).toLocaleString()}
              </h4>
              {property.area_unit && (
                <p className="text-white/80 text-sm">
                  {property.area} {property.area_unit}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <ImageCarousel
            images={property.images || []}
            photoSphere={property.photo_sphere || undefined}
          />
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="lg:col-span-8 col-span-12 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-dark/10 dark:border-white/10 shadow-sm">
              <h3 className="text-2xl font-semibold text-dark dark:text-white mb-6">
                Property Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.beds !== null && (
                  <div className="flex flex-col items-center text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                    <Icon
                      icon="ph:bed"
                      width={32}
                      height={32}
                      className="text-primary mb-2"
                    />
                    <p className="text-2xl font-bold text-dark dark:text-white">
                      {property.beds}
                    </p>
                    <p className="text-sm text-dark/50 dark:text-white/50">
                      Bedroom{property.beds !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                {property.baths !== null && (
                  <div className="flex flex-col items-center text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                    <Icon
                      icon="ph:bathtub"
                      width={32}
                      height={32}
                      className="text-primary mb-2"
                    />
                    <p className="text-2xl font-bold text-dark dark:text-white">
                      {property.baths}
                    </p>
                    <p className="text-sm text-dark/50 dark:text-white/50">
                      Bathroom{property.baths !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                <div className="flex flex-col items-center text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                  <Icon
                    icon="ph:ruler"
                    width={32}
                    height={32}
                    className="text-primary mb-2"
                  />
                  <p className="text-2xl font-bold text-dark dark:text-white">
                    {property.area}
                  </p>
                  <p className="text-sm text-dark/50 dark:text-white/50">
                    {property.area_unit || "Area"}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                  <Icon
                    icon="ph:house"
                    width={32}
                    height={32}
                    className="text-primary mb-2"
                  />
                  <p className="text-lg font-bold text-dark dark:text-white capitalize">
                    {property.property_type.replace(/-/g, " ")}
                  </p>
                  <p className="text-sm text-dark/50 dark:text-white/50">
                    Type
                  </p>
                </div>
              </div>
            </div>

            {/* Constructed Area */}
            {property.constructed_covered_area && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Icon
                      icon="ph:buildings"
                      width={32}
                      height={32}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-dark dark:text-white">
                      Constructed/Covered Area
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {property.constructed_covered_area}{" "}
                      {property.area_unit || ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Installments */}
            {property.installment_available && (
              <div className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-prfrom-primary-200 dark:border-prfrom-primary-800">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-3">
                      Installment Plan Available
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {property.advance_amount !== null && (
                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                          <p className="text-sm text-dark/50 dark:text-white/50 mb-1">
                            Advance
                          </p>
                          <p className="text-xl font-bold text-prfrom-primary-600 dark:text-prfrom-primary-400">
                            PKR{" "}
                            {Number(property.advance_amount).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {property.no_of_installments !== null && (
                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                          <p className="text-sm text-dark/50 dark:text-white/50 mb-1">
                            Installments
                          </p>
                          <p className="text-xl font-bold text-prfrom-primary-600 dark:text-prfrom-primary-400">
                            {property.no_of_installments}
                          </p>
                        </div>
                      )}
                      {property.monthly_installments !== null && (
                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
                          <p className="text-sm text-dark/50 dark:text-white/50 mb-1">
                            Monthly
                          </p>
                          <p className="text-xl font-bold text-prfrom-primary-600 dark:text-prfrom-primary-400">
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

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="text-2xl font-semibold text-dark dark:text-white mb-4">
                  About This Property
                </h3>
                <div className="text-dark/70 dark:text-white/70 text-base leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && Object.keys(property.features).length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-dark dark:text-white mb-6">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(property.features).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl"
                    >
                      <Icon
                        icon="ph:check-circle-fill"
                        width={24}
                        height={24}
                        className="text-primary flex-shrink-0"
                      />
                      <div>
                        <p className="text-base font-medium text-dark dark:text-white capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        {typeof value !== "boolean" && (
                          <p className="text-sm text-dark/50 dark:text-white/50">
                            {String(value)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {property.video_url && (
              <div>
                <h3 className="text-2xl font-semibold text-dark dark:text-white mb-6">
                  Property Video Tour
                </h3>
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 shadow-lg">
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

            {/* Map */}
            <div>
              <h3 className="text-2xl font-semibold text-dark dark:text-white mb-6 flex items-center gap-2">
                Location
              </h3>
              {property.location ? (
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <GoogleMap
                    address={property.location}
                    height="400"
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Location not available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 col-span-12 space-y-6">
            {/* Contact */}
            <div className="bg-gradient-to-br from-primary to-primary/90 p-8 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <h4 className="text-white text-2xl font-bold mb-2">
                  Interested?
                </h4>
                <p className="text-white/90 text-sm mb-6">
                  Contact us for more details
                </p>
                <Link
                  href={`https://wa.me/+923344111778?text=${encodeURIComponent(
                    `I'm interested in ${property.name}`
                  )}`}
                  target="_blank"
                  className="py-4 px-8 bg-white text-primary rounded-full w-full block text-center hover:bg-gray-100 duration-300 font-semibold mb-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="ph:whatsapp-logo-fill" width={24} height={24} />
                    WhatsApp
                  </div>
                </Link>
                <Link
                  href="tel:+923344111778"
                  className="py-4 px-8 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full w-full block text-center hover:bg-white/20 duration-300 font-semibold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="ph:phone-fill" width={24} height={24} />
                    Call Now
                  </div>
                </Link>
              </div>
            </div>

            {/* Details */}
            <div className="border border-dark/10 dark:border-white/20 p-6 rounded-2xl bg-white dark:bg-gray-800/50">
              <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">
                Property Details
              </h4>
              <div className="space-y-3">
                {property.property_type && (
                  <div className="flex justify-between items-center py-3 border-b border-dark/5 dark:border-white/5">
                    <span className="text-dark/60 dark:text-white/60 text-sm">
                      Type
                    </span>
                    <span className="text-dark dark:text-white font-semibold capitalize">
                      {property.property_type.replace(/-/g, " ")}
                    </span>
                  </div>
                )}
                {property.purpose && (
                  <div className="flex justify-between items-center py-3 border-b border-dark/5 dark:border-white/5">
                    <span className="text-dark/60 dark:text-white/60 text-sm">
                      Purpose
                    </span>
                    <span className="text-dark dark:text-white font-semibold">
                      For {property.purpose}
                    </span>
                  </div>
                )}
                {property.city && (
                  <div className="flex justify-between items-center py-3 border-b border-dark/5 dark:border-white/5">
                    <span className="text-dark/60 dark:text-white/60 text-sm">
                      City
                    </span>
                    <span className="text-dark dark:text-white font-semibold">
                      {property.city}
                    </span>
                  </div>
                )}
                {property.created_at && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-dark/60 dark:text-white/60 text-sm">
                      Listed
                    </span>
                    <span className="text-dark dark:text-white font-semibold">
                      {new Date(property.created_at).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
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
  );
}
