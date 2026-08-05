import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ferratisports.com",
      },
      {
        protocol: "https",
        hostname: "heroui.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "apxliioxqwlepmejxziq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "eqwshdwdmvfqbeuqknkn.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-3261296f3c5c402391d7ed7b63fbdd6e.r2.dev",
      },
    ],
  },
};

export default nextConfig;
