"use client";

import { getImageUrl, getThumbnailUrl, toSameOrigin } from "@/lib/utils";

// Listing photo using the two versions already in R2 (small WebP thumbnail and
// the original), served from this site's domain via the /media rewrite. `full`
// shows the original on larger screens and the thumbnail on phones. Falls back
// to R2 directly, then to the original, if a request fails.
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
  const thumb = getThumbnailUrl(image);
  const original = getImageUrl(image);
  const fallbacks = [thumb, original];

  const retry = (img: HTMLImageElement) => {
    const attempt = Number(img.dataset.attempt || 0);
    if (attempt >= fallbacks.length) return;
    img.dataset.attempt = String(attempt + 1);
    img.parentElement?.querySelectorAll("source").forEach((source) => source.remove());
    img.src = fallbacks[attempt];
  };

  const img = (
    <img
      src={toSameOrigin(thumb)}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      ref={(el) => {
        // Server-rendered images can fail before React attaches onError
        if (el && el.complete && el.naturalWidth === 0) retry(el);
      }}
      onError={(e) => retry(e.currentTarget)}
      className={className}
    />
  );

  if (!full) return img;

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={toSameOrigin(original)} />
      {img}
    </picture>
  );
}
