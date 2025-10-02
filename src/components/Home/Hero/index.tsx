import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen overflow-hidden ">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
          alt="Luxury apartments in DHA Islamabad"
          fill
          priority
          className="object-cover object-center"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center mt-24 xl:mt-28 2xl:mt-40 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight">
                  Live Elite by
                  <span className="bg-primary bg-clip-text text-transparent">
                    {" "}
                    Elite
                  </span>
                  .
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl text-pretty font-light">
                  At Elite Property, we help you buy, sell, or rent houses and
                  plots in DHA Islamabad. Simple process, honest advice, and the
                  right place for your family or investment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
                >
                  <Link href="/contactus">Get in Touch</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white cursor-pointer hover:text-card-foreground px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Link href="/explore">View Properties</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:flex lg:justify-self-end">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 lg:p-10 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center space-y-2">
                    <p className="text-3xl lg:text-4xl font-bold text-white">
                      100+
                    </p>
                    <p className="text-sm lg:text-base text-white/70 font-medium">
                      Properties
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl lg:text-4xl font-bold text-white">
                      $2.5K+
                    </p>
                    <p className="text-sm lg:text-base text-white/70 font-medium">
                      Properties Sold
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl lg:text-4xl font-bold text-white">
                      7+
                    </p>
                    <p className="text-sm lg:text-base text-white/70 font-medium">
                      Years Experience
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl lg:text-4xl font-bold text-white">
                      98%
                    </p>
                    <p className="text-sm lg:text-base text-white/70 font-medium">
                      Client Satisfaction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm font-medium tracking-wider uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
