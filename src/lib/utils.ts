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

export const PROPERTY_IMAGE_DOMAIN = "https://elitepropertyimages.rafaykhan.website/";

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

  // Prepend domain if relative path
  if (!url.startsWith("https://") && !url.startsWith("data:")) {
    const domain = PROPERTY_IMAGE_DOMAIN.endsWith("/")
      ? PROPERTY_IMAGE_DOMAIN
      : PROPERTY_IMAGE_DOMAIN + "/";
    const cleanPath = url.startsWith("/") ? url.slice(1) : url;
    url = domain + cleanPath;
  }

  return url;
}

export function extractImagePath(urlOrPath: string): string {
  if (!urlOrPath || typeof urlOrPath !== "string") return "";
  let clean = urlOrPath.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    clean = clean.replace(/^https?:\/\/[^\/]+\//, "");
  }
  if (clean.startsWith("/")) {
    clean = clean.slice(1);
  }
  return clean;
}

export function getThumbnailUrl(
  image: any,
  fallback = "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=70&w=400&auto=format&fit=crop"
): string {
  if (!image) return fallback;

  const rawPath = extractImagePath(typeof image === "string" ? image : image?.src || image?.url || image?.path || "");
  if (!rawPath) {
    return getImageUrl(image, fallback);
  }

  // External non-R2 URLs or data URLs fallback to standard getImageUrl
  if (
    typeof image === "string" &&
    (image.startsWith("data:") ||
      (image.startsWith("http") && !image.includes("rafaykhan.website") && !image.includes(".r2.dev")))
  ) {
    return getImageUrl(image, fallback);
  }

  // Map "properties/abc.jpg" -> "thumbnails/properties/abc.webp"
  let thumbPath = rawPath;
  if (!thumbPath.startsWith("thumbnails/")) {
    thumbPath = `thumbnails/${thumbPath}`;
  }
  thumbPath = thumbPath.replace(/\.[^.]+$/, ".webp");

  const domain = PROPERTY_IMAGE_DOMAIN.endsWith("/")
    ? PROPERTY_IMAGE_DOMAIN
    : PROPERTY_IMAGE_DOMAIN + "/";

  return `${domain}${thumbPath}`;
}
