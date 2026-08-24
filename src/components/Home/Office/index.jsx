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

const TiktokIcon = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3v88.4a74.6 74.6 0 1 0 52.2 71.2V0h88.1a121.2 121.2 0 0 0 1.9 22.2h.1a122.2 122.2 0 0 0 54.1 80.9 121.7 121.7 0 0 0 66.6 19.9z" />
  </svg>
);

const LocationMap = () => {
  const officeLocation = {
    lat: 33.535113,
    lng: 73.170038,
    address:
      "2nd Floor, Plaza no 19, Tipu Boulevard, Sector G DHA Phase II, Islamabad",
    phone: "+923344111778",
    email: "pk.eliteproperty@gmail.com",
    hours: "Mon - Sun: 9:00 AM - 7:00 PM",
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${officeLocation.lat},${officeLocation.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleCallNow = () => {
    window.open(`tel:${officeLocation.phone}`, "_self");
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-none">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Our Office</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Find Us in the Heart of{" "}
            <span className="text-primary">
              Islamabad
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mt-3 font-normal">
            Visit our premium office location for personalized consultations and
            exclusive property viewings
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Map Container (7 Columns) */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-md flex flex-col shadow-none">
            <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-100 dark:bg-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.7026272595363!2d73.16746392552783!3d33.53511641307411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfed8930128de7%3A0x4b866d1a81e61490!2sElite%20Property%20Exchange!5e0!3m2!1sen!2s!4v1759570688102!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Map Footer Bar */}
            <div className="p-5 bg-slate-50/90 dark:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Elite Property Exchange
                </h4>
                <p className="text-xs text-primary font-medium flex items-center gap-1 mt-0.5">
                  <span>DHA Phase II • Islamabad</span>
                </p>
              </div>
              <button
                onClick={handleGetDirections}
                className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-none"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>

          {/* Contact Details Card (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6 shadow-none">
            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="text-primary shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Office Address
                </h4>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {officeLocation.address}
                </p>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 ">
              <div className="flex items-start gap-3">
                <div className="text-primary shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Phone
                  </h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    {officeLocation.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-primary shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Email
                  </h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate max-w-[140px]">
                    {officeLocation.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours & Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 ">
              <div className="flex items-start gap-3">
                <div className="text-primary shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    Working Hours
                  </h4>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    {officeLocation.hours}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Follow Us
                </h4>
                <div className="flex items-center gap-2">
                  <Link
                    href="https://www.facebook.com/elitepropexch/"
                    target="_blank"
                    className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-none"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/elitepropertyexchange/"
                    target="_blank"
                    className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-none"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://www.tiktok.com/@elitepropertiespk"
                    target="_blank"
                    className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-none"
                    aria-label="TikTok"
                  >
                    <TiktokIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Buttons (Matching Height h-12) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCallNow}
                className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-5 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-none"
              >
                <Phone className="w-4.5 h-4.5" />
                <span>Call Now</span>
              </button>

              <Link
                href="https://wa.me/+923344111778"
                target="_blank"
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-none"
              >
                <Image
                  src="/icons/whatsapp.png"
                  alt="WhatsApp"
                  width={18}
                  height={18}
                  className="brightness-200"
                />
                <span>WhatsApp</span>
              </Link>
            </div>

            {/* Why Visit Us Highlight Box */}
            <div className="bg-primary/5 dark:bg-white/5 rounded-xl p-4 shadow-none">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2 text-primary">
                Why Visit Our Office?
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Free Consultation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Off-Market Listings
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Investment Advice
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Market Analysis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
