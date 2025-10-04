"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { Icon } from "@iconify/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface FeaturedPropertyProps {
  properties: Property[];
}

const FeaturedProperty: React.FC<FeaturedPropertyProps> = ({ properties }) => {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [currentPropertyIndex, setCurrentPropertyIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // If no properties, show fallback message
  if (!properties || properties.length === 0) {
    return (
      <section>
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
          <div className="text-center">
            <h2 className="lg:text-52 text-40 font-medium text-dark dark:text-white mb-4">
              No Featured Properties Available
            </h2>
            <p className="text-dark/50 dark:text-white/50">
              Check back soon for our latest featured properties!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Get the current property to display
  const currentProperty = properties[currentPropertyIndex] || properties[0];

  return (
    <section>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        <div className="md:hidden block mb-10">
          <p className=" text-dark/75 dark:text-white/75 text-base font-semibold gap-2">
            <Icon
              icon="ph:house-simple-fill"
              className="text-2xl text-primary "
            />
            Featured property
          </p>
          {/* Navigation for multiple properties */}
          {properties.length > 1 && (
            <div className="flex mt-3">
              <div className="flex gap-2">
                {properties.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPropertyIndex(index)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                      currentPropertyIndex === index
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Property {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          <h2 className="lg:text-52 text-40 font-medium text-dark dark:text-white line-clamp-2">
            {currentProperty.name}
          </h2>

          <div className="flex items-center gap-2.5">
            <Icon
              icon="ph:map-pin"
              width={28}
              height={26}
              className="text-dark/50 dark:text-white/50"
            />
            <p className="text-dark/50 dark:text-white/50 text-base">
              {currentProperty.location}
            </p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="relative">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {currentProperty.images && currentProperty.images.length > 0 ? (
                  currentProperty.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={typeof image === "string" ? image : image.src}
                        alt={currentProperty.name}
                        width={680}
                        height={530}
                        className="rounded-2xl w-none h-[350px] object-cover md:h-540"
                        unoptimized={true}
                      />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="rounded-2xl w-full h-[350px] md:h-540 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Icon
                        icon="ph:house-simple-fill"
                        className="text-6xl text-gray-400"
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
            {count > 0 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-dark/70 rounded-full py-2 px-4 bottom-6">
                <p className="text-white text-sm font-medium">
                  {current} / {count}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-10">
            <div className="md:block hidden ">
              <p className=" text-dark/75 dark:text-white/75 text-base font-semibold gap-2">
                <Icon
                  icon="ph:house-simple-fill"
                  className="text-2xl text-primary "
                />
                Featured property
              </p>
              {/* Navigation for multiple properties */}
              {properties.length > 1 && (
                <div className="flex mt-3">
                  <div className="flex gap-2">
                    {properties.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPropertyIndex(index)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                          currentPropertyIndex === index
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        Property {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <h2 className="lg:text-52 text-40 font-medium text-dark dark:text-white line-clamp-2">
                {currentProperty.name}
              </h2>
              <div className="flex items-center gap-2.5">
                <Icon
                  icon="ph:map-pin"
                  width={28}
                  height={26}
                  className="text-dark/50 dark:text-white/50"
                />
                <p className="text-dark/50 dark:text-white/50 text-base">
                  {currentProperty.location}
                </p>
              </div>
            </div>
            <p className="text-base text-dark/50 dark:text-white/50 line-clamp-3">
              {currentProperty.description ||
                "This property features modern amenities and spacious living areas in a prime location."}
            </p>
            <div className="grid grid-cols-2 gap-10">
              {currentProperty.beds && (
                <div className="flex items-center gap-4">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-[6px]">
                    <Image
                      src={"/images/hero/sofa.svg"}
                      alt="bedrooms"
                      width={24}
                      height={24}
                      className="block dark:hidden"
                      unoptimized={true}
                    />
                    <Image
                      src={"/images/hero/dark-sofa.svg"}
                      alt="bedrooms"
                      width={24}
                      height={24}
                      className="hidden dark:block"
                      unoptimized={true}
                    />
                  </div>
                  <h6 className="">{currentProperty.beds} Bedrooms</h6>
                </div>
              )}
              {currentProperty.baths && (
                <div className="flex items-center gap-4">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-[6px]">
                    <Image
                      src={"/images/hero/tube.svg"}
                      alt="bathrooms"
                      width={24}
                      height={24}
                      className="block dark:hidden"
                      unoptimized={true}
                    />
                    <Image
                      src={"/images/hero/dark-tube.svg"}
                      alt="bathrooms"
                      width={24}
                      height={24}
                      className="hidden dark:block"
                      unoptimized={true}
                    />
                  </div>
                  <h6 className="">{currentProperty.baths} Bathrooms</h6>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-[6px]">
                  <Image
                    src={"/images/hero/bar.svg"}
                    alt="area"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-bar.svg"}
                    alt="area"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">
                  {currentProperty.area} {currentProperty.area_unit || "Sq Ft"}
                </h6>
              </div>
              {currentProperty.property_category && (
                <div className="flex items-center gap-4">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-[6px]">
                    <Icon
                      icon={
                        currentProperty.property_category === "Home"
                          ? "ph:house-simple-fill"
                          : currentProperty.property_category === "Plots"
                          ? "ph:app-window-fill"
                          : "ph:buildings-fill"
                      }
                      width={24}
                      height={24}
                      className="text-dark dark:text-white"
                    />
                  </div>
                  <h6 className="">{currentProperty.property_type}</h6>
                </div>
              )}
            </div>
            <div className="flex gap-10 items-center">
              <Link
                href={`/explore/${currentProperty.slug}`}
                className="py-4 px-8 bg-primary hover:bg-dark duration-300 rounded-full text-white font-semibold"
              >
                View Details
              </Link>
              <div>
                <h4 className="text-3xl text-dark dark:text-white font-medium">
                  Rs. {Number(currentProperty.rate).toLocaleString()}
                </h4>
                <p className="text-base text-dark/50 dark:text-white/50">
                  {currentProperty.purpose === "Rent"
                    ? "Per Month"
                    : "Total Price"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperty;
