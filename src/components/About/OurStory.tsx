"use client";
import * as React from "react";
import { Icon } from "@iconify/react";

const OurStory = () => {
  const timeline = [
    {
      year: "2009",
      title: "Foundation",
      description:
        "Started with a vision to revolutionize real estate in DHA Islamabad",
      icon: "ph:rocket-launch-fill",
    },
    {
      year: "2015",
      title: "Expansion",
      description:
        "Became the leading real estate consultancy in DHA Islamabad",
      icon: "ph:trend-up-fill",
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description:
        "Launched digital platforms for seamless property transactions",
      icon: "ph:device-mobile-fill",
    },
    {
      year: "2025",
      title: "Future Vision",
      description:
        "Setting new standards in luxury real estate with AI-powered solutions",
      icon: "ph:crown-fill",
    },
  ];

  const values = [
    {
      icon: "ph:handshake-fill",
      title: "Trust & Transparency",
      description:
        "We believe in building lasting relationships through honest communication and transparent dealings.",
    },
    {
      icon: "ph:diamond-fill",
      title: "Excellence",
      description:
        "We strive for excellence in every interaction, every property, and every service we provide.",
    },
    {
      icon: "ph:users-fill",
      title: "Client-Centric",
      description:
        "Your dreams and aspirations are at the heart of everything we do.",
    },
    {
      icon: "ph:lightbulb-fill",
      title: "Innovation",
      description:
        "We continuously evolve and adopt cutting-edge technologies to serve you better.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl"></div>

      <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Icon icon="ph:book-open-fill" className="text-2xl text-primary" />
            <span className="text-primary font-semibold">Our Journey</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Our Story of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From humble beginnings to becoming DHA Islamabad&apos;s most trusted
            real estate partner, our journey is defined by unwavering commitment
            to our clients&apos; success.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-left">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6">
              <Icon icon="ph:target-fill" className="text-3xl text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              To provide exceptional real estate services that exceed
              expectations, creating lasting value for our clients through
              innovative solutions, expert guidance, and unwavering integrity in
              every transaction.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-right">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Icon icon="ph:eye-fill" className="text-3xl text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              To be the definitive leader in luxury real estate, setting
              industry standards through innovation, excellence, and an
              unwavering commitment to transforming how people experience
              property investment.
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Our Journey Through Time
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>

            <div className="space-y-16">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Content */}
                  <div
                    className={`lg:w-5/12 ${
                      index % 2 === 0 ? "lg:pr-16" : "lg:pl-16"
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                          <Icon
                            icon={item.icon}
                            className="text-xl text-white"
                          />
                        </div>
                        <span className="text-3xl font-bold text-primary">
                          {item.year}
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Point */}
                  <div className="lg:w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg z-10"></div>
                  </div>

                  {/* Spacer */}
                  <div className="lg:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Our Core Values
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            These principles guide every decision we make and every relationship
            we build
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon icon={value.icon} className="text-2xl text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
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

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default OurStory;
