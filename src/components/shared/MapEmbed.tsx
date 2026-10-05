"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const OFFICE_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.7026272595363!2d73.16746392552783!3d33.53511641307411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfed8930128de7%3A0x4b866d1a81e61490!2sElite%20Property%20Exchange!5e0!3m2!1sen!2s!4v1759570688102!5m2!1sen!2s";

// Google's embed pulls in ~250 KB of Maps JavaScript, so it only loads once the
// visitor asks for it instead of competing with the page on first load.
export default function MapEmbed({ className = "" }: { className?: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-sm border border-stone-200 bg-[#f3efe6] ${className}`}>
      {show ? (
        <iframe
          src={OFFICE_MAP}
          title="Elite Property Exchange office on Google Maps"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.18),transparent_60%)] text-center"
          aria-label="Show office location on Google Maps"
        >
          {/* Subtle street-grid texture so the placeholder reads as a map */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(154,122,30,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(154,122,30,0.12)_1px,transparent_1px)] [background-size:44px_44px]"
          />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#9a7a1e] shadow-lg shadow-stone-900/10 transition-transform group-hover:scale-105">
            <MapPin size={24} strokeWidth={1.5} />
          </span>
          <span className="relative">
            <span className="block font-[family-name:var(--font-display)] text-2xl font-medium text-[#1a1714]">
              DHA Phase II, Islamabad
            </span>
            <span className="mt-2 inline-block rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#1a1714] transition-colors group-hover:border-[#9a7a1e] group-hover:text-[#9a7a1e]">
              Show map
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
