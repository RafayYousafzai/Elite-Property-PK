"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, Navigation, Icon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const LocationMap = () => {
  const officeLocation = {
    lat: 33.7294, // Example coordinates for Islamabad
    lng: 73.0931,
    address: "Office 123, Commercial Market, DHA Phase 2, Islamabad",
    phone: "+92 321 1234567",
    email: "info@homely.com",
    hours: "Mon - Sat: 9:00 AM - 8:00 PM",
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
                      Homely Real Estate
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
            <div className="bg-slate-50 rounded-2xl p-8  ">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Office Address
                    </h4>
                    <p className="text-gray-600">{officeLocation.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Phone Number
                    </h4>
                    <p className="text-gray-600">{officeLocation.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Email Address
                    </h4>
                    <p className="text-gray-600">{officeLocation.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Office Hours
                    </h4>
                    <p className="text-gray-600">{officeLocation.hours}</p>
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
                href="https://wa.me/923211234567"
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
