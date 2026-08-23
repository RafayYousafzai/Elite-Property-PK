"use client";

// app/providers.tsx
import dynamic from "next/dynamic";
import { HeroUIProvider } from "@heroui/react";
import SmoothScrollProvider from "@/components/scrolling/SmoothScrollProvider";
import { Toaster } from "react-hot-toast";

const CustomChatWidget = dynamic(() => import("@/components/ChatWidget").then((mod) => mod.CustomChatWidget), {
  ssr: false,
});

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
