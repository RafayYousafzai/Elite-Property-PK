"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Sparkles } from "lucide-react";
import type { SearchFilters } from "@/types/property";
import { Button, Chip } from "@heroui/react";
import { propertyTypes } from "@/components/Admin/PropertyForm";
import formatNumberShort from "@/lib/formatNumberShort";

interface SearchSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export default function SearchSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
}: SearchSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filters.priceRange
  );
  const [areaRange, setAreaRange] = useState<[number, number]>([
    filters.minArea,
    filters.maxArea,
  ]);

  const handlePropertyTypeChange = (
    type: "all" | "homes" | "plots" | "apartments" | "commercial"
  ) => {
    onFiltersChange({ ...filters, propertyType: type, subCategory: undefined });
  };

  const handleSubCategoryChange = (subCategory: string) => {
    onFiltersChange({
      ...filters,
      subCategory:
        filters.subCategory === subCategory ? undefined : subCategory,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const handleAreaRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setAreaRange(newRange);
    onFiltersChange({ ...filters, minArea: newRange[0], maxArea: newRange[1] });
  };

  const handleBedsChange = (beds: number) => {
    onFiltersChange({
      ...filters,
      beds: beds === filters.beds ? undefined : beds,
    });
  };

  const handleBathsChange = (baths: number) => {
    onFiltersChange({
      ...filters,
      baths: baths === filters.baths ? undefined : baths,
    });
  };

  const activeFiltersCount = [
    filters.propertyType !== "all",
    filters.subCategory !== undefined,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000000,
    filters.beds !== undefined,
    filters.baths !== undefined,
    filters.minArea > 0 || filters.maxArea < 500,
    filters.searchQuery.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="w-full md:w-80 bg-sidebar/95 backdrop-blur-xl border-sidebar-border/50 h-full overflow-y-auto animate-slide-in-up">
      <div className="py-6 md:px-6">
        <div className="hidden md:flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground bg-primary  bg-clip-text text-transparent">
                Filters
              </h2>
              <p className="text-xs text-muted-foreground">
                Find your perfect property
              </p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              radius="full"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 premium-hover"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {/* Property Type */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-4 pb-2 ">
              <h3 className="text-base font-semibold text-foreground">Type</h3>
              <Sparkles className="h-3 w-3 text-secondary ml-auto" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Properties" },
                { value: "homes", label: "Homes" },
                { value: "apartments", label: "Apartments" },
                { value: "plots", label: "Plots" },
                { value: "commercial", label: "Commercial" },
              ].map((type) => (
                <Chip
                  key={type.value}
                  variant={
                    filters.propertyType === type.value ? "shadow" : "flat"
                  }
                  className={`cursor-pointer transition-all duration-300 premium-hover ${
                    filters.propertyType === type.value
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105 border-primary/50"
                      : "hover:bg-muted hover:scale-105 hover:shadow-md border-border/50"
                  }`}
                  onClick={() =>
                    handlePropertyTypeChange(
                      type.value as
                        | "all"
                        | "homes"
                        | "plots"
                        | "apartments"
                        | "commercial"
                    )
                  }
                >
                  {type.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Sub Category - Show only when a main category is selected */}
          {filters.propertyType !== "all" &&
            filters.propertyType !== "apartments" && (
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="flex items-center gap-3 mb-4 pb-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Sub Category
                  </h3>
                  <Sparkles className="h-3 w-3 text-secondary ml-auto" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(filters.propertyType === "homes"
                    ? ["House", "flat/appartment", "Farm House", "Room"]
                    : filters.propertyType === "plots"
                    ? propertyTypes.Plots
                    : filters.propertyType === "commercial"
                    ? propertyTypes.Commercial
                    : []
                  ).map((subType) => (
                    <Chip
                      key={subType}
                      variant={
                        filters.subCategory === subType ? "shadow" : "flat"
                      }
                      className={`cursor-pointer transition-all duration-300 premium-hover ${
                        filters.subCategory === subType
                          ? "bg-primary text-secondary-foreground shadow-lg scale-105 border-secondary/50"
                          : "hover:bg-muted hover:scale-105 hover:shadow-md border-border/50"
                      }`}
                      onClick={() => handleSubCategoryChange(subType)}
                    >
                      {subType}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

          {/* Price Range */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4 pb-2 ">
              <h3 className="text-base font-semibold text-foreground">
                Price Range
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                Rs.{formatNumberShort(priceRange[0])} - Rs.
                {formatNumberShort(priceRange[1])}
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000000000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-50 pointer-events-none" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Rs.{priceRange[0].toLocaleString()}
                </span>
                <span className="text-muted-foreground font-medium">
                  Rs.{priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Beds & Baths (only for homes and apartments) */}
          {filters.propertyType !== "plots" && (
            <>
              {/* Bedrooms */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-3 mb-4 pb-2 ">
                  <h3 className="text-base font-semibold text-foreground">
                    Bedrooms
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((bed) => (
                    <Chip
                      key={bed}
                      variant={filters.beds === bed ? "solid" : "flat"}
                      className={`cursor-pointer transition-all duration-300 premium-hover ${
                        filters.beds === bed
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105 border-primary/50"
                          : "hover:bg-muted hover:scale-105 hover:shadow-md border-border/50"
                      }`}
                      onClick={() => handleBedsChange(bed)}
                    >
                      {bed}+ bed{bed > 1 ? "s" : ""}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex items-center gap-3 mb-4 pb-2 ">
                  <h3 className="text-base font-semibold text-foreground">
                    Bathrooms
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((bath) => (
                    <Chip
                      key={bath}
                      variant={filters.baths === bath ? "solid" : "flat"}
                      className={`cursor-pointer transition-all duration-300 premium-hover ${
                        filters.baths === bath
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg scale-105 border-primary/50"
                          : "hover:bg-muted hover:scale-105 hover:shadow-md border-border/50"
                      }`}
                      onClick={() => handleBathsChange(bath)}
                    >
                      {bath}+ bath{bath > 1 ? "s" : ""}
                    </Chip>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Area Range */}
          {/* <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center justify-between mb-4 pb-2 ">
              <h3 className="text-base font-semibold text-foreground">
                Area (sq ft)
              </h3>
              <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                {areaRange[0]} - {areaRange[1]} sq ft
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Slider
                  value={areaRange}
                  onValueChange={handleAreaRangeChange}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-50 pointer-events-none" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  {areaRange[0]} sq ft
                </span>
                <span className="text-muted-foreground font-medium">
                  {areaRange[1]} sq ft
                </span>
              </div>
            </div>
          </div> */}

          {/* Apply Button */}
          {/* {activeFiltersCount > 0 && (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold animate-fade-in-up premium-hover"
              style={{ animationDelay: "0.6s" }}
            >
              Apply {activeFiltersCount} Filter
              {activeFiltersCount > 1 ? "s" : ""}
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
}
