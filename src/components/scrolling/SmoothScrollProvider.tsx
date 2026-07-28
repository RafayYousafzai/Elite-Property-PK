"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Initialize Lenis with lightweight, hardware-accelerated lerp settings
    const lenis = new Lenis({
      lerp: 0.1, // Smooth linear interpolation (much lighter on CPU/GPU than long durations)
      smoothWheel: true,
      wheelMultiplier: 1.0, // Match native mouse speed to prevent tracking lag
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (rafId) {
        cancelAnimationFrame(rafId); // Stop animation loop to prevent memory/CPU leaks on page transitions
      }
    };
  }, []);

  return <>{children}</>;
}
