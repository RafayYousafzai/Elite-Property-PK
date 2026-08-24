"use client";

import type React from "react";

import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category?: string;
  highlightText?: string;
}

interface VideoShowcaseProps {
  videos: VideoItem[];
  className?: string;
}

const YOUTUBE_THUMBNAIL_BASE_URL = "https://i.ytimg.com/vi/";

function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  const id = match && match[2].length === 11 ? match[2] : url;
  if (id.length !== 11) {
    console.warn(`Invalid YouTube ID: ${url}`);
    return "";
  }
  return id;
}

function LiteYouTubePlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) {
    return (
      <div className="relative aspect-video flex items-center justify-center rounded-2xl bg-zinc-900 text-sm text-zinc-200">
        Invalid YouTube video ID
      </div>
    );
  }

  const thumbnailUrl = `${YOUTUBE_THUMBNAIL_BASE_URL}${videoId}/hqdefault.jpg`;

  return (
    <div className="group relative aspect-video overflow-hidden rounded-2xl bg-zinc-900">
      {isPlaying ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      ) : (
        <>
          <Image
            fill
            src={thumbnailUrl}
            alt={title}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label={`Play video ${title}`}
          >
            <span className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-xl ring-1 ring-white/80 transition-all duration-300 group-hover:scale-105">
              <Play className="h-4 w-4" />
              Play video
            </span>
          </button>
        </>
      )}
    </div>
  );
}

export default function VideoShowcase({
  videos,
  className = "",
}: VideoShowcaseProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const videoGroups = useMemo(() => {
    const groups: VideoItem[][] = [];
    if (videos.length === 0) return groups;

    const perSlide = isMobile ? 1 : 3;
    for (let i = 0; i < videos.length; i += perSlide) {
      groups.push(videos.slice(i, i + perSlide));
    }
    return groups;
  }, [videos, isMobile]);

  const totalSlides = videoGroups.length;

  const emblaOptions = useMemo(
    () => ({
      align: "start" as const,
      loop: totalSlides > 1,
      duration: 18,
      slidesToScroll: 1,
    }),
    [totalSlides]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit(emblaOptions);
  }, [emblaApi, emblaOptions]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateStates = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", updateStates);
    emblaApi.on("reInit", updateStates);
    updateStates();

    return () => {
      emblaApi.off("select", updateStates);
      emblaApi.off("reInit", updateStates);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (totalSlides === 0) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((prev) => {
      const nextIndex = Math.min(prev, Math.max(totalSlides - 1, 0));
      if (emblaApi && prev !== nextIndex) {
        emblaApi.scrollTo(nextIndex);
      }
      return nextIndex;
    });
  }, [emblaApi, totalSlides]);

  const scrollPrev = useCallback(() => {
    if (totalSlides <= 1) return;
    emblaApi?.scrollPrev();
  }, [emblaApi, totalSlides]);

  const scrollNext = useCallback(() => {
    if (totalSlides <= 1) return;
    emblaApi?.scrollNext();
  }, [emblaApi, totalSlides]);

  return (
    <div className={`w-full mt-20 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 py-10 lg:py-16 ${className}`}>
      {videos.length === 0 && (
        <div className="text-center text-slate-500">
          No videos available. Please check back soon.
        </div>
      )}

      {videos.length > 0 && (
        <div className="relative space-y-8">
          {/* Videos Carousel Container */}
          <div
            ref={emblaRef}
            className="cursor-grab overflow-hidden active:cursor-grabbing"
          >
            <div className="flex gap-6">
              {videoGroups.map((group, groupIndex) => (
                <div
                  key={`${group[0]?.id ?? "group"}-${groupIndex}`}
                  className="min-w-0 flex-[0_0_100%]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.map((video) => {
                      const youtubeId = extractYouTubeId(video.youtubeId);
                      return (
                        <article
                          key={video.id}
                          className="flex flex-col gap-3 rounded-2xl bg-transparent p-0 border-0 shadow-none transition-all duration-300"
                        >
                          {video.category && (
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                              <span className="rounded-lg bg-primary/10 text-primary border-0 px-3 py-1 uppercase tracking-wider">
                                {video.category}
                              </span>
                              {video.highlightText && (
                                <span className="text-primary font-medium">
                                  {video.highlightText}
                                </span>
                              )}
                            </div>
                          )}

                          <LiteYouTubePlayer
                            videoId={youtubeId}
                            title={video.title}
                          />

                          <div className="space-y-1 mt-1">
                            <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white transition-colors duration-300 hover:text-primary line-clamp-1">
                              {video.title}
                            </h3>
                            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                              {video.description}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Control Bar: Navigation & YouTube CTA on Left, Dots on Right */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Bottom Left Controls & YouTube Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              {totalSlides > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={scrollPrev}
                    className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border-0 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center shadow-none disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                    aria-label="Previous videos"
                    disabled={!canScrollPrev && !emblaOptions.loop}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border-0 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center shadow-none disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                    aria-label="Next videos"
                    disabled={!canScrollNext && !emblaOptions.loop}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              <Link
                href="https://www.youtube.com/@elitepropertypk"
                target="_blank"
                className="group h-11 inline-flex items-center gap-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white px-5 font-semibold text-xs transition-all duration-300 border-0 shadow-none hover:scale-105 shrink-0"
              >
                <span>Visit Our YouTube Channel</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Bottom Dots Indicator */}
            {totalSlides > 1 && (
              <div className="flex items-center gap-2">
                {videoGroups.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      index === selectedIndex
                        ? "w-7 bg-primary"
                        : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
