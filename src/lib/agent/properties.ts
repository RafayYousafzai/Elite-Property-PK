/**
 * Catalog lookup used by the chat agent's `suggestProperties` tool.
 *
 * The listing table is small (<200 rows) and the location fields are free text
 * ("Phase 5", "dha phase 4 islamabd "), so we pull a slim projection once,
 * cache it, and match in memory instead of fighting PostgREST with ilike
 * permutations.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATALOG_TTL = 10 * 60 * 1000; // 10 minutes

type CatalogRow = {
  name: string;
  slug: string;
  rate: number | string | null;
  area: number | null;
  area_unit: string | null;
  beds: number | null;
  baths: number | null;
  property_category: string | null;
  property_type: string | null;
  location: string | null;
  phase: string | null;
  city: string | null;
  is_sold: boolean | null;
  is_featured: boolean | null;
  image_paths: string[] | null;
  images: unknown[] | null;
};

export type PropertySuggestion = {
  name: string;
  price: string;
  location: string;
  size: string;
  beds?: number;
  baths?: number;
  url: string;
  /** R2 object path; the widget expands it to a thumbnail URL */
  img?: string;
};

let cache: { rows: CatalogRow[]; at: number } | null = null;

const SELECT =
  "name,slug,rate,area,area_unit,beds,baths,property_category,property_type,location,phase,city,is_sold,is_featured,image_paths,images";

async function getCatalog(): Promise<CatalogRow[]> {
  if (cache && Date.now() - cache.at < CATALOG_TTL) return cache.rows;
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  const base = SUPABASE_URL.endsWith("/") ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
  const res = await fetch(
    `${base}/rest/v1/properties?select=${SELECT}&is_sold=not.eq.true&limit=300`,
    {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    },
  );

  if (!res.ok) {
    console.error("Property catalog fetch failed:", await res.text());
    return cache?.rows ?? [];
  }

  const rows = (await res.json()) as CatalogRow[];
  cache = { rows, at: Date.now() };
  return rows;
}

/** "dha phase 4 islamabd " -> 4 */
function phaseOf(row: CatalogRow): number | null {
  const haystack = `${row.phase ?? ""} ${row.location ?? ""}`.toLowerCase();
  const match = haystack.match(/pha?se?\s*([1-9])/);
  return match ? Number(match[1]) : null;
}

function isPlot(row: CatalogRow): boolean {
  const text = `${row.property_category ?? ""} ${row.property_type ?? ""}`.toLowerCase();
  return text.includes("plot");
}

/** 27500000 -> "PKR 2.75 crore" */
function formatPrice(value: number): string {
  if (!value) return "Price on request";
  if (value >= 10_000_000) {
    const crore = value / 10_000_000;
    return `PKR ${Number(crore.toFixed(2))} crore`;
  }
  return `PKR ${Number((value / 100_000).toFixed(1))} lac`;
}

function firstImagePath(row: CatalogRow): string | undefined {
  const raw = row.image_paths?.[0] ?? (row.images?.[0] as string | { src?: string } | undefined);
  const value = typeof raw === "string" ? raw : raw?.src;
  if (!value) return undefined;
  return value.trim().replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "");
}

export type SuggestionFilters = {
  category?: "house" | "plot" | "any";
  minBudget?: number;
  maxBudget?: number;
  phase?: number;
  minBeds?: number;
};

export type SuggestionResult = {
  matches: PropertySuggestion[];
  /** true when filters had to be loosened to find anything */
  relaxed: boolean;
  total: number;
};

function toSuggestion(row: CatalogRow): PropertySuggestion {
  const rate = Number(row.rate) || 0;
  const phase = phaseOf(row);
  return {
    name: row.name,
    price: formatPrice(rate),
    location: phase ? `DHA Phase ${phase}` : row.location?.trim() || row.city || "Islamabad",
    size: row.area ? `${row.area} ${row.area_unit || "Marla"}` : "—",
    ...(row.beds ? { beds: row.beds } : null),
    ...(row.baths ? { baths: row.baths } : null),
    url: `/explore/${row.slug}`,
    ...(firstImagePath(row) ? { img: firstImagePath(row) } : null),
  };
}

export async function findProperties(
  filters: SuggestionFilters,
  limit = 3,
): Promise<SuggestionResult> {
  const rows = (await getCatalog()).filter((r) => !r.is_sold);
  if (rows.length === 0) return { matches: [], relaxed: false, total: 0 };

  const { category = "any", minBudget, maxBudget, phase, minBeds } = filters;

  const matchesCategory = (r: CatalogRow) =>
    category === "any" || (category === "plot" ? isPlot(r) : !isPlot(r));
  const matchesBeds = (r: CatalogRow) => !minBeds || (r.beds ?? 0) >= minBeds;
  const matchesPhase = (r: CatalogRow) => !phase || phaseOf(r) === phase;
  const inBudget = (r: CatalogRow, slack = 0) => {
    const rate = Number(r.rate) || 0;
    if (minBudget && rate < minBudget * (1 - slack)) return false;
    if (maxBudget && rate > maxBudget * (1 + slack)) return false;
    return true;
  };

  // Progressively loosen: exact -> ignore phase -> 25% budget slack -> category only
  const passes: Array<(r: CatalogRow) => boolean> = [
    (r) => matchesCategory(r) && matchesBeds(r) && matchesPhase(r) && inBudget(r),
    (r) => matchesCategory(r) && matchesBeds(r) && inBudget(r),
    (r) => matchesCategory(r) && inBudget(r, 0.25),
    (r) => matchesCategory(r),
  ];

  let selected: CatalogRow[] = [];
  let relaxedAt = 0;
  for (let i = 0; i < passes.length; i++) {
    selected = rows.filter(passes[i]);
    relaxedAt = i;
    if (selected.length > 0) break;
  }

  if (selected.length === 0) return { matches: [], relaxed: true, total: 0 };

  // Closest to the middle of the stated budget first, featured listings break ties
  const target =
    minBudget && maxBudget
      ? (minBudget + maxBudget) / 2
      : maxBudget ?? minBudget ?? null;

  const ranked = [...selected].sort((a, b) => {
    if (target) {
      const da = Math.abs((Number(a.rate) || 0) - target);
      const db = Math.abs((Number(b.rate) || 0) - target);
      if (da !== db) return da - db;
    }
    return Number(b.is_featured) - Number(a.is_featured);
  });

  return {
    matches: ranked.slice(0, limit).map(toSuggestion),
    relaxed: relaxedAt > 0,
    total: selected.length,
  };
}
