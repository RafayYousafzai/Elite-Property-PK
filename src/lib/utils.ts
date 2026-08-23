import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLocation(loc: string | null | undefined): string {
  if (!loc) return "";
  let formatted = loc;
  const phaseRegex = /(?<!dha\s+)phase\s+(\d+)/i;
  formatted = formatted.replace(phaseRegex, "DHA Phase $1");
  return formatted;
}

export function getImageUrl(
  image: any,
  fallback = "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=70&w=400&auto=format&fit=crop"
): string {
  if (!image) return fallback;

  let url = "";
  if (typeof image === "string") {
    url = image;
  } else if (typeof image === "object" && image !== null) {
    url = image.src || image.url || image.path || image.secure_url || "";
  }

  if (!url || typeof url !== "string" || url.trim() === "") return fallback;

  // Upgrade HTTP to HTTPS
  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  return url;
}
