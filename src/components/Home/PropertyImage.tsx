"use client";

import { getImageUrl, getThumbnailUrl } from "@/lib/utils";

// Listing photo that prefers the lightweight thumbnail and falls back to the
// full-size original if no thumbnail has been generated yet.
export default function PropertyImage({
  image,
  alt,
  full = false,
  priority = false,
  className = "",
}: {
  image: unknown;
  alt: string;
  full?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const original = getImageUrl(image);
  const src = full ? original : getThumbnailUrl(image);

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onError={(e) => {
        if (e.currentTarget.src !== original) e.currentTarget.src = original;
      }}
      className={className}
    />
  );
}
