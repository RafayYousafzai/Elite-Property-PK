"use client";
import * as React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Services = () => {
  const services = [
    {
      icon: "ph:house-simple-fill",
      title: "Plot Sales & Advice",
      description:
        "Buy residential or commercial plots in DHA Islamabad with confidence. We guide you to the best locations for value and growth.",
      features: ["Prime Locations", "Clear Guidance", "Safe Investment"],
    },
    {
      icon: "ph:buildings-fill",
      title: "Apartments for Sale",
      description:
        "Find modern apartments with comfort, style, and secure community living in DHA Islamabad.",
      features: ["Modern Style", "Great Facilities", "Safe Living"],
    },
    {
      icon: "ph:trend-up-fill",
      title: "Investment Guidance",
      description:
        "Want to grow your money? We help you choose the right property deals, whether for quick returns or long-term gains.",
      features: ["High Returns", "Smart Deals", "Steady Growth"],
    },
    {
      icon: "ph:gear-fill",
      title: "Property Management",
      description:
        "From paperwork to possession, we handle the tough parts so you can relax. Simple, transparent, and stress-free.",
      features: ["Full Support", "Clear Process", "No Stress"],
    },
    {
      icon: "ph:globe-hemisphere-west-fill",
      title: "Overseas Client Help",
      description:
        "Living abroad? We make it easy to buy, sell, or invest in DHA Islamabad from anywhere in the world.",
      features: ["Remote Support", "Trusted Team", "Easy Process"],
    },
  ];

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      id="services"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
          alt="Luxury real estate background"
          fill
          className="object-cover"
          priority
          unoptimized={true}
        />
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70"></div>
        {/* Additional Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-30"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-300"></div>

      <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10 py-20">
        {/* Header */}

        <div className="mb-16 flex flex-col gap-3 ">
          <div className="flex gap-2.5 items-center justify-center">
            <span>
              <Icon
                icon="ph:house-simple-fill"
                width={20}
                height={20}
                className="text-primary"
              />
            </span>
            <p className="text-base font-semibold dark:text-dark/75 text-white/75">
              Our Premium Services
            </p>
          </div>
          <h2 className="text-40 lg:text-52 font-medium dark:text-black text-white text-center tracking-tight leading-11 mb-2">
            Discover inspiring{" "}
            <span className="text-primary">designed apartments.</span>
          </h2>
          <p className="text-xm font-normal dark:text-black/50 text-white/50 text-center">
            Curated apartments where elegance, style, and comfort unite.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={service.icon} className="text-3xl text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-white/70 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                {/* <div className="mt-6 pt-6 border-t border-white/10">
                  <button className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                    Learn More
                    <Icon icon="ph:arrow-right" className="text-lg" />
                  </button>
                </div> */}
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-16 animate-fade-in-up"
          style={{ animationDelay: "800ms" }}
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-white text-3xl font-bold mb-4">
              Ready to Transform Your Property Dreams?
            </h3>
            <p className="text-white/80 mb-6">
              Connect with our experts today and discover the perfect property
              solution for you
            </p>
            <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
              <Link href="/contactus">Get Started Today</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Services;
