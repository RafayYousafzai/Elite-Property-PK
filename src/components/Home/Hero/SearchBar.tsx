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
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

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
    label: `Phase ${i + 1}`,
  }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedType !== "all") params.set("type", selectedType);
    if (query) params.set("search", query);
    router.push(`/explore?${params.toString()}`);
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

      {/* Phase Dropdown */}
      <div className="flex flex-row gap-3">
        <Select
          placeholder="Select in islamabad DHA..."
          selectedKeys={query ? [query] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setQuery(selected || "");
          }}
          startContent={<MapPin className="w-5 h-5 text-slate-400" />}
          // classNames={{
          //   trigger:
          //     "bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl py-4 h-auto min-h-[3.5rem] data-[hover=true]:bg-white",
          //   value: "text-slate-900",
          //   popoverContent: "bg-white",
          // }}
          className="flex-1"
        >
          {phases.map((phase) => (
            <SelectItem key={phase.value} value={phase.value}>
              {phase.label}
            </SelectItem>
          ))}
        </Select>

        <Button
          onClick={handleSearch}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 whitespace-nowrap"
        >
          <Search className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
