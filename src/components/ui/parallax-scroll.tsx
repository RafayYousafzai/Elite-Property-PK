"use client";

import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { properties } from "@/app/api/property";
import { Property } from "@/types/property";

export const ParallaxScroll = ({
  className,
  items = properties,
  isLessColls = false,
}: {
  className?: string;
  items: Property[];
  isLessColls?: boolean;
}) => {
  const properties: Property[] = items;
  const router = useRouter();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const parts = isLessColls ? 3 : 4;
  const chunkSize = Math.ceil(properties.length / parts);

  const firstPart = properties.slice(0, chunkSize);
  const secondPart = properties.slice(chunkSize, 2 * chunkSize);
  const thirdPart = properties.slice(2 * chunkSize, 3 * chunkSize);
  const fourthPart = !isLessColls ? properties.slice(3 * chunkSize) : [];

  const handleClick = (slug: string) => {
    router.push(`/explore/${slug}`);
  };

  return (
    <div
      className={cn(
        "container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0",
        className
      )}
      ref={gridRef}
    >
      {!isLessColls && (
        <div className="mb-16 flex flex-col gap-3 ">
          <div className="flex gap-2.5 items-center justify-center">
            <span>
              <Icon
                icon={"ph:house-simple-fill"}
                width={20}
                height={20}
                className="text-primary"
              />
            </span>
            <p className="text-base font-semibold text-dark/75 dark:text-white/75">
              Featured Properties
            </p>
          </div>
          <h2 className="text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2">
            Inspiring designed homes & apartments.
          </h2>
          <p className="text-xm font-normal text-black/50 dark:text-white/50 text-center">
            Curated homes & apartments where elegance, style, and comfort unite.
          </p>
        </div>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          isLessColls ? "lg:grid-cols-3" : "lg:grid-cols-4"
        } items-start max-w-full mx-auto gap-10 pt-10 md:pb-40`}
      >
        {/* First Part */}
        <div className="grid gap-10">
          {thirdPart.map((property, idx) => (
            <motion.div
              onClick={() => handleClick(property.slug)}
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="group relative cursor-pointer "
            >
              <div className="relative overflow-hidden">
                <Image
                  src={property.images[0]}
                  className="h-[350px] md:h-[30rem] w-full object-cover object-center rounded-sm transition-transform duration-500 group-hover:scale-105"
                  height="400"
                  width="400"
                  alt={property.name}
                  unoptimized={true}
                />
                {/* Property Name (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent rounded-sm">
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="font-light tracking-tight leading-11flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-sm  mb-1">{property.location}</p>{" "}
                      <p className="text-sm "> {property.area} sqft</p>
                    </div>

                    <h3 className="text-xl capitalize drop-shadow-lg font-medium  tracking-tight leading-11">
                      {property.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Second Part */}
        <div className="grid gap-10 md:-mt-16 ">
          {secondPart.map((property, idx) => (
            <motion.div
              onClick={() => handleClick(property.slug)}
              style={{ y: isSmallScreen ? translateFirst : translateSecond }}
              key={"grid-2" + idx}
              className="group relative cursor-pointer "
            >
              <div className="relative overflow-hidden">
                <Image
                  src={property.images[0]}
                  className="h-[350px] md:h-[30rem] w-full object-cover object-center rounded-sm transition-transform duration-500 group-hover:scale-105"
                  height="400"
                  width="400"
                  alt={property.name}
                  unoptimized={true}
                />
                {/* Property Name (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent rounded-sm">
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="font-light tracking-tight leading-11flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-sm  mb-1">{property.location}</p>{" "}
                      <p className="text-sm "> {property.area} sqft</p>
                    </div>

                    <h3 className="text-xl capitalize drop-shadow-lg font-medium  tracking-tight leading-11">
                      {property.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Third Part */}
        <div className="grid gap-10">
          {firstPart.map((property, idx) => (
            <motion.div
              onClick={() => handleClick(property.slug)}
              style={{ y: translateThird }}
              key={"grid-3" + idx}
              className="group relative cursor-pointer "
            >
              <div className="relative overflow-hidden">
                <Image
                  src={property.images[0]}
                  className="h-[350px] md:h-[30rem] w-full object-cover object-center rounded-sm transition-transform duration-500 group-hover:scale-105"
                  height="400"
                  width="400"
                  alt={property.name}
                  unoptimized={true}
                />
                {/* Property Name (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent rounded-sm">
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="font-light tracking-tight leading-11flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-sm  mb-1">{property.location}</p>{" "}
                      <p className="text-sm "> {property.area} sqft</p>
                    </div>

                    <h3 className="text-xl capitalize drop-shadow-lg font-medium  tracking-tight leading-11">
                      {property.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Fourth Part */}
        {!isLessColls && (
          <div className="grid gap-10 md:-mt-16 ">
            {fourthPart.map((property, idx) => (
              <motion.div
                onClick={() => handleClick(property.slug)}
                style={{ y: isSmallScreen ? translateFirst : translateSecond }}
                key={"grid-2" + idx}
                className="group relative cursor-pointer "
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={property.images[0]}
                    className="h-[350px] md:h-[30rem] w-full object-cover object-center rounded-sm transition-transform duration-500 group-hover:scale-105"
                    height="400"
                    width="400"
                    alt={property.name}
                    unoptimized={true}
                  />
                  {/* Property Name (Always Visible) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent rounded-sm">
                    <div className="absolute bottom-4 left-4 text-white ">
                      <div className="font-light tracking-tight leading-11flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                        <p className="text-sm  mb-1">{property.location}</p>{" "}
                        <p className="text-sm "> {property.area} sqft</p>
                      </div>

                      <h3 className="text-xl capitalize drop-shadow-lg font-medium  tracking-tight leading-11">
                        {property.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
