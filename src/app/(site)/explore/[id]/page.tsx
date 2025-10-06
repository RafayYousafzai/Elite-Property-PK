"use client";
import { useState, useEffect } from "react";
import { getPropertyBySlug } from "@/lib/supabase/properties";
import type { Property } from "@/types/property";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ImageCarousel from "@/components/shared/ImageCarousel";
import GoogleMap from "@/components/shared/GoogleMap";
import formatNumberShort from "@/lib/formatNumberShort";

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
        console.log(propertyData);

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
            <div className="w-16 h-16 border-3 border-gray-200 dark:border-gray-700 border-t-amber-600 rounded-full animate-spin"></div>
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
              className="text-gray-300 dark:text-gray-700 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error || "The property you're looking for doesn't exist."}
            </p>
            <Link
              href="/explore"
              className="py-3.5 px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white transition-colors duration-300 inline-block font-medium"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!pt-44 pb-20 relative bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="grid grid-cols-12 items-end gap-6 mb-8">
          <div className="lg:col-span-8 col-span-12">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {property.is_sold ? (
                <span className="px-4 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-500 rounded-lg text-sm font-medium">
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
                <span className="px-4 py-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 rounded-lg text-sm font-medium flex items-center gap-1.5">
                  <Icon icon="ph:star-fill" width={14} height={14} />
                  Featured
                </span>
              )}
            </div>
            <h1 className="lg:text-5xl text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {property.name}
            </h1>
            <div className="flex items-start gap-2.5 mb-2">
              <Icon
                icon="ph:map-pin"
                width={22}
                height={22}
                className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1"
              />
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {property.location}
              </p>
            </div>
            {property.city && (
              <div className="flex items-center gap-2.5">
                <Icon
                  icon="ph:buildings"
                  width={20}
                  height={20}
                  className="text-gray-500 dark:text-gray-400"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {property.city}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <ImageCarousel
            images={property.images || []}
            photoSphere={property.photo_sphere || null}
          />
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="lg:col-span-8 col-span-12 space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Property Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.beds !== null && (
                  <div className="flex flex-col items-center text-center p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                    <Icon
                      icon="ph:bed"
                      width={32}
                      height={32}
                      className="text-amber-600 dark:text-amber-500 mb-3"
                    />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {property.beds}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Bedroom{property.beds !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                {property.baths !== null && (
                  <div className="flex flex-col items-center text-center p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                    <Icon
                      icon="ph:bathtub"
                      width={32}
                      height={32}
                      className="text-amber-600 dark:text-amber-500 mb-3"
                    />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {property.baths}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Bathroom{property.baths !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
                <div className="flex flex-col items-center text-center p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                  <Icon
                    icon="ph:ruler"
                    width={32}
                    height={32}
                    className="text-amber-600 dark:text-amber-500 mb-3"
                  />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {property.area}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {property.area_unit || "Area"}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors">
                  <Icon
                    icon="ph:house"
                    width={32}
                    height={32}
                    className="text-amber-600 dark:text-amber-500 mb-3"
                  />
                  <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                    {property.property_type.replace(/-/g, " ")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Type
                  </p>
                </div>
              </div>
            </div>

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
                      {property.area_unit || ""}
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
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
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
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Installments
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {property.no_of_installments}
                          </p>
                        </div>
                      )}
                      {property.monthly_installments !== null && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
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

            {property.features && Object.keys(property.features).length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(property.features).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
                    >
                      <Icon
                        icon="ph:check-circle-fill"
                        width={20}
                        height={20}
                        className="text-amber-600 dark:text-amber-500 flex-shrink-0"
                      />
                      <div>
                        <p className="text-base font-medium text-gray-900 dark:text-white capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        {typeof value !== "boolean" && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl   ">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                Price
              </p>
              <h4 className="text-gray-900 dark:text-white text-4xl font-bold mb-1">
                {formatNumberShort(Number(property.rate))}
              </h4>
              <div className="h-1 w-16 bg-amber-500 rounded-full mt-3"></div>
            </div>

            <div className="bg-white p-8 rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-gray-900 text-2xl font-bold mb-2">
                  Interested?
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Contact us for more details
                </p>
                <Link
                  href={`https://wa.me/+923344111778?text=${encodeURIComponent(
                    `I'm interested in ${property.name}`
                  )}`}
                  target="_blank"
                  className="py-3.5 px-6 bg-white text-gray-900 rounded-lg w-full block text-center hover:bg-amber-50 hover:text-amber-600 transition-colors duration-300 font-semibold mb-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="ph:whatsapp-logo-fill" width={22} height={22} />
                    WhatsApp
                  </div>
                </Link>
                <Link
                  href="tel:+923344111778"
                  className="py-3.5 px-6 bg-gray-100 text-gray-900 rounded-lg w-full block text-center hover:bg-gray-200 transition-colors duration-300 font-semibold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="ph:phone-fill" width={22} height={22} />
                    Call Now
                  </div>
                </Link>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-xl bg-white dark:bg-gray-900">
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
                      Phase
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold text-sm">
                      {property.phase}
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
  );
}
