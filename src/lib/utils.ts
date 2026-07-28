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

  // Optimize Unsplash images to small 400px thumbnails
  if (url.includes("images.unsplash.com") || url.includes("plus.unsplash.com")) {
    if (url.includes("w=")) {
      url = url.replace(/w=\d+/, "w=400");
    } else {
      url += "&w=400";
    }
    if (url.includes("q=")) {
      url = url.replace(/q=\d+/, "q=70");
    } else {
      url += "&q=70";
    }
  }

  // Optimize Supabase Storage images if render transform is available
  if (url.includes(".supabase.co/storage/v1/object/public/")) {
    if (!url.includes("width=")) {
      url += url.includes("?") ? "&width=400&quality=70" : "?width=400&quality=70";
    }
  }

  return url;
}
