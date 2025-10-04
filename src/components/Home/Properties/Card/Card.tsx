import formatNumberShort from "@/lib/formatNumberShort";
import { Property } from "@/types/property";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const PropertyCard: React.FC<{ item: Property }> = ({ item }) => {
  const {
    name,
    location,
    rate,
    beds,
    baths,
    area,
    slug,
    images,
    video_url,
    property_type,
    property_category,
    area_unit,
    purpose,
    is_sold,
  } = item;

  // Get the main image URL
  const mainImage =
    images && images.length > 0
      ? typeof images[0] === "string"
        ? images[0]
        : images[0].src
      : "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div>
      <div className="relative rounded-2xl border border-dark/10 dark:border-white/10 group hover:shadow-3xl duration-300 dark:hover:shadow-white/20">
        {/* Status Badge */}
        {is_sold && (
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold">
            Sold
          </div>
        )}

        {/* Purpose Badge */}
        {purpose && (
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
            For {purpose}
          </div>
        )}

        <div className="overflow-hidden rounded-t-2xl">
          <Link href={`/properties/${slug}`}>
            {mainImage && (
              <Image
                src={mainImage}
                alt={name}
                width={440}
                height={300}
                className="w-full h-72 object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75"
                unoptimized={true}
              />
            )}
          </Link>
          <div className="absolute top-6 right-6 p-4 bg-white rounded-full hidden group-hover:block">
            <Icon
              icon={"solar:arrow-right-linear"}
              width={24}
              height={24}
              className="text-black"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col mobile:flex-row gap-3 mobile:gap-0 justify-between mb-4">
            <div className="flex-1">
              <Link href={`/explore/${slug}`}>
                <h3 className="text-xl font-medium text-black dark:text-white duration-300 group-hover:text-primary line-clamp-1">
                  {name}
                </h3>
              </Link>
              <p className="text-sm font-normal text-black/50 dark:text-white/50 flex items-center gap-1">
                <Icon icon={"ph:map-pin"} width={16} height={16} />
                {location}
              </p>
              {property_type && (
                <p className="text-xs text-black/60 dark:text-white/60 mt-1 capitalize">
                  {property_type} • {property_category || "Property"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button className="text-base font-semibold text-primary px-4 py-2 rounded-full bg-primary/10 whitespace-nowrap">
                {formatNumberShort(Number(rate))}
              </button>
              {video_url && (
                <a
                  href={video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-300 text-sm"
                >
                  <Icon icon={"ph:youtube-logo-fill"} width={16} height={16} />
                  <span className="text-xs font-medium">Video</span>
                </a>
              )}
            </div>
          </div>

          {/* Property Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {beds && (
              <div className="flex items-center gap-2 border border-black/10 dark:border-white/20 px-3 py-2 rounded-lg">
                <Icon
                  icon={"solar:bed-linear"}
                  width={18}
                  height={18}
                  className="text-primary"
                />
                <p className="text-xs text-black dark:text-white">{beds}</p>
              </div>
            )}
            {baths && (
              <div className="flex items-center gap-2 border border-black/10 dark:border-white/20 px-3 py-2 rounded-lg">
                <Icon
                  icon={"solar:bath-linear"}
                  width={18}
                  height={18}
                  className="text-primary"
                />
                <p className="text-xs text-black dark:text-white">{baths}</p>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-2 border border-black/10 dark:border-white/20 px-3 py-2 rounded-lg">
                <Icon
                  icon={"lineicons:arrow-all-direction"}
                  width={18}
                  height={18}
                  className="text-primary"
                />
                <p className="text-xs text-black dark:text-white">
                  {area} {area_unit || "Sq Ft"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
