"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import type { SearchFilters } from "@/types/property";
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

  const handlePresetPrice = (min: number, max: number) => {
    const newRange: [number, number] = [min, max];
    setPriceRange(newRange);
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const handlePhaseChange = (phase: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: phase,
    });
  };

  const activeFiltersCount = [
    filters.propertyType !== "all",
    filters.subCategory !== undefined,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000000,
    filters.beds !== undefined,
    filters.baths !== undefined,
    filters.searchQuery.length > 0,
  ].filter(Boolean).length;

  const presetPrices = [
    { label: "Any", min: 0, max: 1000000000 },
    { label: "< 2 Crore", min: 0, max: 20000000 },
    { label: "2 - 5 Crore", min: 20000000, max: 50000000 },
    { label: "5 - 10 Crore", min: 50000000, max: 100000000 },
    { label: "10 Crore+", min: 100000000, max: 1000000000 },
  ];

  return (
    <div className="w-full md:w-80 bg-transparent border-0">
      <div className="py-2 md:py-6 px-1 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Filters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Refine property search
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer border-0 bg-transparent"
            >
              Reset All ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Property Type */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Property Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "homes", label: "Homes" },
              { value: "apartments", label: "Apartments" },
              { value: "plots", label: "Plots" },
              { value: "commercial", label: "Commercial" },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border-0 shadow-none ${
                  filters.propertyType === type.value
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Category */}
        {filters.propertyType !== "all" &&
          filters.propertyType !== "apartments" && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {(filters.propertyType === "homes"
                  ? ["House", "Farm House", "Room"]
                  : filters.propertyType === "plots"
                  ? propertyTypes.Plots
                  : filters.propertyType === "commercial"
                  ? propertyTypes.Commercial
                  : []
                ).map((subType) => (
                  <button
                    key={subType}
                    type="button"
                    onClick={() => handleSubCategoryChange(subType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border-0 shadow-none ${
                      filters.subCategory === subType
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {subType}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* DHA Phase (All + Phase 1 to Phase 7) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Select DHA Islamabad Phase
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "" },
              { label: "Phase 1", value: "Phase 1" },
              { label: "Phase 2", value: "Phase 2" },
              { label: "Phase 3", value: "Phase 3" },
              { label: "Phase 4", value: "Phase 4" },
              { label: "Phase 5", value: "Phase 5" },
              { label: "Phase 6", value: "Phase 6" },
              { label: "Phase 7", value: "Phase 7" },
            ].map((phase) => {
              const isSelected =
                phase.value === ""
                  ? !filters.searchQuery || filters.searchQuery === ""
                  : filters.searchQuery === phase.value;
              return (
                <button
                  key={phase.label}
                  type="button"
                  onClick={() => handlePhaseChange(phase.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border-0 shadow-none ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {phase.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Slider & Preset Chips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Price Range
            </h3>
            <span className="text-xs font-semibold text-primary">
              PKR {formatNumberShort(priceRange[0])} - {formatNumberShort(priceRange[1])}
            </span>
          </div>

          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={1000000000}
            min={0}
            step={5000000}
            className="w-full"
          />

          {/* Suggested Price Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presetPrices.map((preset) => {
              const isPresetActive =
                priceRange[0] === preset.min && priceRange[1] === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetPrice(preset.min, preset.max)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer border-0 shadow-none ${
                    isPresetActive
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        {filters.propertyType !== "plots" && (
          <div className="space-y-5 pt-1">
            {/* Bedrooms */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Bedrooms
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: undefined, label: "Any" },
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4+" },
                ].map((b) => {
                  const isSelected = filters.beds === b.value;
                  return (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          beds: b.value,
                        })
                      }
                      className={`min-w-9 h-9 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer border-0 shadow-none ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Bathrooms
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: undefined, label: "Any" },
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4+" },
                ].map((b) => {
                  const isSelected = filters.baths === b.value;
                  return (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          baths: b.value,
                        })
                      }
                      className={`min-w-9 h-9 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer border-0 shadow-none ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
