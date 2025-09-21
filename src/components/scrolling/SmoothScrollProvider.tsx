"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0, // longer glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Lenis default
      smoothWheel: true,
      wheelMultiplier: 1.1, // keep scroll speed close to native
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
