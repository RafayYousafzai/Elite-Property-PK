"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Search } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "all", label: "All" },
  { value: "homes", label: "Homes" },
  { value: "plots", label: "Plots" },
  { value: "apartments", label: "Apartments" },
  { value: "commercial", label: "Commercial" },
];

const PHASES = Array.from({ length: 7 }, (_, i) => `Phase ${i + 1}`);

// Plain controls (no component library) keep the homepage's first-load JS small.
export default function HeroSearchBar() {
  const router = useRouter();
  const [type, setType] = useState("all");
  const [phase, setPhase] = useState("");

  const search = () => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (phase) params.set("search", phase);
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : "/explore");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        search();
      }}
      className="w-full rounded-2xl bg-white/95 p-4 text-[#1a1714] shadow-2xl shadow-black/30 backdrop-blur-md sm:p-5"
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">
        Find a property
      </p>

      <div role="radiogroup" aria-label="Property type" className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROPERTY_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={type === t.value}
            onClick={() => setType(t.value)}
            className={`h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-medium transition-colors sm:px-4 ${
              type === t.value
                ? "bg-[#1a1714] text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-[#1a1714]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">DHA phase</span>
          <MapPin
            size={17}
            strokeWidth={1.5}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a7a1e]"
          />
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className="h-12 w-full cursor-pointer appearance-none rounded-full border border-stone-200 bg-[#faf8f3] pl-11 pr-10 text-[15px] outline-none transition-colors hover:border-stone-300 focus:border-[#9a7a1e]"
          >
            <option value="">Any DHA phase</option>
            {PHASES.map((p) => (
              <option key={p} value={p}>
                DHA {p}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#1a1714] px-5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e] sm:px-6"
        >
          <Search size={16} strokeWidth={2} />
          <span className="hidden sm:inline">Search</span>
          <span className="sr-only sm:hidden">Search properties</span>
        </button>
      </div>
    </form>
  );
}
