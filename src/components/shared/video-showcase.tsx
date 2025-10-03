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

    const perSlide = isMobile ? 1 : 2;
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
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-14 lg:py-24 ${className}`}>
      <div className="mb-12 lg:mb-20 flex justify-center">
        <Link
          href="https://www.youtube.com/@elitepropertypk"
          target="_blank"
          className="group relative flex items-center gap-3 sm:gap-4 rounded-full border border-zinc-200 bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-red-600 hover:to-red-500 dark:border-red-800 dark:shadow-black/30"
        >
          <span className="text-sm sm:text-base font-medium text-white">
            Visit our YouTube Channel
          </span>

          <span className="h-5 sm:h-6 w-[1px] bg-white/50"></span>

          <div className="relative flex size-7 sm:size-8 items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-500">
            <ArrowRight className="size-3.5 sm:size-4 text-red-600 transition-transform duration-500 group-hover:translate-x-1" />
          </div>

          <span className="absolute inset-0 rounded-full bg-red-400/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></span>
        </Link>
      </div>

      <div className="mx-auto max-w-7xl">
        {videos.length === 0 && (
          <div className="text-center text-gray-600">
            No videos available. Please check the provided video data.
          </div>
        )}

        {videos.length > 0 && (
          <div className="relative">
            {totalSlides > 1 && (
              <>
                <button
                  onClick={scrollPrev}
                  className="absolute left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 p-2 sm:p-3 lg:p-4 text-white shadow-xl transition-all duration-300 hover:scale-[1.08] hover:from-orange-700 hover:to-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Previous videos"
                  disabled={!canScrollPrev && !emblaOptions.loop}
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 p-2 sm:p-3 lg:p-4 text-white shadow-xl transition-all duration-300 hover:scale-[1.08] hover:from-orange-700 hover:to-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Next videos"
                  disabled={!canScrollNext && !emblaOptions.loop}
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                </button>
              </>
            )}

            <div
              ref={emblaRef}
              className="cursor-grab overflow-hidden active:cursor-grabbing"
            >
              <div className="flex gap-6 sm:gap-8 lg:gap-10">
                {videoGroups.map((group, groupIndex) => (
                  <div
                    key={`${group[0]?.id ?? "group"}-${groupIndex}`}
                    className="min-w-0 flex-[0_0_100%]"
                  >
                    <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
                      {group.map((video) => {
                        const youtubeId = extractYouTubeId(video.youtubeId);
                        return (
                          <article
                            key={video.id}
                            className="flex flex-col gap-6 rounded-3xl border border-zinc-100 bg-white/70 p-6 shadow-md shadow-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl lg:p-7"
                          >
                            {video.category && (
                              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                                <span className="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 text-white shadow-md">
                                  {video.category}
                                </span>
                                {video.highlightText && (
                                  <span className="text-orange-600">
                                    {video.highlightText}
                                  </span>
                                )}
                              </div>
                            )}

                            <LiteYouTubePlayer
                              videoId={youtubeId}
                              title={video.title}
                            />

                            <div className="space-y-2">
                              <h3 className="text-xl sm:text-2xl font-bold leading-tight text-zinc-900 transition-colors duration-300 hover:text-orange-600">
                                {video.title}
                              </h3>
                              <p className="text-sm sm:text-base leading-relaxed text-zinc-600">
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

            {totalSlides > 1 && (
              <div className="mt-10 flex justify-center gap-3">
                {videoGroups.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      index === selectedIndex
                        ? "w-8 bg-gradient-to-r from-orange-600 to-red-600"
                        : "bg-zinc-300 hover:bg-zinc-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
