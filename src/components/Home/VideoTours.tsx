"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

const tours = [
  {
    id: "mTwsTzWOzA8",
    title: "Casa Prisma",
    subtitle: "Modern design meets timeless elegance",
  },
  {
    id: "mmrFAQyZUbU",
    title: "Villa Arista",
    subtitle: "1 Kanal designer house · DHA Phase 2",
  },
  {
    id: "WLnZEtiRZO0",
    title: "Villa Novella",
    subtitle: "2 Kanal Italian-inspired residence",
  },
  {
    id: "DfdVx44EClk",
    title: "Straight Line House",
    subtitle: "Ultra-modern 1 Kanal · DHA Phase 2",
  },
  {
    id: "qlL4TzZD3wU",
    title: "The Prestige Manor",
    subtitle: "1 Kanal elite luxury · DHA Phase 2",
  },
  {
    id: "kSyNG7QE93M",
    title: "The Grand Haven",
    subtitle: "1 Kanal luxury residence · DHA Phase 2",
  },
];

const thumb = (id: string, size: "maxresdefault" | "hqdefault") =>
  `https://i.ytimg.com/vi/${id}/${size}.jpg`;

// YouTube is only loaded after the visitor presses play, keeping the page light.
export default function VideoTours() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tour = tours[active];

  return (
    <section className="!py-14 md:!py-20">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Video Tours
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Step inside, <em className="text-[#9a7a1e]">from anywhere</em>
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@elitepropertypk"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#9a7a1e]"
          >
            Our YouTube channel
            <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-sm bg-stone-900">
          {playing ? (
            <iframe
              key={tour.id}
              src={`https://www.youtube-nocookie.com/embed/${tour.id}?autoplay=1&rel=0`}
              title={tour.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full cursor-pointer"
              aria-label={`Play ${tour.title} tour`}
            >
              <img
                src={thumb(tour.id, "maxresdefault")}
                alt={`${tour.title} video tour, ${tour.subtitle}`}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = thumb(tour.id, "hqdefault");
                }}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a1714] shadow-2xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20 md:h-24 md:w-24">
                <Play size={28} className="ml-1 fill-current" />
              </span>
              <span className="absolute bottom-0 left-0 p-4 text-left sm:p-6 md:p-10">
                <span className="block font-[family-name:var(--font-display)] text-xl font-medium text-white sm:text-3xl md:text-5xl">
                  {tour.title}
                </span>
                <span className="mt-2 hidden text-xs uppercase tracking-[0.2em] text-white/75 sm:block md:text-sm">
                  {tour.subtitle}
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
          {tours.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActive(i);
                setPlaying(false);
              }}
              aria-label={`Show ${t.title}`}
              aria-pressed={i === active}
              className="group cursor-pointer text-left"
            >
              <span
                className={`relative block aspect-video overflow-hidden rounded-sm bg-stone-200 ring-offset-2 ring-offset-[#faf8f3] transition ${
                  i === active ? "ring-2 ring-[#9a7a1e]" : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={thumb(t.id, "hqdefault")}
                  alt={`${t.title} video tour`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="mt-2 hidden truncate text-xs font-medium md:block">{t.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
