"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSearchBar from "./SearchBar";

const Hero: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedType !== "all") params.set("type", selectedType);
    if (query) params.set("search", query);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    // Set min-height to avoid content being cut off on smaller screens and use flex to center content.
    // pt-[10vh] adds padding at the top to account for your navbar.
    // pb-12 adds some bottom padding for better spacing.
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[15vh] pb-12">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/hero/hero-bg-mobile.webp" type="image/webp" />
          <source media="(min-width: 769px)" srcSet="/images/hero/hero-bg.webp" type="image/webp" />
          <img
            src="/images/hero/hero-bg.webp"
            alt="Elite Property Exchange DHA Islamabad Luxury Villa"
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content & CTAs */}
            {/* Centered on mobile, left-aligned on large screens */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
                  Live
                  <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                    {" "}
                    Elite
                  </span>{" "}
                  by
                  <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                    {" "}
                    Elite
                  </span>
                </h1>
                <p className="-mt-5 text-lg sm:text-xl text-white/90 leading-snug max-w-2xl mx-auto lg:mx-0 font-light text-balance">
                  Step into a world of modern architecture and secure
                  investments. At Elite Property Exchange, every property is
                  verified and handpicked to match your lifestyle and financial
                  goals.
                </p>
              </div>

              {/* Category Buttons for mobile - Replaced with Search Bar */}
              <div className="lg:hidden">
                <HeroSearchBar
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  query={query}
                  onQueryChange={setQuery}
                  onSearch={handleSearch}
                />
              </div>

              {/* Main Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {query && (
                  <Button
                    onClick={handleSearch}
                    className="lg:hidden h-12 bg-primary hover:bg-primary/90 text-primary-foreground px-6 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-none border-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search Properties</span>
                  </Button>
                )}
                <Button
                  asChild
                  className={`h-12 bg-primary hover:bg-primary/90 text-primary-foreground px-6 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-none border-0 ${
                    query ? "hidden lg:flex" : "flex"
                  }`}
                >
                  <Link href="/contactus">Book a visit</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-0 bg-white/15 backdrop-blur-md text-white cursor-pointer hover:bg-white/25 hover:text-white px-6 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-none"
                >
                  <Link href="/explore">View Properties</Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Search Bar for Desktop */}
            <div className="hidden lg:flex flex-col items-center justify-center space-y-10">
              <HeroSearchBar
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
