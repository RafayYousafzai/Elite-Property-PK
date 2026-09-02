"use client";

import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import SearchSidebar from "@/components/search-sidebar";
import { Property } from "@/types/property";

import {
  Grid,
  List,
  ListFilter,
  Search,
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import type { SearchFilters } from "@/types/property";
import { Chip, Button, ButtonGroup, Input } from "@heroui/react";
import PropertyCard from "@/components/Home/Properties/Card/Card";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { useSearchParams, useRouter } from "next/navigation";
import { useProperties } from "@/hooks/useProperties";
import toast from "react-hot-toast";
import { PropertyListSkeleton } from "@/components/ui/property-skeleton";

export default function SearchPageClient({
  initialProperties,
}: {
  initialProperties: Property[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const searchParam = searchParams.get("search");

  // Use the custom hook for Supabase integration with pre-fetched properties
  const {
    filteredProperties,
    isLoading: dataLoading,
    error: dataError,
    refetch,
    applyFilters,
  } = useProperties(initialProperties);

  // Initialize filters with URL parameter if present
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initialPropertyType =
      typeParam === "homes"
        ? "homes"
        : typeParam === "plots"
          ? "plots"
          : typeParam === "commercial"
            ? "commercial"
            : typeParam === "apartments"
              ? "apartments"
              : "all";
    return {
      propertyType: initialPropertyType,
      subCategory: undefined,
      priceRange: [0, 1000000000],
      minArea: 0,
      maxArea: 500,
      searchQuery: searchParam || "",
    };
  });

  // Use local state for input to avoid typing lag
  const [searchValue, setSearchValue] = useState(searchParam || "");
  const [searchOpen, setSearchOpen] = useState(Boolean(searchParam));

  // Update filters when URL parameters change
  useEffect(() => {
    const updates: Partial<SearchFilters> = {};

    if (typeParam) {
      const newPropertyType =
        typeParam === "homes"
          ? "homes"
          : typeParam === "plots"
            ? "plots"
            : typeParam === "commercial"
              ? "commercial"
              : typeParam === "appartments" || typeParam === "apartments"
                ? "apartments"
                : "all";
      updates.propertyType = newPropertyType;
    }

    if (searchParam !== null) {
      updates.searchQuery = searchParam;
      setSearchValue(searchParam);
      if (searchParam) setSearchOpen(true);
    }

    if (Object.keys(updates).length > 0) {
      setFilters((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  }, [typeParam, searchParam]);

  // Debounce search filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.searchQuery) {
        startTransition(() => {
          setFilters((prev) => ({ ...prev, searchQuery: searchValue }));
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters.searchQuery]);

  // Sync searchValue when filters.searchQuery changes externally (e.g. from sidebar clicks or clearing)
  useEffect(() => {
    if (filters.searchQuery !== searchValue) {
      setSearchValue(filters.searchQuery);
    }
  }, [filters.searchQuery]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters]);

  useEffect(() => {
    if (mobileFiltersOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileFiltersOpen]);

  // Apply filters whenever filters change.
  // On the very first run, `initialProperties` (server-fetched) is already
  // sitting in `filteredProperties` via useProperties(), so we avoid
  // re-fetching from the client (and blanking the already-rendered images
  // behind a skeleton) unless the URL actually requested a non-default filter.
  const isFirstRun = useRef(true);
  const isDefaultFilters = useCallback((f: SearchFilters) => {
    return (
      f.propertyType === "all" &&
      !f.subCategory &&
      !f.searchQuery &&
      !f.beds &&
      !f.baths
    );
  }, []);

  useEffect(() => {
    const firstRun = isFirstRun.current;
    isFirstRun.current = false;

    // Nothing to fetch: SSR data already matches "no filters applied".
    if (firstRun && isDefaultFilters(filters) && initialProperties.length > 0) {
      return;
    }

    const applyFiltersAsync = async () => {
      // Don't show the full-grid skeleton on first run — keep the already
      // -rendered SSR cards/images visible while the filtered set loads in.
      if (!firstRun) {
        setIsLoading(true);
      }
      try {
        await applyFilters(filters);
      } catch (error) {
        console.error("Error applying filters:", error);
        toast.error("Failed to apply filters");
      } finally {
        setIsLoading(false);
      }
    };

    applyFiltersAsync();
  }, [filters, applyFilters, isDefaultFilters, initialProperties.length]);

  const updateUrlWithFilters = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newFilters.propertyType && newFilters.propertyType !== "all") {
      params.set("type", newFilters.propertyType);
    }
    if (newFilters.searchQuery) {
      params.set("search", newFilters.searchQuery);
    }
    if (newFilters.subCategory) {
      params.set("subCategory", newFilters.subCategory);
    }
    if (newFilters.beds) {
      params.set("beds", String(newFilters.beds));
    }
    if (newFilters.baths) {
      params.set("baths", String(newFilters.baths));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/explore?${queryString}` : "/explore";
    router.replace(newUrl, { scroll: false });
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setSearchValue("");
    const defaultFilters: SearchFilters = {
      propertyType: "all",
      subCategory: undefined,
      priceRange: [0, 1000000000],
      minArea: 0,
      maxArea: 500,
      searchQuery: "",
    };
    startTransition(() => {
      setFilters(defaultFilters);
    });
    updateUrlWithFilters(defaultFilters);
  }, [updateUrlWithFilters]);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    startTransition(() => {
      setFilters(newFilters);
    });
    updateUrlWithFilters(newFilters);
  }, [updateUrlWithFilters]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
  }, []);

  // Handle data error
  if (dataError) {
    return (
      <div className="min-h-screen mt-20 md:mt-32 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Error Loading Properties
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            {dataError}
          </p>
          <Button
            color="primary"
            onClick={refetch}
            startContent={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-32 md:mt-32">
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div
          className={`hidden lg:block transition-all duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarOpen && (
            <SearchSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Professional Header */}
          <div className="backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 transition-all duration-200">
            <div className="max-w-full mx-auto px-3 md:px-0">
              {/* Header Content */}
              <div className="py-4 sm:py-6">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      Premium Properties
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-primary transition-all duration-200">
                        {isLoading || isPending || dataLoading ? (
                          <span className="inline-block w-8 h-4 bg-slate-200 dark:bg-transparent rounded animate-pulse"></span>
                        ) : (
                          filteredProperties.length
                        )}
                      </span>{" "}
                      properties available
                    </p>
                  </div>

                  {/* Header Actions: Expandable Search, Filters & View Mode Toggle */}
                  <div className="flex items-center gap-2 flex-wrap ml-auto">
                    {/* Collapsible / Expanding Search Bar */}
                    {searchOpen ? (
                      <div className="relative flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200 w-full sm:w-72 md:w-80">
                        <Input
                          startContent={<Search className="h-4 w-4 text-slate-400" />}
                          endContent={
                            <button
                              type="button"
                              onClick={() => {
                                setSearchValue("");
                                setSearchOpen(false);
                                startTransition(() => {
                                  setFilters((prev) => ({ ...prev, searchQuery: "" }));
                                });
                              }}
                              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer border-0"
                              aria-label="Close search"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          }
                          autoFocus
                          size="sm"
                          value={searchValue}
                          placeholder="Search location, name, type..."
                          onValueChange={(value) => handleSearchChange(value)}
                          className="h-10 w-full rounded-xl"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        className="h-10 px-2.5 sm:px-3 rounded-xl bg-transparent text-slate-700 dark:text-slate-200 hover:text-primary transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer border-0 shadow-none"
                        aria-label="Open search bar"
                      >
                        <Search className="h-4 w-4 text-primary" />
                        <span className="hidden sm:inline">Search</span>
                      </button>
                    )}

                    {/* Mobile Filter Button */}
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="lg:hidden h-10 px-2.5 rounded-xl bg-transparent text-slate-700 dark:text-slate-200 hover:text-primary transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer border-0 shadow-none"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      <span>Filters</span>
                    </button>

                    {/* View Mode Toggle */}
                    <div className="inline-flex items-center gap-1 bg-transparent border-0 shadow-none">
                      <button
                        type="button"
                        onClick={() => handleViewModeChange("list")}
                        className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border-0 shadow-none ${
                          viewMode === "list"
                            ? "text-primary font-bold bg-transparent"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white bg-transparent"
                        }`}
                      >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleViewModeChange("grid")}
                        className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border-0 shadow-none ${
                          viewMode === "grid"
                            ? "text-primary font-bold bg-transparent"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white bg-transparent"
                        }`}
                      >
                        <Grid className="h-4 w-4" />
                        <span className="hidden sm:inline">Grid</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(filters.propertyType !== "all" ||
                  filters.subCategory ||
                  filters.searchQuery ||
                  filters.beds ||
                  filters.baths) && (
                  <div className="md:hidden mt-4 pt-4 ">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Active filters:
                      </span>
                      {filters.propertyType !== "all" && (
                        <Chip variant="flat" color="primary">
                          {filters.propertyType === "homes"
                            ? "Homes"
                            : filters.propertyType === "plots"
                              ? "Plots"
                              : filters.propertyType === "commercial"
                                ? "Commercial"
                                : "Apartments"}
                        </Chip>
                      )}
                      {filters.subCategory && (
                        <Chip
                          variant="shadow"
                          color="secondary"
                          className="font-medium animate-in fade-in duration-200"
                        >
                          📋 {filters.subCategory}
                        </Chip>
                      )}
                      {filters.searchQuery && (
                        <Chip
                          variant="shadow"
                          color="primary"
                          className="font-medium animate-in fade-in duration-200"
                        >
                          🔍 {filters.searchQuery}
                        </Chip>
                      )}
                      {filters.beds && (
                        <Chip
                          variant="shadow"
                          color="primary"
                          className="font-medium animate-in fade-in duration-200"
                        >
                          🛏️ {filters.beds}+ beds
                        </Chip>
                      )}
                      {filters.baths && (
                        <Chip
                          variant="shadow"
                          color="primary"
                          className="font-medium animate-in fade-in duration-200"
                        >
                          🛁 {filters.baths}+ baths
                        </Chip>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 h-6 px-2 text-xs transition-colors duration-200"
                      >
                        Clear all
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="transition-all duration-300">
            {filteredProperties.length === 0 &&
            !isLoading &&
            !isPending &&
            !dataLoading ? (
              <div className="text-center py-12 animate-in fade-in duration-500">
                <div className="text-muted-foreground text-lg mb-2">
                  No properties found
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={handleClearFilters} variant="flat">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                {isLoading || isPending || dataLoading ? (
                  <PropertyListSkeleton count={8} />
                ) : (
                  <div className="animate-in fade-in duration-300">
                    {viewMode === "list" ? (
                      <div className="grid gap-x-6 gap-y-5 sm:gap-x-8 sm:gap-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 pb-20">
                        {filteredProperties
                          .slice(0, visibleCount)
                          .map((property, index) => (
                            <div
                              key={`${property.id}-${property.slug}-${index}`}
                              className="animate-in fade-in duration-200"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <PropertyCard
                                item={property}
                                priority={index < 3}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="pt-20">
                        <ParallaxScroll
                          items={filteredProperties.slice(0, visibleCount)}
                          isLessColls={true}
                        />
                      </div>
                    )}

                    {/* Load More Button */}
                    {visibleCount < filteredProperties.length && (
                      <div className="flex justify-center mt-8 pb-10">
                        <Button
                          className="bg-primary text-white"
                          variant="flat"
                          size="lg"
                          onClick={() =>
                            setVisibleCount((prev) =>
                              Math.min(prev + 12, filteredProperties.length),
                            )
                          }
                        >
                          Load More ({filteredProperties.length - visibleCount}{" "}
                          remaining)
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Custom Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileFiltersOpen(false)}
            />

            {/* Filter Panel */}
            <div className="relative w-[88vw] max-w-xs h-full bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Filter Properties
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {filteredProperties.length} properties found
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border-0"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Single Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <SearchSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Sticky Drawer Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0 space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all border-0 shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply Filters ({filteredProperties.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold bg-transparent transition-all border-0 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
