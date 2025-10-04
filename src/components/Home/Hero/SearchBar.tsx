"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, Building2, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary text-white shadow-lg shadow-primary/30"
        : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </button>
);

export default function HeroSearchBar() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const propertyTypes = [
    { value: "all", label: "All", icon: Building2 },
    { value: "homes", label: "Homes", icon: Home },
    { value: "appartments", label: "Apartments", icon: Building2 },
    { value: "plots", label: "Plots", icon: MapPin },
    { value: "commercial", label: "Commercial", icon: Store },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedType !== "all") {
      params.set("type", selectedType);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(`/explore?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Property Type Filters */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
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

      {/* Search Input */}
      <div className="flex flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-4 pr-4 py-2 rounded-xl bg-white/95 backdrop-blur-sm border border-white/20 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
          />
        </div>
        <Button
          onClick={handleSearch}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 whitespace-nowrap"
        >
          <Search className="w-5 h-5   text-white" />
        </Button>
      </div>
    </div>
  );
}
