"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string; // can be ID or full YouTube URL
  category?: string;
  highlightText?: string; // optional extra text for category labels
}

interface VideoShowcaseProps {
  videos: VideoItem[];
  className?: string;
}

// Helper: extract YouTube ID from common formats
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

export default function VideoShowcase({
  videos,
  className = "",
}: VideoShowcaseProps) {
  return (
    <div
      className={`container max-w-8xl mx-auto px-5 2xl:px-0 mt-24 ${className}`}
    >
      <div className="my-20 flex justify-center">
        <Link
          href="https://www.youtube.com/@elitepropertypk"
          target="_blank"
          className="group relative flex items-center gap-4 rounded-full border border-zinc-200 bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:from-red-600 hover:to-red-500 dark:border-red-800 dark:shadow-black/30"
        >
          <span className="text-base font-medium text-white">
            Visit our YouTube Channel
          </span>

          {/* Divider */}
          <span className="h-6 w-[1px] bg-white/50"></span>

          {/* Icon wrapper */}
          <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-500 group-hover:rotate-360">
            <ArrowRight className="size-4 text-red-600 transition-transform duration-500 group-hover:translate-x-1" />
          </div>

          {/* Glow effect on hover */}
          <span className="absolute inset-0 rounded-full bg-red-400/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></span>
        </Link>
      </div>

      <div className="mx-auto">
        {/* Empty fallback */}
        {videos.length === 0 && (
          <div className="text-center text-gray-600">
            No videos available. Please check the provided video data.
          </div>
        )}

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {videos.map((video, index) => {
            const youtubeId = extractYouTubeId(video.youtubeId);
            return (
              <div
                key={video.id}
                className="space-y-6 transform transition-all duration-500 hover:-translate-y-2"
              >
                {/* Category Label (above each video if category exists) */}
                {video.category && (
                  <div className="flex flex-row items-center gap-2 mb-4 animate-fade-in">
                    <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                      {video.category}
                    </span>
                    {video.highlightText && (
                      <span className="text-orange-600 font-extrabold text-base">
                        {video.highlightText}
                      </span>
                    )}
                  </div>
                )}

                {/* YouTube Video */}
                <div className="relative group rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  {youtubeId ? (
                    <div className="relative aspect-video bg-black">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                        src={`https://www.youtube.com/embed/${youtubeId}?controls=1&modestbranding=1&rel=0&showinfo=0&disablekb=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        frameBorder="0"
                        title={video.title}
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-gray-800 flex items-center justify-center rounded-xl">
                      <p className="text-white text-sm">
                        Invalid YouTube video ID
                      </p>
                    </div>
                  )}

                  {/* Hover Gradient Glow */}
                  <div className="absolute -inset-px bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>

                {/* Title + Description */}
                <div className="text-left lg:text-left space-y-2 animate-fade-in delay-200">
                  <h3 className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {video.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
