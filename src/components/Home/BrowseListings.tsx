import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Property, SearchFilters } from "@/types/property";
import { filterProperties } from "@/lib/supabase/properties";

const baseFilters: SearchFilters = {
  propertyType: "all",
  priceRange: [0, 1000000000],
  minArea: 0,
  maxArea: 500,
  searchQuery: "",
};

const TYPES = [
  { type: "homes", label: "Homes", image: "/images/categories/luxury-villa.jpg" },
  { type: "plots", label: "Plots", image: "/images/categories/plots.png" },
  { type: "apartments", label: "Apartments", image: "/images/categories/appartment.jpg" },
  { type: "commercial", label: "Commercial", image: "/images/categories/office.jpg" },
] as const;

const PHASES = [1, 2, 3, 4, 5, 6, 7];

// Live counts use the same matcher as /explore, so a tile's number always
// equals what the visitor sees after clicking it.
const BrowseListings = ({ properties }: { properties: Property[] }) => {
  const count = (f: Partial<SearchFilters>) =>
    filterProperties(properties, { ...baseFilters, ...f }).length;

  const phases = PHASES.map((n) => {
    const q = `Phase ${n}`;
    return {
      n,
      q,
      total: count({ searchQuery: q }),
      plots: count({ searchQuery: q, propertyType: "plots" }),
      homes: count({ searchQuery: q, propertyType: "homes" }),
    };
  }).filter((p) => p.total > 0);

  return (
    <section className="border-y border-stone-200 bg-white !py-24 md:!py-32">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Browse
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Find your place in <em className="text-[#9a7a1e]">DHA</em>
            </h2>
          </div>
          <p className="max-w-md text-stone-600 md:text-lg">
            {properties.length} verified listings across homes, plots,
            apartments and commercial spaces.
          </p>
        </div>

        {/* By type */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {TYPES.map((t) => {
            const n = count({ propertyType: t.type });
            return (
              <Link
                key={t.type}
                href={`/explore?type=${t.type}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-stone-200 md:aspect-[4/5]"
              >
                <Image
                  src={t.image}
                  alt={t.label}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/60" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-6">
                  <span>
                    <span className="block font-[family-name:var(--font-display)] text-2xl font-medium text-white md:text-3xl">
                      {t.label}
                    </span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-white/75">
                      {n > 0 ? `${n} ${n === 1 ? "listing" : "listings"}` : "Enquire"}
                    </span>
                  </span>
                  <ArrowUpRight size={20} strokeWidth={1.5} className="mb-1 shrink-0 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* By phase */}
        {phases.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
              Browse by DHA phase
            </h3>
            <div className="flex flex-wrap gap-px border-y border-stone-200 bg-stone-200">
              {phases.map((p) => (
                <Link
                  key={p.n}
                  href={`/explore?search=${encodeURIComponent(p.q)}`}
                  className="group min-w-[calc(50%-1px)] flex-1 bg-white px-4 py-7 transition-colors hover:bg-[#faf8f3] sm:min-w-[calc(33.333%-1px)] sm:px-6 lg:min-w-0"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-[family-name:var(--font-display)] text-3xl font-medium transition-colors group-hover:text-[#9a7a1e]">
                      Phase {p.n}
                    </span>
                    <ArrowUpRight size={16} strokeWidth={1.5} className="text-stone-300 transition-colors group-hover:text-[#9a7a1e]" />
                  </span>
                  <span className="mt-2 block text-sm font-semibold">
                    {p.total} {p.total === 1 ? "listing" : "listings"}
                  </span>
                  <span className="mt-1 block text-xs text-stone-500">
                    {[
                      p.homes && `${p.homes} ${p.homes === 1 ? "home" : "homes"}`,
                      p.plots && `${p.plots} ${p.plots === 1 ? "plot" : "plots"}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseListings;
