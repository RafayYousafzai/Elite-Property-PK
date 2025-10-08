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
  const [query, setQuery] = useState<string>("");

  // Generate Phase options
  const phases = Array.from({ length: 10 }, (_, i) => ({
    value: `Phase ${i + 1}`,
    label: `Phase ${i + 1}`,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-row gap-3">
        <Select
          placeholder="Select in islamabad DHA..."
          selectedKeys={query ? [query] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setQuery(selected || "");
          }}
          startContent={<MapPin className="w-5 h-5 text-slate-400" />}
          className="flex-1"
        >
          {phases.map((phase) => (
            <SelectItem key={phase.value} value={phase.value}>
              {phase.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
