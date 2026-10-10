"use client";

import {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
} from "react";
import SearchSidebar from "@/components/search-sidebar";
import { Property } from "@/types/property";
import type { SearchFilters } from "@/types/property";
import {
  ChevronDown,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import PropertyCard from "@/components/Home/Properties/Card/Card";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { useSearchParams, useRouter } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useProperties } from "@/hooks/useProperties";
import { filterProperties, parsePropertyRate } from "@/lib/supabase/properties";
import formatNumberShort from "@/lib/formatNumberShort";

const PAGE_SIZE = 12;
const MAX_PRICE = 1000000000;

const TYPE_LABELS: Record<SearchFilters["propertyType"], string> = {
  all: "All",
  homes: "Homes",
  apartments: "Apartments",
  plots: "Plots",
  commercial: "Commercial",
};

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const parseType = (value: string | null): SearchFilters["propertyType"] =>
  value === "homes" || value === "plots" || value === "commercial"
    ? value
    : value === "apartments" || value === "appartments"
      ? "apartments"
      : "all";

const parseCount = (value: string | null) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const defaultFilters = (): SearchFilters => ({
  propertyType: "all",
  subCategory: undefined,
  priceRange: [0, MAX_PRICE],
  minArea: 0,
  maxArea: 500,
  searchQuery: "",
});

const NO_PARAMS = new URLSearchParams();

/**
 * Reads the URL filters. useSearchParams forces client-only rendering up to the
 * nearest Suspense boundary, so the page wraps this in its own boundary whose
 * fallback is the same listing UI without URL filters — the server still
 * renders the full grid.
 */
export function SearchPageWithParams({ initialProperties }: { initialProperties: Property[] }) {
  return <SearchPageClient initialProperties={initialProperties} searchParams={useSearchParams()} />;
}

export default function SearchPageClient({
  initialProperties,
  searchParams = NO_PARAMS,
}: {
  initialProperties: Property[];
  searchParams?: ReadonlyURLSearchParams | URLSearchParams;
}) {
  const router = useRouter();
  const typeParam = searchParams.get("type");
  const searchParam = searchParams.get("search");

  const { properties, isLoading, error, refetch } =
    useProperties(initialProperties);

  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...defaultFilters(),
    propertyType: parseType(typeParam),
    subCategory: searchParams.get("subCategory") || undefined,
    beds: parseCount(searchParams.get("beds")),
    baths: parseCount(searchParams.get("baths")),
    searchQuery: searchParam || "",
  }));
  const [sort, setSort] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Follow external navigation (e.g. header links to /explore?type=plots)
  useEffect(() => {
    setFilters((prev) => {
      const next = { ...prev };
      if (typeParam) next.propertyType = parseType(typeParam);
      if (searchParam !== null) next.searchQuery = searchParam;
      return next;
    });
  }, [typeParam, searchParam]);

  // Filtering is in-memory, so it's instant; deferring keeps typing smooth.
  const deferredFilters = useDeferredValue(filters);
  const results = useMemo(() => {
    const filtered = filterProperties(properties, deferredFilters);
    if (sort === "newest") return filtered;
    const dir = sort === "price-asc" ? 1 : -1;
    return [...filtered].sort(
      (a, b) => (parsePropertyRate(a.rate) - parsePropertyRate(b.rate)) * dir
    );
  }, [properties, deferredFilters, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredFilters, sort]);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileFiltersOpen]);

  // Auto-load the next page as the visitor nears the end of the list
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < results.length;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, results.length));
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, results.length]);

  const updateUrlWithFilters = useCallback(
    (f: SearchFilters) => {
      const params = new URLSearchParams();
      if (f.propertyType !== "all") params.set("type", f.propertyType);
      if (f.searchQuery) params.set("search", f.searchQuery);
      if (f.subCategory) params.set("subCategory", f.subCategory);
      if (f.beds) params.set("beds", String(f.beds));
      if (f.baths) params.set("baths", String(f.baths));
      const qs = params.toString();
      router.replace(qs ? `/explore?${qs}` : "/explore", { scroll: false });
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (next: SearchFilters) => {
      setFilters(next);
      updateUrlWithFilters(next);
    },
    [updateUrlWithFilters]
  );

  const handleClearFilters = useCallback(() => {
    handleFiltersChange(defaultFilters());
  }, [handleFiltersChange]);

  const priceActive =
    filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_PRICE;

  const activeChips = [
    filters.propertyType !== "all" && {
      key: "type",
      label: TYPE_LABELS[filters.propertyType],
      clear: { propertyType: "all" as const, subCategory: undefined },
    },
    filters.subCategory && {
      key: "sub",
      label: filters.subCategory,
      clear: { subCategory: undefined },
    },
    filters.searchQuery && {
      key: "search",
      label: `“${filters.searchQuery}”`,
      clear: { searchQuery: "" },
    },
    priceActive && {
      key: "price",
      label: `${formatNumberShort(filters.priceRange[0])} – ${formatNumberShort(filters.priceRange[1])}`,
      clear: { priceRange: [0, MAX_PRICE] as [number, number] },
    },
    filters.beds && {
      key: "beds",
      label: `${filters.beds}+ beds`,
      clear: { beds: undefined },
    },
    filters.baths && {
      key: "baths",
      label: `${filters.baths}+ baths`,
      clear: { baths: undefined },
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    clear: Partial<SearchFilters>;
  }[];

  if (error && properties.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-5 pt-32">
        <div className="max-w-md space-y-4 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-[#9a7a1e]" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-[#1a1714]">
            We couldn&apos;t load the listings
          </h2>
          <p className="text-stone-600">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#1a1714] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9a7a1e]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#1a1714]">
      {/* Page header */}
      <div className="border-b border-stone-200 bg-[radial-gradient(50%_80%_at_10%_0%,rgba(212,175,55,0.14),transparent_70%)] px-4 pb-8 pt-36 md:px-8 md:pb-10 md:pt-44">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Explore DHA Islamabad
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium leading-tight tracking-tight md:text-6xl">
              Premium <em className="text-[#9a7a1e]">properties</em>
            </h1>
            <p className="mt-3 text-sm text-stone-500 md:text-base">
              <span className="font-semibold text-[#1a1714]">{properties.length}</span>{" "}
              verified listings — homes, plots and commercial spaces
            </p>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={filters.searchQuery}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              onBlur={() => updateUrlWithFilters(filters)}
              placeholder="Search by name, phase, sector or type"
              aria-label="Search properties"
              className="h-14 w-full rounded-full border border-stone-200 bg-white pl-12 pr-12 text-sm shadow-sm shadow-stone-900/[0.03] outline-none transition-colors placeholder:text-stone-400 focus:border-[#9a7a1e] [&::-webkit-search-cancel-button]:hidden"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => handleFiltersChange({ ...filters, searchQuery: "" })}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-[#1a1714]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] gap-8 px-4 md:px-8">
        {/* Desktop filters */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div
            data-lenis-prevent
            className="sticky top-32 max-h-[calc(100vh-8.5rem)] overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <SearchSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-24">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-stone-200 py-5">
            <p className="mr-auto text-sm text-stone-500">
              {isLoading ? (
                "Loading listings…"
              ) : (
                <>
                  <span className="font-semibold text-[#1a1714]">{results.length}</span>{" "}
                  {results.length === 1 ? "property" : "properties"}
                  {activeChips.length > 0 && " match your filters"}
                </>
              )}
            </p>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-4 text-xs font-semibold transition-colors hover:border-[#9a7a1e] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#9a7a1e]" />
              Filters
              {activeChips.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a1714] px-1.5 text-[10px] text-white">
                  {activeChips.length}
                </span>
              )}
            </button>

            <label className="relative">
              <span className="sr-only">Sort listings</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 cursor-pointer appearance-none rounded-full border border-stone-200 bg-white pl-4 pr-9 text-xs font-semibold outline-none transition-colors hover:border-[#9a7a1e] focus:border-[#9a7a1e]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </label>

            <div className="flex h-10 items-center rounded-full border border-stone-200 bg-white p-1">
              {(
                [
                  { mode: "list", icon: List, label: "Cards" },
                  { mode: "grid", icon: Grid, label: "Gallery" },
                ] as const
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                    viewMode === mode
                      ? "bg-[#1a1714] text-white"
                      : "text-stone-500 hover:text-[#1a1714]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-5">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleFiltersChange({ ...filters, ...chip.clear })}
                  className="group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#9a7a1e]/30 bg-white pl-3.5 pr-2.5 text-xs font-medium text-[#7a5c0f] transition-colors hover:border-[#9a7a1e]"
                >
                  {chip.label}
                  <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearFilters}
                className="cursor-pointer px-2 text-xs font-semibold text-stone-500 underline-offset-4 hover:text-[#1a1714] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          {results.length === 0 && !isLoading ? (
            <div className="mx-auto max-w-md py-24 text-center">
              <Search className="mx-auto h-8 w-8 text-[#9a7a1e]" strokeWidth={1.5} />
              <h2 className="mt-5 text-2xl font-semibold">No properties match</h2>
              <p className="mt-2 text-stone-500">
                Try removing a filter or searching a different phase.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-8 inline-flex h-11 cursor-pointer items-center rounded-full bg-[#1a1714] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#9a7a1e]"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "list" ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 pt-8 md:grid-cols-2 md:gap-y-10 2xl:grid-cols-3">
              {results.slice(0, visibleCount).map((property, index) => (
                <PropertyCard
                  key={property.id ?? property.slug}
                  item={property}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <div className="pt-8">
              <ParallaxScroll
                items={results.slice(0, visibleCount)}
                isLessColls={true}
              />
            </div>
          )}

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center pt-12">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + PAGE_SIZE, results.length))
                }
                className="inline-flex h-11 cursor-pointer items-center rounded-full border border-stone-300 bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
              >
                Show more ({results.length - visibleCount})
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[88vw] max-w-sm flex-col bg-[#faf8f3] shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex shrink-0 items-center justify-between border-b border-stone-200 px-5 py-4">
              <p className="text-sm text-stone-500">
                <span className="font-semibold text-[#1a1714]">{results.length}</span>{" "}
                properties found
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:text-[#1a1714]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-5">
              <SearchSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="shrink-0 space-y-2 border-t border-stone-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="h-12 w-full cursor-pointer rounded-full bg-[#1a1714] text-xs font-semibold uppercase tracking-[0.15em] text-white"
              >
                Show {results.length} properties
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="h-9 w-full cursor-pointer text-xs font-semibold text-stone-500 hover:text-[#1a1714]"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
