import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const Categories = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-0 top-0">
        <Image
          src="/images/categories/Vector.svg"
          alt="vector"
          width={800}
          height={1050}
          className="dark:hidden w-auto h-auto max-w-full"
          unoptimized={true}
        />
        <Image
          src="/images/categories/Vector-dark.svg"
          alt="vector"
          width={800}
          height={1050}
          className="hidden dark:block w-auto h-auto max-w-full"
          unoptimized={true}
        />
      </div>
      <div className="container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 relative z-10">
        <div className="grid grid-cols-12 items-start lg:items-center gap-6 lg:gap-10">
          <div className="lg:col-span-6 col-span-12 mb-8 lg:mb-0">
            <p className="text-dark/75 dark:text-white/75 text-sm sm:text-base font-semibold flex items-center gap-2.5">
              <Icon
                icon="ph:house-simple-fill"
                className="text-xl sm:text-2xl text-primary flex-shrink-0"
              />
              Categories
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-52 mt-3 sm:mt-4 mb-2 font-medium leading-[1.2] text-dark dark:text-white">
              Explore best properties with expert services.
            </h2>
            <p className="text-dark/50 dark:text-white/50 text-base sm:text-lg leading-[1.4] sm:leading-[1.3] max-w-full">
              Discover a diverse range of premium properties, from luxurious
              apartments to spacious villas, tailored to your needs
            </p>
            <Link
              href="/explore"
              className="inline-block py-3 sm:py-4 px-6 sm:px-8 bg-primary text-sm sm:text-base leading-4 text-white rounded-full font-semibold mt-6 sm:mt-8 hover:bg-dark duration-300 transition-colors"
            >
              View properties
            </Link>
          </div>
          <div className="lg:col-span-6 col-span-12 mb-6 lg:mb-0">
            <div className="relative rounded-2xl overflow-hidden group">
              <Link href="/residential-homes">
                <Image
                  src="/images/categories/villas.jpg"
                  alt="villas"
                  width={680}
                  height={386}
                  className="w-full h-[350px] md:h-auto object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/explore?type=homes"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-0 flex flex-col justify-between pl-4 sm:pl-6 lg:pl-10 pb-4 sm:pb-6 lg:pb-10 pr-4 sm:pr-6 lg:pr-0 group-hover:bg-black/20 duration-500"
              >
                <div className="flex justify-end mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-dark rounded-full w-fit p-3 sm:p-4 mr-4">
                    <Icon
                      icon="ph:arrow-right"
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-2.5">
                  <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-medium">
                    Appartment
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-5 sm:leading-6">
                    Experience elegance and comfort with our exclusive luxury
                    villas, designed for sophisticated living.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 col-span-12 mb-6 lg:mb-0">
            <div className="relative rounded-2xl overflow-hidden group">
              <Link href="/explore?type=plots">
                <Image
                  src="/images/categories/plots.png"
                  alt="villas"
                  width={680}
                  height={386}
                  className="w-full h-[350px] md:h-auto object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/explore?type=plots"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-0 flex flex-col justify-between pl-4 sm:pl-6 lg:pl-10 pb-4 sm:pb-6 lg:pb-10 pr-4 sm:pr-6 lg:pr-0 group-hover:bg-black/20 duration-500"
              >
                <div className="flex justify-end mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-dark rounded-full w-fit p-3 sm:p-4 mr-4">
                    <Icon
                      icon="ph:arrow-right"
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-2.5">
                  <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-medium">
                    Plots
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-5 sm:leading-6">
                    Experience elegance and comfort with our exclusive luxury
                    villas, designed for sophisticated living.
                  </p>
                </div>
              </Link>
            </div>
          </div>{" "}
          <div className="lg:col-span-6 col-span-12 mb-6 lg:mb-0">
            <div className="relative rounded-2xl overflow-hidden group">
              <Link href="/explore">
                <Image
                  src="/images/categories/building.png"
                  alt="villas"
                  width={680}
                  height={386}
                  className="w-full h-[350px] md:h-auto object-cover"
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/explore"
                className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-0 flex flex-col justify-between pl-4 sm:pl-6 lg:pl-10 pb-4 sm:pb-6 lg:pb-10 pr-4 sm:pr-6 lg:pr-0 group-hover:bg-black/20 duration-500"
              >
                <div className="flex justify-end mt-4 sm:mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-dark rounded-full w-fit p-3 sm:p-4 mr-4">
                    <Icon
                      icon="ph:arrow-right"
                      width={20}
                      height={20}
                      className="sm:w-6 sm:h-6"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:gap-2.5">
                  <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-medium">
                    Explore All.{" "}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-5 sm:leading-6">
                    See all the available properties and find your dream home
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
