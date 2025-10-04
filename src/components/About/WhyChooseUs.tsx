"use client";
import * as React from "react";
import { Icon } from "@iconify/react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "ph:shield-check-fill",
      title: "Verified Properties",
      description:
        "Every property undergoes rigorous verification for legal compliance and authenticity.",
      stats: "100% Verified",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "ph:users-three-fill",
      title: "Expert Consultation",
      description:
        "Our certified real estate experts provide personalized guidance throughout your journey.",
      stats: "50+ Experts",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: "ph:clock-fill",
      title: "24/7 Support",
      description:
        "Round-the-clock customer support ensuring you never face any property challenges alone.",
      stats: "24/7 Available",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "ph:chart-line-up-fill",
      title: "Investment Growth",
      description:
        "Our properties have shown consistent appreciation with average returns of 15-20% annually.",
      stats: "15-20% ROI",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: "ph:handshake-fill",
      title: "Trust & Transparency",
      description:
        "Complete transparency in all transactions with detailed documentation and legal support.",
      stats: "Zero Hidden Costs",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: "ph:globe-hemisphere-west-fill",
      title: "Global Reach",
      description:
        "Serving international clients with dedicated overseas support and digital solutions.",
      stats: "30+ Countries",
      color: "from-rose-500 to-rose-600",
    },
  ];

  const achievements = [
    {
      icon: "ph:trophy-fill",
      title: "Best Real Estate Company",
      year: "2023",
      organization: "Pakistan Real Estate Awards",
    },
    {
      icon: "ph:star-fill",
      title: "Customer Excellence Award",
      year: "2022",
      organization: "DHA Islamabad",
    },
    {
      icon: "ph:medal-fill",
      title: "Innovation in Real Estate",
      year: "2023",
      organization: "Property Tech Summit",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-2xl animate-pulse delay-300"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
            <Icon icon="ph:lightning-fill" className="text-2xl text-primary" />
            <span className="text-white font-semibold">
              Why Choose Elite Property
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Unmatched Excellence in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              Real Estate Services
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our premium services designed to
            exceed expectations and deliver exceptional results in every
            property transaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon icon={feature.icon} className="text-3xl text-white" />
                </div>

                {/* Stats Badge */}
                <div className="absolute top-0 right-0 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/30">
                  <span className="text-primary text-sm font-semibold">
                    {feature.stats}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn More */}
                {/* <div className="mt-6 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                  <span className="mr-2">Learn More</span>
                  <Icon icon="ph:arrow-right" className="text-lg" />
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">
              Awards & Recognition
            </h3>
            <p className="text-white/70 text-lg">
              Our commitment to excellence has been recognized by industry
              leaders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <Icon
                    icon={achievement.icon}
                    className="text-3xl text-white"
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {achievement.title}
                </h4>
                <p className="text-primary font-semibold text-lg mb-1">
                  {achievement.year}
                </p>
                <p className="text-white/60 text-sm">
                  {achievement.organization}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "500+", label: "Properties Sold", icon: "ph:house-fill" },
            {
              number: "98%",
              label: "Client Satisfaction",
              icon: "ph:smiley-fill",
            },
            {
              number: "15+",
              label: "Years Experience",
              icon: "ph:calendar-fill",
            },
            { number: "1000+", label: "Happy Families", icon: "ph:heart-fill" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in-up"
              style={{ animationDelay: `${(index + 6) * 150}ms` }}
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Icon icon={stat.icon} className="text-2xl text-primary" />
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
