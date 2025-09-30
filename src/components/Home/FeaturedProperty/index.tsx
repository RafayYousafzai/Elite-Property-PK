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

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

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
          <h2 className="lg:text-52 text-40 font-medium text-dark dark:text-white">
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
                        src={image}
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
            <div className="absolute left-2/5 bg-dark/50 rounded-2xl py-2.5 bottom-10 flex justify-center mt-4 gap-2.5 px-2.5">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2.5 h-2.5 rounded-2xl ${
                    current === index + 1 ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
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
              <h2 className="lg:text-52 text-40 font-medium text-dark dark:text-white">
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
            <p className="text-base text-dark/50 dark:text-white/50">
              {currentProperty.description ||
                `Experience luxury living at ${currentProperty.name}, located at ${currentProperty.location}. This ${currentProperty.area} ft² ${currentProperty.property_type} offers modern amenities and spacious living areas.`}
            </p>
            <div className="grid grid-cols-2 gap-10">
              {currentProperty.beds && (
                <div className="flex items-center gap-4">
                  <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-[6px]">
                    <Image
                      src={"/images/hero/sofa.svg"}
                      alt="sofa"
                      width={24}
                      height={24}
                      className="block dark:hidden"
                      unoptimized={true}
                    />
                    <Image
                      src={"/images/hero/dark-sofa.svg"}
                      alt="sofa"
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
                      alt="tube"
                      width={24}
                      height={24}
                      className="block dark:hidden"
                      unoptimized={true}
                    />
                    <Image
                      src={"/images/hero/dark-tube.svg"}
                      alt="tube"
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
                    src={"/images/hero/parking.svg"}
                    alt="parking"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-parking.svg"}
                    alt="parking"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">Parking Space</h6>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-dark/5 dark:bg-white/5 p-2.5 rounded-[6px]">
                  <Image
                    src={"/images/hero/bar.svg"}
                    alt="bar"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-bar.svg"}
                    alt="bar"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">{currentProperty.area} ft² area</h6>
              </div>
            </div>
            <div className="flex gap-10">
              <Link
                href="/contactus"
                className="py-4 px-8  bg-primary hover:bg-dark duration-300 rounded-full text-white"
              >
                Get in touch
              </Link>
              <div>
                <h4 className="text-3xl text-dark dark:text-white font-medium">
                  Rs. {currentProperty.rate}
                </h4>
                <p className="text-base text-dark/50">Discounted price</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperty;
