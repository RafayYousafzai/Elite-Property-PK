import type { Property } from "@/types/property";
import formatNumberShort from "@/lib/formatNumberShort";

// Shared helpers for classifying listings by kind, DHA phase and size. The
// underlying fields are free text ("dha phase 4 islamabd ", "Sq Yd"), so all
// matching is normalised here once.

export type ListingKind = "house" | "plot" | "apartment" | "commercial";

const norm = (s: string | null | undefined) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

export function kindOf(p: Pick<Property, "property_type" | "property_category">): ListingKind {
  const t = norm(p.property_type);
  const c = norm(p.property_category);
  if (t.includes("commercial") || /office|shop|warehouse|factory|building/.test(t) || c.includes("commercial"))
    return "commercial";
  if (t.includes("plot") || t.includes("land") || t.includes("file") || c.includes("plot")) return "plot";
  if (/flat|apart|appart|penthouse/.test(t)) return "apartment";
  return "house";
}

/** "dha phase 4 islamabd " -> 4 */
export function phaseOf(p: Pick<Property, "phase" | "location" | "name">): number | null {
  const match = `${p.phase ?? ""} ${p.location ?? ""} ${p.name}`.toLowerCase().match(/pha?se?\s*-?\s*([1-9])\b/);
  return match ? Number(match[1]) : null;
}

/** Size normalised to marla (DHA convention: 1 kanal = 20 marla = 500 sq yd). */
export function sizeInMarla(p: Pick<Property, "area" | "area_unit">): number | null {
  const area = Number(p.area);
  if (!area) return null;
  const unit = norm(p.area_unit);
  if (unit.includes("kanal")) return area * 20;
  if (unit.includes("yd") || unit.includes("yard")) return (area * 9) / 225;
  if (unit.includes("ft") || unit.includes("feet")) return area / 225;
  return area;
}

/** 20 -> "1 Kanal", 10 -> "10 Marla" */
export function sizeLabel(marla: number): string {
  if (marla >= 20 && marla % 10 === 0) {
    const kanal = marla / 20;
    return `${Number.isInteger(kanal) ? kanal : kanal.toFixed(1)} Kanal`;
  }
  return `${Math.round(marla)} Marla`;
}

export const formatPrice = (rate: string | number | null | undefined) =>
  formatNumberShort(Number(rate) || 0).replace("Rs", "PKR");

export const KIND_COPY: Record<ListingKind, { slug: string; plural: string; title: string }> = {
  house: { slug: "houses-for-sale", plural: "houses", title: "Houses" },
  plot: { slug: "plots-for-sale", plural: "plots", title: "Plots" },
  apartment: { slug: "apartments-for-sale", plural: "apartments", title: "Apartments" },
  commercial: { slug: "commercial-property-for-sale", plural: "commercial properties", title: "Commercial Property" },
};

// Common search sizes people actually type ("10 marla plot", "1 kanal house")
export const POPULAR_SIZES = [5, 8, 10, 20, 40];
export const sizeSlug = (marla: number) => sizeLabel(marla).toLowerCase().replace(/\s+/g, "-");
