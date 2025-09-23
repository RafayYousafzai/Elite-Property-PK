"use client";
import * as React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const AboutCTA = () => {
  const contactMethods = [
    {
      icon: "ph:phone-fill",
      title: "Call Us",
      description: "Speak directly with our property experts",
      value: "+92 300 1234567",
      action: "Call Now",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: "ph:envelope-fill",
      title: "Email Us",
      description: "Get detailed information via email",
      value: "info@homely.pk",
      action: "Send Email",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "ph:map-pin-fill",
      title: "Visit Office",
      description: "Meet us at our DHA Islamabad office",
      value: "Phase 2, DHA Islamabad",
      action: "Get Directions",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "ph:chat-circle-fill",
      title: "Live Chat",
      description: "Instant support through live chat",
      value: "Available 24/7",
      action: "Start Chat",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const services = [
    "Property Investment Consultation",
    "Legal Documentation Support",
    "Property Valuation Services",
    "Overseas Client Support",
    "Property Management",
    "Market Analysis Reports",
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
          alt="Luxury development"
          fill
          className="object-cover"
          unoptimized={true}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-20"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Section */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <Icon
                icon="ph:rocket-launch-fill"
                className="text-2xl text-primary"
              />
              <span className="text-white font-semibold">Ready to Start?</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Let&apos;s Turn Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                  Property Dreams
                </span>
                Into Reality
              </h2>

              <p className="text-xl text-white/80 leading-relaxed">
                Take the first step towards your dream property investment. Our
                expert team is ready to guide you through every step of your
                real estate journey with personalized solutions and unmatched
                expertise.
              </p>
            </div>

            {/* Services List */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white mb-4">
                What we offer:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 animate-fade-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-white/90">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <Icon icon="ph:calendar-plus-fill" className="text-xl" />
                Schedule Free Consultation
              </button>
              <button className="border-2 border-white/30 hover:border-primary text-white hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2">
                <Icon icon="ph:download-fill" className="text-xl" />
                Download Brochure
              </button>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6 animate-fade-in-right">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                Get In Touch
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon icon={method.icon} className="text-xl text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                      {method.title}
                    </h4>
                    <p className="text-white/70 text-sm mb-3">
                      {method.description}
                    </p>
                    <p className="text-white font-semibold mb-4">
                      {method.value}
                    </p>
                    <button className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                      {method.action}
                      <Icon icon="ph:arrow-right" className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      24/7
                    </div>
                    <div className="text-white/70 text-sm">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      &lt;1hr
                    </div>
                    <div className="text-white/70 text-sm">Response</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      100%
                    </div>
                    <div className="text-white/70 text-sm">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6">
              <div className="text-center mb-4">
                <h4 className="text-xl font-bold text-white mb-2">
                  Stay Updated
                </h4>
                <p className="text-white/90 text-sm">
                  Get the latest property insights and exclusive deals
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/50"
                />
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors duration-300 flex items-center gap-2">
                  <Icon icon="ph:paper-plane-fill" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h4 className="text-2xl font-bold text-white mb-6">
              Trusted by 1000+ Happy Clients
            </h4>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {[
                { icon: "ph:shield-check-fill", text: "Verified Properties" },
                { icon: "ph:certificate-fill", text: "Licensed & Certified" },
                { icon: "ph:handshake-fill", text: "Transparent Deals" },
                { icon: "ph:clock-fill", text: "Quick Processing" },
              ].map((trust, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Icon icon={trust.icon} className="text-2xl text-primary" />
                  <span className="text-white font-medium">{trust.text}</span>
                </div>
              ))}
            </div>
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

export default AboutCTA;
