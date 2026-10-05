import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: [
      "@heroui/react",
      "lucide-react",
      "framer-motion",
      "@iconify/react",
      "@heroicons/react",
      "react-icons",
    ],
  },
  // Serve R2 listing photos from the site's own domain (plain pass-through, no
  // image transformations). Visitors whose ISP struggles with the storage
  // domain can still load photos, since they only ever talk to this site.
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: "https://elitepropertyimages.rafaykhan.website/:path*",
      },
    ];
  },
  // Listing photos never change once uploaded (new uploads get new names),
  // so let browsers and the CDN cache the proxied copies for a year.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "CDN-Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Keep optimized copies cached for a month so remote images (team photos,
    // chat avatar) are only transformed once, staying well inside free quotas.
    minimumCacheTTL: 2678400,
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
