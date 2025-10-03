import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          src="/images/hero/hero-video.mp4"
          autoPlay
          loop
          muted
          className="object-cover object-center h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content & Main CTAs */}
            <div className="space-y-8 text-left lg:text-left">
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
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light ">
                  Step into a world of modern architecture and secure
                  investments. At Elite Property Exchange, every property is
                  verified and handpicked to match your lifestyle and
                  financial goals.
                </p>
              </div>
              <div className="my-20 md:hidden">
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0  font-semibold">
                  Explore.
                </p>

                {/* Category Buttons for mobile */}
                <div className="flex-row gap-10  mt-2">
                  <Button
                    asChild
                    className=" w-[30%] bg-primary/30 border border-primary/50 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <Link href="/properties?type=apartment">Apartments</Link>
                  </Button>
                  <Button
                    asChild
                    className=" w-[30%] mx-[4%] bg-primary/30 border border-primary/50 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <Link href="/properties?type=house">Houses</Link>
                  </Button>
                  <Button
                    asChild
                    className=" w-[30%] bg-primary/30 border border-primary/50 backdrop-blur-sm text-white/80 hover:bg-white/20 hover:text-white rounded-full"
                  >
                    <Link href="/properties?type=plot">Plots</Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25"
                >
                  <Link href="/contactus">Get in Touch</Link>
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

            {/* Right Column: Category Buttons & Stats */}
            <div className="hidden lg:flex flex-col items-center justify-center space-y-10">
              {/* <div className="w-[55%]">
                <p className="text-white text-left font-bold text-lg">
                  Browse by Category
                </p>
              </div>
              <div className="flex flex-col space-y-4 w-full max-w-xs -mt-6 ">
                <Button
                  asChild
                  className="border-white/20 bg-primary/30 backdrop-blur-sm text-white/80 hover:bg-primary/20 hover:text-white rounded-full text-base justify-center py-5 transition-all duration-300"
                >
                  <Link href="/properties?type=apartment">Apartments</Link>
                </Button>
                <Button
                  asChild
                  className="border-white/20 bg-primary/30 backdrop-blur-sm text-white/80 hover:bg-primary/20 hover:text-white rounded-full text-base justify-center py-5 transition-all duration-300"
                >
                  <Link href="/properties?type=house">Houses</Link>
                </Button>
                <Button
                  asChild
                  className="border-white/20 bg-primary/30 backdrop-blur-sm text-white/80 hover:bg-primary/20 hover:text-white rounded-full text-base justify-center py-5 transition-all duration-300"
                >
                  <Link href="/properties?type=plot">Plots</Link>
                </Button>
              </div> */}

              {/* Stats */}
              {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl w-full max-w-xs">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center space-y-2">
                    <p className="text-4xl font-bold text-white">100+</p>
                    <p className="text-base text-white/70 font-medium">
                      Properties
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-4xl font-bold text-white">7+</p>
                    <p className="text-base text-white/70 font-medium">
                      Years Experience
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="text-sm font-medium tracking-wider uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </div> */}
    </section>
  );
};

export default Hero;
