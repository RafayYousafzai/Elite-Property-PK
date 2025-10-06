"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getTeamMembers } from "@/lib/supabase/team";
import { TeamMember } from "@/types/team";

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <section className="!pt-44 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-3 border-gray-200 dark:border-gray-700 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-44 pb-20 bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50 dark:from-gray-950 dark:via-amber-950/10 dark:to-gray-950 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto max-w-8xl px-5 2xl:px-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-full mb-6">
              <Icon
                icon="ph:users-three-fill"
                className="text-amber-600 dark:text-amber-500"
                width={20}
              />
              <span className="text-amber-700 dark:text-amber-500 text-sm font-medium">
                Meet Our Team
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              The Experts Behind
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                Elite Property
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Our dedicated team of professionals brings decades of combined
              experience to help you find your perfect property or make the best
              investment decisions.
            </p>

            {/* <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-500 mb-2">
                  15+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-500 mb-2">
                  500+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Properties Sold
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600 dark:text-amber-500 mb-2">
                  1000+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Happy Clients
                </div>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2"
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-amber-100 to-gray-100 dark:from-amber-950/20 dark:to-gray-800">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2"
                    >
                      View Profile
                      <Icon icon="ph:arrow-right" width={20} />
                    </button>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-semibold text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-900/50">
                    {member.experience}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-500 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Contact Info */}
                  {(member.email || member.phone) && (
                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Icon
                            icon="ph:envelope"
                            width={16}
                            className="text-amber-500"
                          />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Icon
                            icon="ph:phone"
                            width={16}
                            className="text-amber-500"
                          />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <Icon icon="ph:linkedin-logo" width={18} />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <Icon icon="ph:twitter-logo" width={18} />
                      </a>
                    )}
                    {member.facebook && (
                      <a
                        href={member.facebook}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <Icon icon="ph:facebook-logo" width={18} />
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
                      >
                        <Icon icon="ph:instagram-logo" width={18} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-800 dark:to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero/pattern.png')] opacity-10"></div>
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Icon
              icon="ph:handshake-fill"
              width={64}
              height={64}
              className="text-white mx-auto mb-6"
            />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-amber-100 mb-8 leading-relaxed">
              Our team is here to guide you through every step of your property
              journey. Get in touch today and experience the Elite Property
              difference.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-amber-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                Contact Us
                <Icon icon="ph:arrow-right" width={20} />
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 border border-white/20"
              >
                View Properties
                <Icon icon="ph:house" width={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal for Team Member Details */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedMember(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-gradient-to-br from-amber-100 to-gray-100 dark:from-amber-950/20 dark:to-gray-700">
              <Image
                src={selectedMember.image}
                alt={selectedMember.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 transition-colors duration-300"
              >
                <Icon
                  icon="ph:x"
                  width={24}
                  className="text-gray-900 dark:text-white"
                />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMember.name}
                  </h2>
                  <p className="text-xl text-amber-600 dark:text-amber-500 font-medium mb-1">
                    {selectedMember.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMember.experience} of Experience
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedMember.bio}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 rounded-lg text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {(selectedMember.email || selectedMember.phone) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {selectedMember.email && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="ph:envelope"
                            width={20}
                            className="text-amber-600 dark:text-amber-500"
                          />
                        </div>
                        <span>{selectedMember.email}</span>
                      </div>
                    )}
                    {selectedMember.phone && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="ph:phone"
                            width={20}
                            className="text-amber-600 dark:text-amber-500"
                          />
                        </div>
                        <span>{selectedMember.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                {selectedMember.linkedin && (
                  <a
                    href={selectedMember.linkedin}
                    className="flex-1 py-3 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-500 hover:text-white transition-all duration-300 font-medium"
                  >
                    <Icon icon="ph:linkedin-logo" width={20} />
                    LinkedIn
                  </a>
                )}
                {selectedMember.instagram && (
                  <a
                    href={selectedMember.instagram}
                    className="flex-1 py-3 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-500 hover:text-white transition-all duration-300 font-medium"
                  >
                    <Icon icon="ph:instagram-logo" width={20} />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
