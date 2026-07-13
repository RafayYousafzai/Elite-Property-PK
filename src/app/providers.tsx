"use client";

// app/providers.tsx
import { HeroUIProvider } from "@heroui/react";
import SmoothScrollProvider from "@/components/scrolling/SmoothScrollProvider";
import { CustomChatWidget } from "@/components/ChatWidget";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroUIProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <CustomChatWidget />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </HeroUIProvider>
    </>
  );
}
