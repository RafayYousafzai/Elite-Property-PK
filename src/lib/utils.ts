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
