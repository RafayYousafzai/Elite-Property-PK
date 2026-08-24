"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Building2, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@heroui/react";

const PropertyTypeButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/30 font-semibold"
        : "bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white"
    }`}
  >
    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    <span>{label}</span>
  </button>
);

interface HeroSearchBarProps {
  selectedType?: string;
  onTypeChange?: (type: string) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  onSearch?: () => void;
}

export default function HeroSearchBar({
  selectedType: propSelectedType,
  onTypeChange,
  query: propQuery,
  onQueryChange,
  onSearch: propOnSearch,
}: HeroSearchBarProps = {}) {
  const [internalSelectedType, setInternalSelectedType] = useState<string>("all");
  const [internalQuery, setInternalQuery] = useState<string>("");
  const router = useRouter();

  const selectedType = propSelectedType ?? internalSelectedType;
  const setSelectedType = (type: string) => {
    if (onTypeChange) onTypeChange(type);
    else setInternalSelectedType(type);
  };

  const query = propQuery ?? internalQuery;
  const setQuery = (q: string) => {
    if (onQueryChange) onQueryChange(q);
    else setInternalQuery(q);
  };

  const propertyTypes = [
    { value: "all", label: "All", icon: Building2 },
    { value: "homes", label: "Homes", icon: Home },
    { value: "apartments", label: "Apartments", icon: Building2 },
    { value: "plots", label: "Plots", icon: MapPin },
    { value: "commercial", label: "Commercial", icon: Store },
  ];

  // Generate Phase options
  const phases = Array.from({ length: 10 }, (_, i) => ({
    value: `Phase ${i + 1}`,
    label: `DHA Phase ${i + 1}`,
  }));

  const handleSearch = () => {
    if (propOnSearch) {
      propOnSearch();
      return;
    }
    const params = new URLSearchParams();
    if (selectedType !== "all") params.set("type", selectedType);
    if (query) params.set("search", query);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5">
      {/* Property Type Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center lg:justify-start">
        {propertyTypes.map((type) => (
          <PropertyTypeButton
            key={type.value}
            icon={type.icon}
            label={type.label}
            isActive={selectedType === type.value}
            onClick={() => setSelectedType(type.value)}
          />
        ))}
      </div>

      {/* Phase Dropdown */}
      <div className="flex flex-row items-center gap-3">
        <Select
          aria-label="Select DHA Phase"
          placeholder="Select in islamabad DHA..."
          selectedKeys={query ? [query] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setQuery(selected || "");
          }}
          startContent={<MapPin className="w-5 h-5 text-slate-400" />}
          className="flex-1"
          classNames={{
            trigger: "h-12 rounded-xl",
          }}
        >
          {phases.map((phase) => (
            <SelectItem key={phase.value}>
              {phase.label}
            </SelectItem>
          ))}
        </Select>

        {/* Desktop search button (hidden on mobile) */}
        <Button
          onClick={handleSearch}
          aria-label="Search properties"
          className="hidden lg:flex h-12 w-12 aspect-square p-0 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 items-center justify-center cursor-pointer shrink-0"
        >
          <Search className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
}

