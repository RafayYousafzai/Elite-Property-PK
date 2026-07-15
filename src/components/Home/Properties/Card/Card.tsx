import formatNumberShort from "@/lib/formatNumberShort";
import { Property } from "@/types/property";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { formatLocation } from "@/lib/utils";

const timeAgo = (dateStr?: string) => {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PropertyCard: React.FC<{ item: Property; priority?: boolean }> = ({ item, priority }) => {
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
    is_featured,
    created_at,
  } = item;

  // Get the main image URL
  const mainImage =
    images && images.length > 0
      ? typeof images[0] === "string"
        ? images[0]
        : images[0].src
      : "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const formattedPrice = formatNumberShort(Number(rate)).replace("Rs", "PKR");

  return (
    <div className="w-full">
      {/* Desktop Card Layout (md and up) */}
      <div className="hidden md:block relative rounded-2xl border border-dark/10 dark:border-white/10 group hover:shadow-3xl duration-300 dark:hover:shadow-white/20 bg-white dark:bg-slate-900/50">
        {/* Status Badge */}
        {is_sold ? (
          <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold">
            Sold
          </div>
        ) : (
          purpose && (
            <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
              For {purpose}
            </div>
          )
        )}

        <div className="overflow-hidden rounded-t-2xl relative">
          <Link href={`/explore/${slug}`}>
            {mainImage && (
              <Image
                src={mainImage}
                alt={name}
                width={440}
                height={300}
                priority={priority}
                className="w-full h-72 object-cover rounded-t-2xl group-hover:brightness-50 group-hover:scale-125 transition duration-300 delay-75"
              />
            )}
          </Link>
          <div className="absolute top-6 right-6 p-4 bg-white rounded-full hidden group-hover:block pointer-events-none">
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
              <p className="text-sm font-normal text-black/50 dark:text-white/50 flex items-center gap-1 mt-1">
                <Icon icon={"ph:map-pin"} width={16} height={16} />
                {formatLocation(location)}
              </p>
              {property_type && (
                <p className="text-xs text-black/60 dark:text-white/60 mt-1 capitalize">
                  {property_type} • {property_category || "Property"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button className="text-base font-semibold text-primary px-4 py-2 rounded-full bg-primary/10 whitespace-nowrap">
                {formattedPrice}
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

          {/* Desktop CTA Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-black/5 dark:border-white/5 mt-4">
            <a
              href="tel:+923344111778"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold transition duration-200 shadow-sm"
            >
              <Icon icon="solar:phone-calling-linear" className="w-4.5 h-4.5" />
              <span>Call Agent</span>
            </a>
            <a
              href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I am interested in property: ${name} (Price: ${formatNumberShort(Number(rate))}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold transition duration-200 shadow-sm bg-white dark:bg-slate-900"
            >
              <Icon icon="ph:whatsapp-logo-fill" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal List View (less than md) - Brand Styled, Extremely Compact */}
      <div className="block md:hidden bg-white dark:bg-slate-900 border border-dark/10 dark:border-white/10 rounded-xl overflow-hidden shadow-sm transition duration-200">
        <div className="flex h-36 relative">
          {/* Left Column: Image Section (38% width) */}
          <div className="relative w-[38%] shrink-0 h-full bg-black/5 dark:bg-white/5">
            <Link href={`/explore/${slug}`} className="block w-full h-full">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={name}
                  width={180}
                  height={144}
                  priority={priority}
                  className="w-full h-full object-cover"
                />
              )}
            </Link>

            {/* Badges on Image */}
            <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
              {is_sold ? (
                <span className="bg-red-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                  SOLD
                </span>
              ) : is_featured ? (
                <span className="bg-red-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Icon icon="solar:fire-bold" className="w-2.5 h-2.5" />
                  HOT
                </span>
              ) : (
                purpose && (
                  <span className="bg-primary text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                    {purpose}
                  </span>
                )
              )}
            </div>

            {/* Image Count Indicator */}
            {images && images.length > 0 && (
              <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-[2px] text-white text-[9px] px-1 py-0.5 rounded font-medium flex items-center gap-1">
                <Icon icon="solar:camera-linear" className="w-3 h-3" />
                <span>{images.length}</span>
              </div>
            )}
          </div>

          {/* Right Column: Details Section (62% width) */}
          <div className="flex-1 p-2.5 flex flex-col justify-between overflow-hidden">
            {/* Top Badge & Category */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-black/50 dark:text-white/50 capitalize truncate max-w-[70%]">
                {property_type.replace(/-/g, " ")}
              </span>
              {is_featured && (
                <span className="bg-primary/10 text-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-primary/20 tracking-wider uppercase flex items-center gap-0.5">
                  <Icon icon="solar:crown-linear" className="w-2.5 h-2.5" />
                  TITANIUM
                </span>
              )}
            </div>

            {/* Price & Name */}
            <div className="space-y-0.5">
              <Link href={`/explore/${slug}`} className="block">
                <h4 className="text-sm font-bold text-primary leading-tight">
                  {formattedPrice}
                </h4>
                <p className="text-[11px] font-medium text-black dark:text-white line-clamp-1 hover:text-primary leading-tight mt-0.5">
                  {name}
                </p>
              </Link>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-[10px] text-black/50 dark:text-white/50">
              <Icon icon="ph:map-pin" className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{formatLocation(location)}</span>
            </div>

            {/* Specs & Time Row */}
            <div className="flex items-center justify-between text-[10px] text-black/70 dark:text-white/70 py-0.5 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                {beds && (
                  <span className="flex items-center gap-0.5">
                    <Icon icon="solar:bed-linear" className="w-3 h-3 text-primary" />
                    {beds}
                  </span>
                )}
                {baths && (
                  <span className="flex items-center gap-0.5">
                    <Icon icon="solar:bath-linear" className="w-3 h-3 text-primary" />
                    {baths}
                  </span>
                )}
                <span className="flex items-center gap-0.5">
                  <Icon icon="lineicons:arrow-all-direction" className="w-3 h-3 text-primary" />
                  {area} {area_unit || "Sq Ft"}
                </span>
              </div>
              <span className="text-[8px] font-normal text-black/40 dark:text-white/40 shrink-0">
                {timeAgo(created_at)}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-1.5 mt-1 border-t border-black/5 dark:border-white/5 pt-1.5">
              <a
                href="tel:+923344111778"
                className="flex-1 flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-[10px] font-bold transition"
              >
                <Icon icon="solar:phone-calling-linear" className="w-3.5 h-3.5" />
                <span>CALL</span>
              </a>
              <a
                href={`https://wa.me/+923344111778?text=${encodeURIComponent(`Hi, I am interested in property: ${name} (Price: ${formatNumberShort(Number(rate))}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg border border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 text-[10px] font-bold transition bg-white dark:bg-slate-900"
              >
                <Icon icon="ph:whatsapp-logo-fill" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
