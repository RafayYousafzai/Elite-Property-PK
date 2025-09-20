"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { PropertyHomes } from "@/types/properyHomes";
import Image from "next/image";
import { propertyHomes } from "@/app/api/propertyhomes";
import { useRouter } from "next/navigation";

export const ParallaxScroll = ({ className }: { className?: string }) => {
  const properties: PropertyHomes[] = propertyHomes;
  const router = useRouter();

  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(properties.length / 3);

  const firstPart = properties.slice(0, third);
  const secondPart = properties.slice(third, 2 * third);
  const thirdPart = properties.slice(2 * third);

  const handleClick = (slug: string) => {
    router.push(`/properties/${slug}`);
  };

  return (
    <div className={cn("w-full", className)} ref={gridRef}>
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
            Apartments
          </p>
        </div>
        <h2 className="text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2">
          Discover inspiring designed apartments.
        </h2>
        <p className="text-xm font-normal text-black/50 dark:text-white/50 text-center">
          Curated apartments where elegance, style, and comfort unite.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-full mx-auto gap-10 py-40 px-10">
        {/* First Part */}
        <div className="grid gap-10">
          {firstPart.map((property, idx) => (
            <motion.div
              onClick={() => handleClick(property.slug)}
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="group relative cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={property.images[0].src}
                  className="h-[30rem] w-full object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-105"
                  height="400"
                  width="400"
                  alt={property.name}
                />
                {/* Property Name (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-sm font-medium capitalize mb-1">
                        {property.location}
                      </p>{" "}
                      <p className="text-sm"> {property.area} sqft</p>
                    </div>

                    <h3 className="text-2xl font-bold capitalize drop-shadow-lg">
                      {property.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Second Part */}
        <div className="grid gap-10 md:-mt-16 mb-60 md:mb-0">
          {secondPart.map((property, idx) => (
            <motion.div
              onClick={() => handleClick(property.slug)}
              style={{ y: translateSecond }}
              key={"grid-2" + idx}
              className="group relative cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={property.images[0].src}
                  className="h-[30rem] w-full object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-105"
                  height="400"
                  width="400"
                  alt={property.name}
                />
                {/* Property Name (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-sm font-medium capitalize mb-1">
                        {property.location}
                      </p>{" "}
                      <p className="text-sm"> {property.area} sqft</p>
                    </div>

                    <h3 className="text-2xl font-bold capitalize drop-shadow-lg">
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
          {thirdPart.map((property, idx) => (
            <motion.div
              onClick={() => handleClick(property.slug)}
              style={{ y: translateThird }}
              key={"grid-3" + idx}
              className="group relative cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={property.images[0].src}
                  className="h-[30rem] w-full object-cover object-center rounded-lg transition-transform duration-500 group-hover:scale-105"
                  height="400"
                  width="400"
                  alt={property.name}
                />
                {/* Property Name (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white ">
                    <div className="flex flex-wrap opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-full">
                      <p className="text-sm font-medium capitalize mb-1">
                        {property.location}
                      </p>{" "}
                      <p className="text-sm"> {property.area} sqft</p>
                    </div>

                    <h3 className="text-2xl font-bold capitalize drop-shadow-lg">
                      {property.name}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
