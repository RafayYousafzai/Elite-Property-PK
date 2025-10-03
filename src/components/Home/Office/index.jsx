"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Facebook,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaTiktok } from "react-icons/fa";

const LocationMap = () => {
  const officeLocation = {
    lat: 33.7294, // Example coordinates for Islamabad
    lng: 73.0931,
    address:
      "2nd Floor, Plaza no 19, Tipu Boulevard, Sector G DHA Phase II, Islamabad",
    phone: "+923344111778",
    email: "pk.eliteproperty@gmail.com",
    hours: "Working Hours 9 Am to 7 Pm 7 Days A Week",
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleCallNow = () => {
    window.open(`tel:${officeLocation.phone}`, "_self");
  };

  return (
    <div className="container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 z-10 pb-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
      </div> */}

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <MapPin className="w-4 h-4" />
            Visit Our Office
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Us in the Heart of
            <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text  text-primary">
              {" "}
              Islamabad
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visit our premium office location for personalized consultations and
            exclusive property viewings
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Container */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-slate-50 rounded-2xl overflow-hidden  ">
              {/* Interactive Map Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-yellow-100 relative">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.8!2d${officeLocation.lng}!3d${officeLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQzJzQ1LjgiTiA3M8KwMDUnMzUuMiJF!5e0!3m2!1sen!2s!4v1234567890`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                ></iframe>
              </div>

              {/* Map Footer */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Elite Property Real Estate
                    </h4>
                    <p className="text-sm text-gray-600">
                      Premium Property Solutions
                    </p>
                  </div>
                  <button
                    onClick={handleGetDirections}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="relative group">
              {/* Luxury gradient background with subtle animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-yellow-50/30 to-orange-100/50 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-100/50">
                <div className="grid grid-cols-1 gap-6">
                  {/* Office Address */}
                  <div className="flex items-center gap-4 group/item">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl blur-md opacity-50 group-hover/item:opacity-75 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform duration-300">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        Office Address
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {officeLocation.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 group/item">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl blur-md opacity-50 group-hover/item:opacity-75 transition-opacity"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform duration-300">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-xs mb-0.5">
                          Phone
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {officeLocation.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 group/item">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur-md opacity-50 group-hover/item:opacity-75 transition-opacity"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform duration-300">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-xs mb-0.5">
                          Email
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {officeLocation.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours & Social Media Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 group/item">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-md opacity-50 group-hover/item:opacity-75 transition-opacity"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform duration-300">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-xs mb-0.5">
                          Hours
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {officeLocation.hours}
                        </p>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-xs mb-2">
                          Follow Us
                        </h4>
                        <div className="flex items-center gap-2">
                          <Link
                            href="https://www.facebook.com/elitepropexch/"
                            target="_blank"
                            className="group/social relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg blur-md opacity-0 group-hover/social:opacity-75 transition-opacity"></div>
                            <div className="relative w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                              <Facebook className="w-4 h-4 text-white" />
                            </div>
                          </Link>

                          <Link
                            href="https://www.instagram.com/elitepropertyexchange/"
                            target="_blank"
                            className="group/social relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 rounded-lg blur-md opacity-0 group-hover/social:opacity-75 transition-opacity"></div>
                            <div className="relative w-9 h-9 bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                              <Instagram className="w-4 h-4 text-white" />
                            </div>
                          </Link>

                          <Link
                            href="https://www.tiktok.com/@elitepropertiespk"
                            target="_blank"
                            className="group/social relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg blur-md opacity-0 group-hover/social:opacity-75 transition-opacity"></div>
                            <div className="relative w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300">
                              <FaTiktok className="w-4 h-4 text-white" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCallNow}
                className="flex-1 cursor-pointer bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Now
                </div>
              </button>

              <Link
                href="https://wa.me/+923344111778"
                target="_blank"
                className=""
              >
                <button
                  // onClick={handleGetDirections}
                  className="flex-1 cursor-pointer text-white font-semibold py-4 px-8 rounded-xl bg-primary transition-all duration-300 transform hover:scale-101 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src="/icons/whatsapp.png"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                    />
                    WhatsApp
                  </div>
                </button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
              <h4 className="font-semibold text-gray-900 mb-2">
                🏆 Why Visit Us?
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free property consultation</li>
                <li>• Exclusive off-market listings</li>
                <li>• Professional investment advice</li>
                <li>• Complimentary market analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
