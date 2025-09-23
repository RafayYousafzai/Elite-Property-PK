"use client";
import * as React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const AboutHero = () => {
  const stats = [
    { number: "500+", label: "Properties Sold", icon: "ph:house-fill" },
    { number: "15+", label: "Years Experience", icon: "ph:calendar-fill" },
    { number: "1000+", label: "Happy Clients", icon: "ph:smiley-fill" },
    { number: "50+", label: "Expert Agents", icon: "ph:users-fill" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Multiple Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
          alt="Luxury real estate"
          fill
          className="object-cover"
          priority
          unoptimized={true}
        />
        {/* Primary Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/80"></div>
        {/* Secondary Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-primary/30 rotate-12"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-white/15 rotate-45"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 right-16 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-40 left-16 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse delay-300"></div>

      <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Section */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon icon="ph:crown-fill" className="text-white text-lg" />
              </div>
              <span className="text-white font-semibold tracking-wide">
                Premium Real Estate Excellence
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Crafting
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Dream Homes
                </span>
                Since 2009
              </h1>

              <p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl">
                We are more than just a real estate company. We are architects
                of dreams, curators of luxury, and guardians of your most
                important investment.
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-4">
              {[
                "Premium properties in DHA Islamabad's most coveted locations",
                "Personalized service with dedicated relationship managers",
                "Transparent processes backed by legal expertise",
                "Investment strategies designed for maximum returns",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 animate-fade-in-left"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                  <span className="text-white/90 text-lg">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Icon icon="ph:phone-fill" className="text-xl" />
                Schedule Consultation
              </button>
              <button className="border-2 border-white/30 hover:border-primary text-white hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
                <Icon icon="ph:play-fill" className="text-xl" />
                Watch Our Story
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-8 animate-fade-in-right">
            {/* Decorative Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-500">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Our Impact
                </h3>
                <p className="text-white/70">
                  Numbers that speak for themselves
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                      <Icon icon={stat.icon} className="text-2xl text-white" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/70 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "ph:medal-fill",
                  title: "Best Real Estate",
                  subtitle: "Company 2023",
                },
                {
                  icon: "ph:star-fill",
                  title: "Customer Choice",
                  subtitle: "Award Winner",
                },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-3">
                    <Icon icon={badge.icon} className="text-xl text-white" />
                  </div>
                  <h4 className="text-white font-bold text-lg">
                    {badge.title}
                  </h4>
                  <p className="text-white/60 text-sm">{badge.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default AboutHero;
