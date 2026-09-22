"use client";

import { useEffect, useState } from "react";
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GallerySlide {
  src: string;
  thumb?: string;
}

interface LightboxModalProps {
  open: boolean;
  close: () => void;
  slides: GallerySlide[];
  index: number;
}

/**
 * Renders the cheap WebP thumbnail immediately, then swaps in the full-size
 * image once it has finished downloading. Avoids the blank/spinner gap on
 * galleries with dozens of photos.
 */
function ProgressiveSlide({ slide }: { slide: GallerySlide }) {
  const { src, thumb } = slide;
  const [loaded, setLoaded] = useState(!thumb);

  useEffect(() => {
    if (!thumb) return;
    setLoaded(false);

    const img = new window.Image();
    img.src = src;
    if (img.decode) {
      img.decode().then(() => setLoaded(true)).catch(() => setLoaded(true));
    } else {
      img.onload = () => setLoaded(true);
      img.onerror = () => setLoaded(true);
    }
  }, [src, thumb]);

  return (
    <img
      src={loaded ? src : thumb}
      alt=""
      draggable={false}
      decoding="async"
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        userSelect: "none",
        // Soften the low-res thumbnail until the full image lands
        filter: loaded ? "none" : "blur(6px)",
        transition: "filter 200ms ease-out",
      }}
    />
  );
}

export default function LightboxModal({
  open,
  close,
  slides,
  index,
}: LightboxModalProps) {
  // Warm the thumbnail cache for the whole gallery once it is opened, so
  // swiping through 40+ photos never hits an empty slide.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const queue = slides.map((s) => s.thumb).filter(Boolean) as string[];

    const prefetchNext = (i: number) => {
      if (cancelled || i >= queue.length) return;
      const img = new window.Image();
      img.onload = img.onerror = () => prefetchNext(i + 1);
      img.src = queue[i];
    };

    const start = window.setTimeout(() => prefetchNext(0), 300);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, [open, slides]);

  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides as unknown as Slide[]}
      index={index}
      carousel={{ finite: false, preload: 2 }}
      controller={{ closeOnBackdropClick: true }}
      render={{
        slide: ({ slide }) => (
          <ProgressiveSlide slide={slide as unknown as GallerySlide} />
        ),
      }}
    />
  );
}
