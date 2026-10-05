/**
 * Listing catalog used by the chat assistant.
 *
 * The table is small (<300 rows) and the location fields are free text
 * ("Phase 5", "dha phase 4 islamabd "), so we pull one projection, cache it in
 * memory, and match in code rather than fighting PostgREST with ilike chains.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CATALOG_TTL = 5 * 60 * 1000;

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
  purpose: string | null;
  location: string | null;
  phase: string | null;
  sector: string | null;
  city: string | null;
  is_sold: boolean | null;
  is_featured: boolean | null;
  image_paths: string[] | null;
  images: unknown[] | null;
  description: string | null;
  features: Record<string, unknown> | null;
  constructed_covered_area: number | null;
  installment_available: boolean | null;
  advance_amount: number | null;
  no_of_installments: number | null;
  monthly_installments: number | null;
  video_url: string | null;
  created_at: string | null;
};

export type ListingKind = "house" | "apartment" | "plot" | "commercial";

export type ListingCard = {
  name: string;
  price: string;
  location: string;
  size: string;
  beds?: number;
  baths?: number;
  url: string;
  /** R2 object path; the widget turns it into a same-origin thumbnail URL */
  img?: string;
  sold?: boolean;
};

let cache: { rows: CatalogRow[]; at: number } | null = null;

const SELECT = [
  "name,slug,rate,area,area_unit,beds,baths,property_category,property_type,purpose",
  "location,phase,sector,city,is_sold,is_featured,image_paths,images,description,features",
  "constructed_covered_area,installment_available,advance_amount,no_of_installments",
  "monthly_installments,video_url,created_at",
].join(",");

async function getCatalog(): Promise<CatalogRow[]> {
  if (cache && Date.now() - cache.at < CATALOG_TTL) return cache.rows;
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  const base = SUPABASE_URL.replace(/\/$/, "");
  try {
    const res = await fetch(
      `${base}/rest/v1/properties?select=${SELECT}&order=created_at.desc&limit=500`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!res.ok) throw new Error(await res.text());
    const rows = (await res.json()) as CatalogRow[];
    cache = { rows, at: Date.now() };
    return rows;
  } catch (err) {
    console.error("Property catalog fetch failed:", err);
    return cache?.rows ?? [];
  }
}

// ---------------------------------------------------------------- helpers

const norm = (s: string | null | undefined) =>
  (s || "").toLowerCase().replace(/\s+/g, " ").trim();

/** "dha phase 4 islamabd " -> 4 */
function phaseOf(row: CatalogRow): number | null {
  const match = `${row.phase ?? ""} ${row.location ?? ""} ${row.name}`
    .toLowerCase()
    .match(/pha?se?\s*-?\s*([1-9])\b/);
  return match ? Number(match[1]) : null;
}

export function kindOf(row: Pick<CatalogRow, "property_type" | "property_category">): ListingKind {
  const t = norm(row.property_type);
  const c = norm(row.property_category);
  if (t.includes("commercial") || /office|shop|warehouse|factory|building/.test(t) || c.includes("commercial"))
    return "commercial";
  if (t.includes("plot") || t.includes("land") || t.includes("file") || c.includes("plot")) return "plot";
  if (/flat|apart|appart|penthouse/.test(t)) return "apartment";
  return "house";
}

/** Plot/house size normalised to marla (DHA marla = 225 sq ft). */
function sizeInMarla(row: CatalogRow): number | null {
  const area = Number(row.area);
  if (!area) return null;
  const unit = norm(row.area_unit);
  if (unit.includes("kanal")) return area * 20;
  if (unit.includes("yd") || unit.includes("yard")) return (area * 9) / 225;
  if (unit.includes("ft") || unit.includes("feet")) return area / 225;
  return area; // marla (default unit in the admin form)
}

const priceOf = (row: CatalogRow) => Number(row.rate) || 0;

/** 27500000 -> "PKR 2.75 crore" */
export function formatPrice(value: number): string {
  if (!value) return "Price on request";
  if (value >= 10_000_000) return `PKR ${Number((value / 10_000_000).toFixed(2))} crore`;
  return `PKR ${Number((value / 100_000).toFixed(1))} lac`;
}

function formatSize(row: CatalogRow): string {
  if (!row.area) return "—";
  return `${row.area} ${row.area_unit || "Marla"}`;
}

function locationOf(row: CatalogRow): string {
  const phase = phaseOf(row);
  if (phase) return `DHA Phase ${phase}${row.sector ? `, Sector ${row.sector}` : ""}`;
  return row.location?.trim() || row.city || "Islamabad";
}

function firstImagePath(row: CatalogRow): string | undefined {
  const raw = row.image_paths?.[0] ?? (row.images?.[0] as string | { src?: string } | undefined);
  const value = typeof raw === "string" ? raw : raw?.src;
  if (!value) return undefined;
  return value.trim().replace(/^https?:\/\/[^/]+\//, "").replace(/^\//, "");
}

function toCard(row: CatalogRow): ListingCard {
  const img = firstImagePath(row);
  return {
    name: row.name.trim(),
    price: formatPrice(priceOf(row)),
    location: locationOf(row),
    size: formatSize(row),
    ...(row.beds ? { beds: row.beds } : null),
    ...(row.baths ? { baths: row.baths } : null),
    url: `/explore/${row.slug}`,
    ...(img ? { img } : null),
    ...(row.is_sold ? { sold: true } : null),
  };
}

// ---------------------------------------------------------------- search

export type SearchFilters = {
  kind?: ListingKind | "any";
  phase?: number;
  minPrice?: number;
  maxPrice?: number;
  minSizeMarla?: number;
  maxSizeMarla?: number;
  minBeds?: number;
  keywords?: string;
  sort?: "best" | "price_low" | "price_high" | "newest";
};

export type SearchResult = {
  matches: ListingCard[];
  /** listings matching every filter */
  exactCount: number;
  /** filters dropped to find these results (empty when exact) */
  relaxed: string[];
};

export async function searchListings(filters: SearchFilters, limit = 4): Promise<SearchResult> {
  const rows = (await getCatalog()).filter((r) => !r.is_sold);
  const { kind = "any", phase, minPrice, maxPrice, minSizeMarla, maxSizeMarla, minBeds, keywords, sort = "best" } =
    filters;

  const words = norm(keywords)
    .split(" ")
    .filter((w) => w.length > 2);

  const checks = {
    kind: (r: CatalogRow) => kind === "any" || kindOf(r) === kind,
    phase: (r: CatalogRow) => !phase || phaseOf(r) === phase,
    price: (r: CatalogRow, slack = 0) => {
      const p = priceOf(r);
      if (minPrice && p < minPrice * (1 - slack)) return false;
      if (maxPrice && p > maxPrice * (1 + slack)) return false;
      return true;
    },
    // Exact sizes are how people search ("10 marla"), so allow a small band
    size: (r: CatalogRow, slack = 0.05) => {
      if (!minSizeMarla && !maxSizeMarla) return true;
      const s = sizeInMarla(r);
      if (s == null) return false;
      if (minSizeMarla && s < minSizeMarla * (1 - slack)) return false;
      if (maxSizeMarla && s > maxSizeMarla * (1 + slack)) return false;
      return true;
    },
    beds: (r: CatalogRow) => !minBeds || (r.beds ?? 0) >= minBeds,
    keywords: (r: CatalogRow) => {
      if (words.length === 0) return true;
      const text = norm(`${r.name} ${r.description ?? ""} ${Object.keys(r.features ?? {}).join(" ")}`);
      return words.every((w) => text.includes(w));
    },
  };

  // Loosen gradually and record what was dropped so the assistant can be honest about it
  const passes: Array<{ dropped: string[]; test: (r: CatalogRow) => boolean }> = [
    {
      dropped: [],
      test: (r) =>
        checks.kind(r) && checks.phase(r) && checks.price(r) && checks.size(r) && checks.beds(r) && checks.keywords(r),
    },
    {
      dropped: ["keywords"],
      test: (r) => checks.kind(r) && checks.phase(r) && checks.price(r) && checks.size(r) && checks.beds(r),
    },
    {
      dropped: ["keywords", "budget (allowed ±20%)"],
      test: (r) => checks.kind(r) && checks.phase(r) && checks.price(r, 0.2) && checks.size(r) && checks.beds(r),
    },
    {
      dropped: ["keywords", "phase"],
      test: (r) => checks.kind(r) && checks.price(r) && checks.size(r) && checks.beds(r),
    },
    {
      dropped: ["keywords", "size", "bedrooms"],
      test: (r) => checks.kind(r) && checks.phase(r) && checks.price(r, 0.2),
    },
    { dropped: ["keywords", "phase", "budget", "size", "bedrooms"], test: (r) => checks.kind(r) },
  ];

  let selected: CatalogRow[] = [];
  let relaxed: string[] = [];
  let exactCount = 0;
  for (const [i, pass] of passes.entries()) {
    selected = rows.filter(pass.test);
    if (i === 0) exactCount = selected.length;
    if (selected.length > 0) {
      relaxed = pass.dropped.filter((d) => {
        // Only report filters the visitor actually set
        if (d === "keywords") return words.length > 0;
        if (d.startsWith("budget")) return Boolean(minPrice || maxPrice);
        if (d === "phase") return Boolean(phase);
        if (d === "size") return Boolean(minSizeMarla || maxSizeMarla);
        if (d === "bedrooms") return Boolean(minBeds);
        return true;
      });
      break;
    }
  }

  const target = minPrice && maxPrice ? (minPrice + maxPrice) / 2 : maxPrice ?? minPrice ?? null;
  const ranked = [...selected].sort((a, b) => {
    if (sort === "price_low") return priceOf(a) - priceOf(b);
    if (sort === "price_high") return priceOf(b) - priceOf(a);
    if (sort === "newest") return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    if (target) {
      const d = Math.abs(priceOf(a) - target) - Math.abs(priceOf(b) - target);
      if (d !== 0) return d;
    }
    return Number(b.is_featured) - Number(a.is_featured);
  });

  return { matches: ranked.slice(0, limit).map(toCard), exactCount, relaxed };
}

// ---------------------------------------------------------------- details

export type ListingDetails = ListingCard & {
  status: "available" | "sold";
  kind: ListingKind;
  purpose?: string;
  coveredArea?: string;
  installments?: string;
  hasVideoTour: boolean;
  features: string[];
  description: string;
};

function toDetails(row: CatalogRow): ListingDetails {
  const features = Object.entries(row.features ?? {})
    .filter(([, v]) => v !== false && v !== "" && v != null)
    .map(([k, v]) => (typeof v === "boolean" ? k : `${k}: ${v}`).replace(/_/g, " "))
    .slice(0, 40);

  const installments = row.installment_available
    ? [
        row.advance_amount ? `advance PKR ${Number(row.advance_amount).toLocaleString()}` : null,
        row.no_of_installments ? `${row.no_of_installments} installments` : null,
        row.monthly_installments ? `PKR ${Number(row.monthly_installments).toLocaleString()} monthly` : null,
      ]
        .filter(Boolean)
        .join(", ") || "available"
    : undefined;

  return {
    ...toCard(row),
    status: row.is_sold ? "sold" : "available",
    kind: kindOf(row),
    ...(row.purpose ? { purpose: `For ${row.purpose}` } : null),
    ...(row.constructed_covered_area ? { coveredArea: `${row.constructed_covered_area} sq ft` } : null),
    ...(installments ? { installments } : null),
    hasVideoTour: Boolean(row.video_url),
    features,
    description: (row.description ?? "").replace(/\s+\n/g, "\n").trim().slice(0, 900),
  };
}

export async function getListingBySlug(slug: string): Promise<ListingDetails | null> {
  const row = (await getCatalog()).find((r) => r.slug === slug);
  return row ? toDetails(row) : null;
}

/**
 * Finds a specific listing from how a visitor describes it
 * ("the 2.5 kanal villa in phase 5"). Returns the best match, or a short list
 * of candidates when the description is ambiguous.
 */
export async function findListing(
  query: string,
): Promise<{ listing: ListingDetails } | { candidates: ListingCard[] } | { notFound: true }> {
  const rows = await getCatalog();
  const q = norm(query);

  const bySlug = rows.find((r) => q.includes(r.slug));
  if (bySlug) return { listing: toDetails(bySlug) };

  const qPhase = q.match(/pha?se?\s*([1-9])/)?.[1];
  const qSize = q.match(/(\d+(?:\.\d+)?)\s*(kanal|marla)/);
  const qMarla = qSize ? Number(qSize[1]) * (qSize[2] === "kanal" ? 20 : 1) : null;
  const words = q.split(/[^a-z0-9.]+/).filter((w) => w.length > 2 && !["the", "and", "dha", "phase", "kanal", "marla", "for", "sale", "house", "plot"].includes(w));

  const scored = rows
    .map((r) => {
      const name = norm(r.name);
      let score = 0;
      if (qPhase && phaseOf(r) === Number(qPhase)) score += 2;
      if (qMarla) {
        const s = sizeInMarla(r);
        if (s && Math.abs(s - qMarla) / qMarla < 0.05) score += 3;
      }
      for (const w of words) if (name.includes(w)) score += 1.5;
      if (/villa|house|home/.test(q) && kindOf(r) === "house") score += 0.5;
      if (/plot/.test(q) && kindOf(r) === "plot") score += 0.5;
      return { r, score };
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return { notFound: true };
  if (scored.length === 1 || scored[0].score >= scored[1].score + 1.5) {
    return { listing: toDetails(scored[0].r) };
  }
  return { candidates: scored.slice(0, 4).map((x) => toCard(x.r)) };
}

// ---------------------------------------------------------------- summary

/** One-paragraph inventory overview the assistant can quote accurately. */
export async function getInventorySummary(): Promise<string> {
  const rows = (await getCatalog()).filter((r) => !r.is_sold);
  if (rows.length === 0) return "Inventory is temporarily unavailable.";

  const byKind = new Map<ListingKind, CatalogRow[]>();
  for (const r of rows) byKind.set(kindOf(r), [...(byKind.get(kindOf(r)) ?? []), r]);

  const phases = new Map<number, number>();
  for (const r of rows) {
    const p = phaseOf(r);
    if (p) phases.set(p, (phases.get(p) ?? 0) + 1);
  }

  const kindLines = [...byKind.entries()].map(([kind, list]) => {
    const prices = list.map(priceOf).filter(Boolean).sort((a, b) => a - b);
    const range = prices.length ? `${formatPrice(prices[0])} – ${formatPrice(prices[prices.length - 1])}` : "prices on request";
    return `${list.length} ${kind}${list.length === 1 ? "" : "s"} (${range})`;
  });

  const phaseLine = [...phases.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([p, n]) => `Phase ${p}: ${n}`)
    .join(", ");

  return `${rows.length} available listings: ${kindLines.join("; ")}. By DHA phase: ${phaseLine}.`;
}
