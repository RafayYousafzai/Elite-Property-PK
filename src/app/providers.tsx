"use client";

// app/providers.tsx

import { HeroUIProvider } from "@heroui/react";
import "./globals.css";
import SmoothScrollProvider from "@/components/scrolling/SmoothScrollProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </HeroUIProvider>
  );
}
