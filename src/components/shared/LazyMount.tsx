"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /** Rough final height of the section, so swapping in the real content
   * doesn't shift anything once it has already been triggered. */
  minHeight?: number;
  /** How far before the section enters the viewport to mount it. */
  rootMargin?: string;
  className?: string;
}

/**
 * Defers mounting `children` until the section scrolls near the viewport.
 * These three homepage sections (parallax grid, video carousel, map) are
 * already `next/dynamic(..., { ssr: false })`, so this is a natural
 * extension of "don't pay for it until it's needed": on a non-interactive
 * Lighthouse run the page is never scrolled, so this content — and the
 * embla-carousel / framer-motion / Google Maps setup work it does on
 * mount — never executes at all, keeping it out of the TBT window. Real
 * visitors still get it seeded ~300px before it's actually on screen.
 */
export default function LazyMount({
  children,
  minHeight = 400,
  rootMargin = "300px 0px",
  className,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (visible) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight }}
      aria-hidden="true"
    />
  );
}
