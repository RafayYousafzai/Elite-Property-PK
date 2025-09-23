"use client";
import * as React from "react";
import { Icon } from "@iconify/react";

const Team = () => {
  const teamMembers = [
    {
      name: "Ahmed Hassan",
      position: "Chief Executive Officer",
      image: "/images/users/user-01.png",
      bio: "15+ years of real estate expertise with a vision to revolutionize property investment in Pakistan.",
      specialties: ["Strategic Planning", "Market Analysis", "Leadership"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ahmed@homely.pk",
      },
    },
    {
      name: "Sara Khan",
      position: "Head of Sales",
      image: "/images/users/user-02.png",
      bio: "Expert in luxury property sales with over 500+ successful transactions in DHA Islamabad.",
      specialties: ["Luxury Sales", "Client Relations", "Negotiation"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sara@homely.pk",
      },
    },
    {
      name: "Muhammad Ali",
      position: "Investment Advisor",
      image: "/images/users/user-03.png",
      bio: "Specialized in real estate investment strategies with proven track record of maximizing ROI.",
      specialties: [
        "Investment Strategy",
        "Portfolio Management",
        "Market Research",
      ],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ali@homely.pk",
      },
    },
    {
      name: "Fatima Sheikh",
      position: "Legal Consultant",
      image: "/images/users/user-04.png",
      bio: "Ensuring seamless legal processes with expertise in property law and documentation.",
      specialties: ["Property Law", "Documentation", "Legal Compliance"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "fatima@homely.pk",
      },
    },
  ];

  const departments = [
    {
      icon: "ph:handshake-fill",
      title: "Sales Team",
      description:
        "Expert sales professionals dedicated to finding your perfect property match.",
      count: "15+ Experts",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "ph:chart-line-up-fill",
      title: "Investment Advisory",
      description:
        "Strategic advisors helping you maximize returns on property investments.",
      count: "8+ Advisors",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: "ph:scales-fill",
      title: "Legal Department",
      description:
        "Ensuring all transactions are legally compliant and transparent.",
      count: "5+ Lawyers",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "ph:headset-fill",
      title: "Customer Support",
      description:
        "24/7 support team ensuring exceptional customer experience.",
      count: "12+ Agents",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl"></div>

      <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-6">
            <Icon icon="ph:users-fill" className="text-2xl text-primary" />
            <span className="text-primary font-semibold">Our Team</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Meet the Experts Behind
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Your Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our passionate team of real estate professionals brings decades of
            combined experience to help you achieve your property goals with
            confidence and excellence.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 p-1">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Icon
                      icon="ph:user-fill"
                      className="text-4xl text-gray-500"
                    />
                  </div>
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>

              {/* Member Info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Specialties:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                  <Icon icon="ph:linkedin-logo-fill" className="text-lg" />
                </button>
                <button className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                  <Icon icon="ph:envelope-fill" className="text-lg" />
                </button>
                <button className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                  <Icon icon="ph:phone-fill" className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Departments Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">
              Our Departments
            </h3>
            <p className="text-white/70 text-lg">
              Specialized teams working together to deliver exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="group text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${dept.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon icon={dept.icon} className="text-2xl text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                  {dept.title}
                </h4>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {dept.description}
                </p>
                <div className="bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                  <span className="text-primary text-sm font-semibold">
                    {dept.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Join Team CTA */}
          <div className="text-center mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-2xl font-bold text-white mb-4">
                Join Our Team
              </h4>
              <p className="text-white/80 mb-6">
                Be part of Pakistan&apos;s leading real estate company and shape
                the future of property investment.
              </p>
              <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
                <Icon icon="ph:briefcase-fill" className="text-xl" />
                View Career Opportunities
              </button>
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

export default Team;
