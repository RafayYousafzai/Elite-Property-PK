"use client";

// app/providers.tsx

import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
