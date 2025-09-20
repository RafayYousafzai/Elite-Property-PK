import { PlotsHomes } from "@/types/plotsHomes";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const PlotCard: React.FC<{ item: PlotsHomes }> = ({ item }) => {
  const { name, location, rate, area, slug, images } = item;

  const mainImage = images[0]?.src;

  return (
    <div className="group">
      <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-dark overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative overflow-hidden">
          <Link href={`/properties/${slug}`}>
            {mainImage && (
              <Image
                src={mainImage}
                alt={name}
                width={440}
                height={300}
                className="w-full h-60 object-cover rounded-t-2xl transform group-hover:scale-110 group-hover:brightness-75 transition duration-500"
                unoptimized
              />
            )}
          </Link>
          <div className="absolute top-4 right-4 p-2 bg-white dark:bg-dark rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300">
            <Icon
              icon="solar:arrow-right-linear"
              width={22}
              height={22}
              className="text-black dark:text-white"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Title + Price */}
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/properties/${slug}`}>
                <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-primary transition">
                  {name}
                </h3>
              </Link>
              <p className="text-sm text-black/60 dark:text-white/60 mt-1">
                {location}
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium shadow-sm">
              ${rate}
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-2 text-sm text-black dark:text-white">
            <Icon icon="lineicons:arrow-all-direction" width={18} height={18} />
            <span>
              {area} m<sup>2</sup>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotCard;
