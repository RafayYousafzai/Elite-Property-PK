import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    // Set min-height to avoid content being cut off on smaller screens and use flex to center content.
    // pt-[10vh] adds padding at the top to account for your navbar.
    // pb-12 adds some bottom padding for better spacing.
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[15vh] pb-12">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/1 (1).jpg"
          alt="Hero Background"
          fill // Changed layout="fill" to the recommended `fill` prop
          className="object-cover object-center"
        />
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
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                  Step into a world of modern architecture and secure
                  investments. At Elite Property Exchange, every property is
                  verified and handpicked to match your lifestyle and financial
                  goals.
                </p>
              </div>

              {/* Category Buttons for mobile */}
              <div className="my-10 md:hidden">
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-semibold mb-4">
                  Explore.
                </p>
                {/* Use flexbox with gap for clean, responsive spacing */}
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    asChild
                    className="bg-primary/30 border border-primary/50 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <Link href="/explore?type=apartments">Apartments</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-primary/30 border border-primary/50 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <Link href="/explore?type=homes">Houses</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-primary/30 border border-primary/50 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <Link href="/explore?type=plot">Plots</Link>
                  </Button>
                </div>
              </div>

              {/* Main Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
                >
                  <Link href="/contactus">Book a visit</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white cursor-pointer hover:bg-white/20 hover:text-white px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Link href="/explore">View Properties</Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Kept hidden on lg screens as per original code */}
            <div className="hidden lg:flex flex-col items-center justify-center space-y-10">
              {/* Your commented-out code for desktop stats/buttons can go here */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
