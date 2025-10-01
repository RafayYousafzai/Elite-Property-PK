"use client";

// app/providers.tsx

import { HeroUIProvider } from "@heroui/react";
import "./globals.css";
import SmoothScrollProvider from "@/components/scrolling/SmoothScrollProvider";
import { CustomChatWidget } from "@/components/ChatWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <SmoothScrollProvider>
        <CustomChatWidget />
        {children}
      </SmoothScrollProvider>
    </HeroUIProvider>
  );
}
