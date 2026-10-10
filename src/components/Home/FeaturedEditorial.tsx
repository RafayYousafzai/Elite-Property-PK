import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import { Property } from "@/types/property";
import formatNumberShort from "@/lib/formatNumberShort";
import { formatLocation } from "@/lib/utils";
import { getBathsCount, getBedsCount } from "@/lib/supabase/properties";
import PropertyImage from "./PropertyImage";

const price = (p: Property) => formatNumberShort(Number(p.rate)).replace("Rs", "PKR");

function Specs({ p }: { p: Property }) {
  const beds = getBedsCount(p);
  const baths = getBathsCount(p);
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
      {beds > 0 && (
        <span className="flex items-center gap-1.5">
          <BedDouble size={14} strokeWidth={1.5} /> {beds} Beds
        </span>
      )}
      {baths > 0 && (
        <span className="flex items-center gap-1.5">
          <Bath size={14} strokeWidth={1.5} /> {baths} Baths
        </span>
      )}
      {p.area > 0 && (
        <span className="flex items-center gap-1.5 capitalize">
          <Maximize size={13} strokeWidth={1.5} /> {p.area} {p.area_unit || "Sq Ft"}
        </span>
      )}
    </span>
  );
}

const FeaturedEditorial = ({ properties }: { properties: Property[] }) => {
  const picks = properties.filter((p) => !p.is_sold).slice(0, 4);
  if (picks.length === 0) return null;
  const [lead, ...rest] = picks;

  return (
    <section className="!py-14 md:!py-20">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Featured Listings
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Hand-picked <em className="text-[#9a7a1e]">residences</em>
            </h2>
          </div>
          <Link
            href="/explore"
            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#9a7a1e]"
          >
            View all listings
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Lead listing */}
          <Link href={`/explore/${lead.slug}`} className="group min-w-0 lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
              <PropertyImage
                image={lead.images?.[0]}
                alt={lead.name}
                full
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-3 border border-white/60" />
              {lead.purpose && (
                <span className="absolute left-6 top-6 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a1e] backdrop-blur-sm">
                  For {lead.purpose}
                </span>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0">
                {lead.location && (
                  <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-stone-500">
                    <MapPin size={13} strokeWidth={1.5} className="text-[#9a7a1e]" />
                    {formatLocation(lead.location)}
                  </p>
                )}
                <h3 className="mt-3 line-clamp-2 break-words font-[family-name:var(--font-display)] text-3xl font-medium leading-tight transition-colors group-hover:text-[#9a7a1e] md:text-4xl">
                  {lead.name}
                </h3>
                <div className="mt-4">
                  <Specs p={lead} />
                </div>
              </div>
              <p className="shrink-0 font-[family-name:var(--font-display)] text-2xl font-semibold md:text-3xl">
                {price(lead)}
              </p>
            </div>
          </Link>

          {/* Supporting listings */}
          <div className="flex min-w-0 flex-col divide-y divide-stone-200 border-y border-stone-200 lg:col-span-5">
            {rest.map((p) => (
              <Link
                key={p.id ?? p.slug}
                href={`/explore/${p.slug}`}
                className="group flex gap-5 py-6 first:pt-6"
              >
                <div className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden rounded-sm bg-stone-200 sm:w-44">
                  <PropertyImage
                    image={p.images?.[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p className="truncate text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      {formatLocation(p.location)}
                    </p>
                    <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-xl font-medium leading-snug transition-colors group-hover:text-[#9a7a1e]">
                      {p.name}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="font-semibold">{price(p)}</p>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="shrink-0 text-stone-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9a7a1e]"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEditorial;
