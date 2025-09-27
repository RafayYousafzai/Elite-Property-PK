"use client";

import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import SearchSidebar from "@/components/search-sidebar";

import {
  Grid,
  List,
  ListFilter,
  Search,
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { SearchFilters } from "@/types/property";
import { Chip, Button, ButtonGroup, Input } from "@heroui/react";
import PropertyCard from "@/components/Home/Properties/Card/Card";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { useSearchParams } from "next/navigation";
import { useProperties } from "@/hooks/useProperties";
import toast from "react-hot-toast";
import { PropertyListSkeleton } from "@/components/ui/property-skeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  // Use the custom hook for Supabase integration
  const {
    filteredProperties,
    isLoading: dataLoading,
    error: dataError,
    refetch,
    applyFilters,
  } = useProperties();

  // Initialize filters with URL parameter if present
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initialPropertyType =
      typeParam === "homes" ? "homes" : typeParam === "plots" ? "plots" : "all";
    return {
      propertyType: initialPropertyType,
      priceRange: [0, 1000000],
      minArea: 0,
      maxArea: 500,
      searchQuery: "",
    };
  });

  // Update filters when URL parameters change
  useEffect(() => {
    if (typeParam) {
      const newPropertyType =
        typeParam === "homes"
          ? "homes"
          : typeParam === "apartments"
          ? "apartments"
          : typeParam === "plots"
          ? "plots"
          : "all";
      setFilters((prev) => ({
        ...prev,
        propertyType: newPropertyType,
      }));
    }
  }, [typeParam]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (mobileFiltersOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileFiltersOpen]);

  // Apply filters whenever filters change
  useEffect(() => {
    const applyFiltersAsync = async () => {
      setIsLoading(true);
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
  }, [filters, applyFilters]);

  // Transform database properties to match the expected structure
  const transformedProperties = useMemo(() => {
    return filteredProperties.map((property) => ({
      property: {
        ...property,
        propertyType: property.property_type, // Transform for compatibility
        photoSphere: property.photo_sphere, // Transform for compatibility
      },
      type:
        property.property_type === "plot"
          ? ("plot" as const)
          : property.property_type === "apartment"
          ? ("apartment" as const)
          : ("home" as const),
    }));
  }, [filteredProperties]);

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setFilters({
        propertyType: "all",
        priceRange: [0, 1000000],
        minArea: 0,
        maxArea: 500,
        searchQuery: "",
      });
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    startTransition(() => {
      setFilters(newFilters);
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, searchQuery: value }));
    });
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
    <div className="min-h-screen mt-20 md:mt-32">
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
          <div className="  backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 transition-all duration-200">
            <div className="max-w-full mx-auto px-3 md:px-0 ">
              {/* Header Content */}
              <div className="py-6">
                {/* Top Section - Title and Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Premium Properties
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-primary transition-all duration-200">
                        {isLoading || isPending || dataLoading ? (
                          <span className="inline-block w-8 h-4 bg-slate-200 dark:bg-transparent rounded animate-pulse"></span>
                        ) : (
                          transformedProperties.length
                        )}
                      </span>{" "}
                      properties available
                    </p>
                  </div>

                  {/* View Mode Toggle - Desktop */}
                  <div className="hidden sm:flex items-center gap-1 rounded-lg p-1">
                    <Button
                      size="sm"
                      color={viewMode === "grid" ? "primary" : "default"}
                      onPress={() => handleViewModeChange("grid")}
                      className={`h-9 px-4 transition-all duration-200  `}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      className={`h-9 px-4 transition-all duration-200  `}
                      color={viewMode === "list" ? "primary" : "default"}
                      size="sm"
                      onPress={() => handleViewModeChange("list")}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                  </div>
                </div>

                {/* Search and Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Input
                      startContent={
                        <Search className="h-5 w-5 text-slate-400" />
                      }
                      fullWidth
                      size="lg"
                      placeholder="Search by location, name, or property type..."
                      onValueChange={(value) => handleSearchChange(value)}
                      className="h-12   "
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 md:hidden">
                    {/* Mobile Filter Button */}
                    <Button
                      variant="flat"
                      size="sm"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="bg-transparent text-md lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>

                    {/* Desktop Sidebar Toggle */}
                    <Button
                      variant="flat"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="bg-transparent text-md hidden lg:flex"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      {sidebarOpen ? "Hide" : "Show"} Filters
                    </Button>

                    {/* Mobile View Toggle */}
                    <ButtonGroup className="ml-auto">
                      <Button
                        size="sm"
                        onClick={() => handleViewModeChange("list")}
                        className="bg-transparent"
                      >
                        <ListFilter
                          className={`h-5 w-5 ${
                            viewMode === "list" ? "text-primary" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleViewModeChange("grid")}
                        className="bg-transparent"
                      >
                        <Grid
                          className={`h-4 w-4 ${
                            viewMode === "grid" ? "text-primary" : ""
                          }`}
                        />
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>

                {/* Active Filters */}
                {(filters.propertyType !== "all" ||
                  filters.searchQuery ||
                  filters.beds ||
                  filters.baths) && (
                  <div className="md:hidden mt-4 pt-4 ">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Active filters:
                      </span>
                      {filters.propertyType !== "all" && (
                        <Chip
                          variant="shadow"
                          color="primary"
                          className="font-medium animate-in fade-in duration-200"
                        >
                          {filters.propertyType === "homes"
                            ? "🏠 Homes"
                            : "🏞️ Plots"}
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
            {transformedProperties.length === 0 &&
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
                      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-2 pb-20">
                        {transformedProperties.map(
                          ({ property, type }, index) => (
                            <div
                              key={`${type}-${property.slug}-${index}`}
                              className="animate-in fade-in duration-200"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <PropertyCard item={property} />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <ParallaxScroll
                        items={transformedProperties.map(
                          ({ property }) => property
                        )}
                        isLessColls={true}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Custom Mobile Filter Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setMobileFiltersOpen(false)}
            />

            {/* Filter Panel */}
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col animate-in slide-in-from-left">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Filter Properties
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Refine your search results
                  </p>
                </div>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 text-2xl"
                >
                  ✕
                </Button>
              </div>

              {/* Filter Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                <SearchSidebar
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Footer */}
              <div className="p-4 space-y-3 flex-shrink-0  ">
                <Button
                  color="primary"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full transition-all duration-200"
                >
                  Apply Filters ({transformedProperties.length} results)
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => {
                    handleClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full transition-all duration-200"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
