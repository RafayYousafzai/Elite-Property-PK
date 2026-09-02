"use client";

import formatNumberShort from "@/lib/formatNumberShort";
import { Property } from "@/types/property";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { formatLocation, getImageUrl } from "@/lib/utils";
import { getBedsCount, getBathsCount } from "@/lib/supabase/properties";

const PropertyCard: React.FC<{ item: Property; priority?: boolean }> = ({
  item,
  priority = false,
}) => {
  const {
    name,
    location,
    rate,
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

  const mainImage = getImageUrl(images && images.length > 0 ? images[0] : null);
  const formattedPrice = formatNumberShort(Number(rate)).replace("Rs", "PKR");
  const displayCategory = property_type
    ? property_type.replace(/-/g, " ")
    : property_category || "Property";

  const bedNum = getBedsCount(item);
  const bathNum = getBathsCount(item);

  return (
    <div className="w-full group">
      {/* Desktop Layout (md:flex flex-col) */}
      <div className="hidden md:flex flex-col relative rounded-2xl bg-transparent border-0 shadow-none transition-all duration-300">
        {/* Image Container */}
        <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
          {/* Badges Stacked on Left of Image */}
          <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start pointer-events-auto">
            {is_sold ? (
              <div className="px-3 py-1 bg-red-500 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-none border-0">
                Sold
              </div>
            ) : (
              purpose && (
                <div className="px-3 py-1 bg-primary text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-none border-0">
                  For {purpose}
                </div>
              )
            )}
            {video_url && (
              <a
                href={video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white rounded-xl text-[11px] font-bold shadow-none border-0 hover:bg-red-700 transition"
              >
                <Icon icon="ph:youtube-logo-fill" className="w-3.5 h-3.5" />
                <span>Video</span>
              </a>
            )}
          </div>

          <Link href={`/explore/${slug}`} className="block w-full h-full">
            {mainImage ? (
              <img
                src={mainImage}
                alt={name}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-64 sm:h-72 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No Image
              </div>
            )}
          </Link>
        </div>

        {/* Details Section directly below image */}
        <div className="pt-3.5 px-0 flex flex-col flex-1 justify-between gap-3">
          <div className="space-y-2">
            <Link href={`/explore/${slug}`}>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                {name}
              </h3>
            </Link>

            <div className="flex items-center justify-between gap-2 -mb-1">
              <p className="text-xs font-normal text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                <Icon icon="ph:map-pin" className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{formatLocation(location)}</span>
              </p>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize shrink-0">
                {displayCategory}
              </span>
            </div>

            <div className="pt-0.5">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formattedPrice}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-0.5">
              {bedNum > 0 && (
                <span className="flex items-center gap-1">
                  <Icon icon="solar:bed-linear" className="w-4 h-4 text-slate-400" />
                  {bedNum} Beds
                </span>
              )}
              {bathNum > 0 && (
                <span className="flex items-center gap-1">
                  <Icon icon="solar:bath-linear" className="w-4 h-4 text-slate-400" />
                  {bathNum} Baths
                </span>
              )}
              {area && (
                <span className="flex items-center gap-1">
                  <Icon icon="lineicons:arrow-all-direction" className="w-4 h-4 text-slate-400" />
                  {area} {area_unit || "Sq Ft"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:+923344111778"
              className="h-10 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all border-0 shadow-none"
            >
              <Icon icon="solar:phone-calling-linear" className="w-4 h-4 text-primary" />
              <span>Call Agent</span>
            </a>
            <a
              href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I am interested in property: ${name} (Price: ${formatNumberShort(Number(rate))}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold transition-all border-0 shadow-none"
            >
              <Icon icon="ph:whatsapp-logo-fill" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Layout (Image Left, Content Right, No BG) */}
      <div className="flex md:hidden flex-row gap-3 bg-transparent rounded-2xl p-0 overflow-hidden border-0 shadow-none items-stretch">
        {/* Left: Image (38% width) */}
        <div className="relative w-36 shrink-0 h-36 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
          <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1 items-start">
            {is_sold ? (
              <span className="px-1.5 py-0.5 bg-red-500 text-white rounded text-[9px] font-extrabold uppercase">
                Sold
              </span>
            ) : (
              purpose && (
                <span className="px-1.5 py-0.5 bg-primary text-white rounded text-[9px] font-extrabold uppercase">
                  {purpose}
                </span>
              )
            )}
          </div>

          <Link href={`/explore/${slug}`} className="block w-full h-full">
            {mainImage && (
              <img
                src={mainImage}
                alt={name}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </Link>
        </div>

        {/* Right: Details (62% width) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <Link href={`/explore/${slug}`}>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {name}
              </h4>
            </Link>

            <div className="flex items-center justify-between gap-1">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                <Icon icon="ph:map-pin" className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate">{formatLocation(location)}</span>
              </p>
              <span className="text-[10px] font-medium text-slate-400 capitalize shrink-0">
                {displayCategory}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-900 dark:text-white pt-0.5">
              {formattedPrice}
            </p>

            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-600 dark:text-slate-400">
              {bedNum > 0 && <span>{bedNum} Beds</span>}
              {bathNum > 0 && <span>• {bathNum} Baths</span>}
              {area && <span>• {area} {area_unit || "Sq Ft"}</span>}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-1.5 pt-1.5">
            {video_url && (
              <a
                href={video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-7 sm:h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition border-0 shadow-none cursor-pointer"
              >
                <Icon icon="ph:youtube-logo-fill" className="w-3.5 h-3.5" />
                <span>Watch Video Tour</span>
              </a>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              <a
                href="tel:+923344111778"
                className="h-8 flex items-center justify-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold border-0"
              >
                <Icon icon="solar:phone-calling-linear" className="w-3.5 h-3.5 text-primary" />
                <span>Call</span>
              </a>
              <a
                href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I am interested in property: ${name} (Price: ${formatNumberShort(Number(rate))}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 flex items-center justify-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border-0"
              >
                <Icon icon="ph:whatsapp-logo-fill" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
