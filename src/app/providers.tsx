"use client";

// app/providers.tsx
import { HeroUIProvider } from "@heroui/react";
import SmoothScrollProvider from "@/components/scrolling/SmoothScrollProvider";
import { CustomChatWidget } from "@/components/ChatWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroUIProvider>
        <CustomChatWidget />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </HeroUIProvider>
    </>
  );
}
