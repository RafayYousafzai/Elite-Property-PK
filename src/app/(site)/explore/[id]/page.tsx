"use client";
import React, { useState, useEffect } from "react";
import { getPropertyBySlug } from "@/lib/supabase/properties";
import { Property } from "@/types/property";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { testimonials } from "@/app/api/testimonial";
import Link from "next/link";
import Image from "next/image";
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

  console.log(property);

  if (loading) {
    return (
      <section className="!pt-44 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !property) {
    return (
      <section className="!pt-44 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">
              Property Not Found
            </h1>
            <p className="text-dark/50 dark:text-white/50 mb-8">
              {error || "The property you're looking for doesn't exist."}
            </p>
            <Link
              href="/explore"
              className="py-4 px-8 bg-primary text-white rounded-full hover:bg-dark duration-300"
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
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="lg:col-span-8 col-span-12">
            <h1 className="lg:text-52 text-40 font-semibold text-dark dark:text-white">
              {property?.name}
            </h1>
            <div className="flex gap-2.5">
              <Icon
                icon="ph:map-pin"
                width={24}
                height={24}
                className="text-dark/50 dark:text-white/50"
              />
              <p className="text-dark/50 dark:text-white/50 text-xm">
                {property?.location}
              </p>
            </div>
          </div>
          {property?.beds && property?.baths && property?.area && (
            <div className="lg:col-span-4 col-span-12">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-2 border-e border-black/10 dark:border-white/20 pr-2 xs:pr-4 mobile:pr-8">
                  <Icon icon={"solar:bed-linear"} width={20} height={20} />
                  <p className="text-sm mobile:text-base font-normal text-black dark:text-white">
                    {property?.beds} Bedrooms
                  </p>
                </div>
                <div className="flex flex-col gap-2 border-e border-black/10 dark:border-white/20 px-2 xs:px-4 mobile:px-8">
                  <Icon icon={"solar:bath-linear"} width={20} height={20} />
                  <p className="text-sm mobile:text-base font-normal text-black dark:text-white">
                    {property?.baths} Bathrooms
                  </p>
                </div>
                <div className="flex flex-col gap-2 pl-2 xs:pl-4 mobile:pl-8">
                  <Icon
                    icon={"lineicons:arrow-all-direction"}
                    width={20}
                    height={20}
                  />
                  <p className="text-sm mobile:text-base font-normal text-black dark:text-white">
                    {property?.area} sq ft
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Professional Image Carousel with 360° Viewer */}
        <ImageCarousel
          images={property?.images || []}
          photoSphere={property?.photo_sphere || undefined}
        />
        <div className="grid grid-cols-12 gap-8 mt-32 md:mt-10">
          <div className="lg:col-span-8 col-span-12">
            <h3 className="text-xl font-medium">Property details</h3>
            <div className="py-8 my-8 border-y border-dark/10 dark:border-white/20 flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <div>
                  <Image
                    src="/images/SVGs/property-details.svg"
                    width={400}
                    height={500}
                    alt=""
                    className="w-8 h-8 dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src="/images/SVGs/property-details-white.svg"
                    width={400}
                    height={500}
                    alt=""
                    className="w-8 h-8 dark:block hidden"
                    unoptimized={true}
                  />
                </div>
                <div>
                  <h3 className="text-dark dark:text-white text-xm">
                    Property details
                  </h3>
                  <p className="text-base text-dark/50 dark:text-white/50">
                    One of the few homes in the area with a private pool.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <Image
                    src="/images/SVGs/smart-home-access.svg"
                    width={400}
                    height={500}
                    alt=""
                    className="w-8 h-8 dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src="/images/SVGs/smart-home-access-white.svg"
                    width={400}
                    height={500}
                    alt=""
                    className="w-8 h-8 dark:block hidden"
                    unoptimized={true}
                  />
                </div>
                <div>
                  <h3 className="text-dark dark:text-white text-xm">
                    Smart home access
                  </h3>
                  <p className="text-base text-dark/50 dark:text-white/50">
                    Easily check yourself in with a modern keypad system.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <Image
                    src="/images/SVGs/energyefficient.svg"
                    width={400}
                    height={500}
                    alt=""
                    className="w-8 h-8 dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src="/images/SVGs/energyefficient-white.svg"
                    width={400}
                    height={500}
                    alt=""
                    className="w-8 h-8 dark:block hidden"
                    unoptimized={true}
                  />
                </div>
                <div>
                  <h3 className="text-dark dark:text-white text-xm">
                    Energy efficient
                  </h3>
                  <p className="text-base text-dark/50 dark:text-white/50">
                    Built in 2025 with sustainable and smart-home features.
                  </p>
                </div>
              </div>
            </div>

            {/* Area Details Section */}
            <div className="py-8 my-8 border-y border-dark/10 dark:border-white/20">
              <h3 className="text-xl font-medium mb-6">Area Measurements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {property?.area && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:ruler-square"
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                      <p className="text-sm text-dark/50 dark:text-white/50">
                        Square Feet
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-dark dark:text-white">
                      {property.area.toLocaleString()} sq ft
                    </p>
                  </div>
                )}

                {property?.area_sqyards && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:square-outline"
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                      <p className="text-sm text-dark/50 dark:text-white/50">
                        Square Yards
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-dark dark:text-white">
                      {property.area_sqyards.toLocaleString()} sq yd
                    </p>
                  </div>
                )}

                {property?.area_marla && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:land-plots"
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                      <p className="text-sm text-dark/50 dark:text-white/50">
                        Marla
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-dark dark:text-white">
                      {property.area_marla.toLocaleString()} Marla
                    </p>
                  </div>
                )}

                {property?.area_kanal && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:land-fields"
                        width={20}
                        height={20}
                        className="text-primary"
                      />
                      <p className="text-sm text-dark/50 dark:text-white/50">
                        Kanal
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-dark dark:text-white">
                      {property.area_kanal.toLocaleString()} Kanal
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {property?.description ? (
                <div className="text-dark dark:text-white text-xm whitespace-pre-line">
                  {property?.description}
                </div>
              ) : (
                <p className="text-dark dark:text-white text-xm ">
                  Description not available.
                </p>
              )}
              {/* <p className="text-dark dark:text-white text-xm ">
                Step inside to discover an open-concept layout that seamlessly
                connects the kitchen, dining, and living spaces. the gourmet
                kitchen is equipped with top-of-the-line appliances, sleek
                cabinetry, and a large island perfect for casual dining or meal
                prep. the sunlit living room offers floor-to-ceiling windows,
                creating a bright and airy atmosphere while providing stunning
                views of the outdoor space.
              </p>
              <p className="text-dark dark:text-white text-xm ">
                The primary suite serves as a private retreat with a spa-like
                ensuite bathroom and a spacious walk-in closet. each additional
                bedroom is thoughtfully designed with comfort and style in mind,
                offering ample space and modern finishes. the home’s three
                bathrooms feature high-end fixtures, custom vanities, and
                elegant tiling.
              </p>
              <p className="text-dark dark:text-white text-xm ">
                Outdoor living is equally impressive, with a beautifully
                landscaped backyard, multiple lounge areas, and two fully
                equipped bar spaces.
              </p> */}
            </div>
            <div className="py-8 mt-8 border-t border-dark/5 dark:border-white/15">
              <h3 className="text-xl font-medium">What this property offers</h3>
              <div className="grid grid-cols-3 mt-5 gap-6">
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon="ph:aperture"
                    width={24}
                    height={24}
                    className="text-dark dark:text-white"
                  />
                  <p className="text-base dark:text-white text-dark">
                    Smart Home Integration
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon="ph:chart-pie-slice"
                    width={24}
                    height={24}
                    className="text-dark dark:text-white"
                  />
                  <p className="text-base dark:text-white text-dark">
                    Spacious Living Areas
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon="ph:television-simple"
                    width={24}
                    height={24}
                    className="text-dark dark:text-white"
                  />
                  <p className="text-base dark:text-white text-dark">
                    Energy Efficiency
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon="ph:sun"
                    width={24}
                    height={24}
                    className="text-dark dark:text-white"
                  />
                  <p className="text-base dark:text-white text-dark">
                    Natural Light
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon="ph:video-camera"
                    width={24}
                    height={24}
                    className="text-dark dark:text-white"
                  />
                  <p className="text-base dark:text-white text-dark">
                    Security Systems
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon
                    icon="ph:cloud"
                    width={24}
                    height={24}
                    className="text-dark dark:text-white"
                  />
                  <p className="text-base dark:text-white text-dark">
                    Outdoor Spaces
                  </p>
                </div>
              </div>
            </div>
            {property?.location ? (
              <GoogleMap
                address={property.location}
                height="400"
                className="w-full"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Location not available
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-4 col-span-12">
            <div className="bg-primary/10 p-8 rounded-2xl relative z-10 overflow-hidden md:mt-8">
              <h4 className="text-dark text-3xl font-medium dark:text-white">
                Rs. {property?.rate}
              </h4>
              <p className="text-sm text-dark/50 dark:text-white">
                Discounted Price
              </p>
              <Link
                href="#"
                className="py-4 px-8 bg-primary text-white rounded-full w-full block text-center hover:bg-dark duration-300 text-base mt-8 hover:cursor-pointer"
              >
                Get in touch
              </Link>
              <div className="absolute right-0 top-4 -z-[1]">
                <Image
                  src="/images/properties/vector.svg"
                  width={400}
                  height={500}
                  alt="vector"
                  unoptimized={true}
                />
              </div>
            </div>
            {testimonials.slice(0, 1).map((item, index) => (
              <div
                key={index}
                className="border p-10 rounded-2xl border-dark/10 dark:border-white/20 mt-10 flex flex-col gap-6"
              >
                <Icon
                  icon="ph:house-simple"
                  width={44}
                  height={44}
                  className="text-primary"
                />
                <p className="text-xm text-dark dark:text-white">
                  {item.review}
                </p>
                <div className="flex items-center gap-6">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={500}
                    className="w-20 h-20 rounded-2xl"
                    unoptimized={true}
                  />
                  <div className="">
                    <h3 className="text-xm text-dark dark:text-white">
                      {item.name}
                    </h3>
                    <h4 className="text-base text-dark/50 dark:text-white/50">
                      {item.position}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
