import type { Property } from "@/types/property";
import {
  KIND_COPY,
  POPULAR_SIZES,
  formatPrice,
  kindOf,
  phaseOf,
  sizeInMarla,
  sizeLabel,
  sizeSlug,
  type ListingKind,
} from "@/lib/listing-taxonomy";

/**
 * Search landing pages under /dha-islamabad/[slug], generated from live
 * inventory. Each page targets a phrase people search for ("plots for sale in
 * DHA Phase 4", "1 kanal houses for sale in DHA Islamabad") and only exists
 * while there are listings to show, so no page is ever empty or thin.
 */

export type LandingFilter = { kind?: ListingKind; phase?: number; sizeMarla?: number };

const KIND_BY_SLUG = Object.fromEntries(
  Object.entries(KIND_COPY).map(([kind, c]) => [c.slug, kind as ListingKind]),
) as Record<string, ListingKind>;

const MIN_COMBO_LISTINGS = 2;

export function buildSlug({ kind, phase, sizeMarla }: LandingFilter): string {
  const parts: string[] = [];
  if (phase) parts.push(`phase-${phase}`);
  if (sizeMarla) parts.push(sizeSlug(sizeMarla));
  parts.push(kind ? KIND_COPY[kind].slug : phase ? "" : "property-for-sale");
  return parts.filter(Boolean).join("-");
}

export function parseSlug(slug: string): LandingFilter | null {
  const m = slug.match(/^(?:phase-([1-9])-?)?(?:(\d+(?:\.\d)?)-(marla|kanal)-)?(.*)$/);
  if (!m) return null;
  const [, phase, size, unit, rest] = m;
  const filter: LandingFilter = {};
  if (phase) filter.phase = Number(phase);
  if (size) filter.sizeMarla = Number(size) * (unit === "kanal" ? 20 : 1);
  if (rest) {
    const kind = KIND_BY_SLUG[rest];
    if (!kind) return null;
    filter.kind = kind;
  } else if (!filter.phase) {
    return null;
  }
  if (filter.sizeMarla && !filter.kind) return null;
  // Canonical form only, so each search has exactly one URL
  return buildSlug(filter) === slug ? filter : null;
}

export function matches(p: Property, { kind, phase, sizeMarla }: LandingFilter): boolean {
  if (p.is_sold) return false;
  if (kind && kindOf(p) !== kind) return false;
  if (phase && phaseOf(p) !== phase) return false;
  if (sizeMarla) {
    const s = sizeInMarla(p);
    if (!s || Math.abs(s - sizeMarla) / sizeMarla > 0.05) return false;
  }
  return true;
}

export function describe({ kind, phase, sizeMarla }: LandingFilter) {
  const place = phase ? `DHA Phase ${phase} Islamabad` : "DHA Islamabad";
  const what = kind ? KIND_COPY[kind].title : "Property";
  const size = sizeMarla ? `${sizeLabel(sizeMarla)} ` : "";
  return {
    h1: `${size}${what} for Sale in ${place}`,
    place,
    plural: kind ? KIND_COPY[kind].plural : "properties",
    shortPlace: phase ? `DHA Phase ${phase}` : "DHA Islamabad",
  };
}

export type LandingStats = {
  count: number;
  minPrice: string;
  maxPrice: string;
  sizes: string[];
  phases: number[];
  kinds: ListingKind[];
  /** "1 Kanal" -> "PKR 3.2 crore" (cheapest of that size) */
  fromBySize: Array<{ size: string; from: string; count: number }>;
};

export function statsFor(listings: Property[]): LandingStats {
  const prices = listings.map((p) => Number(p.rate) || 0).filter(Boolean).sort((a, b) => a - b);
  const bySize = new Map<number, number[]>();
  for (const p of listings) {
    const s = sizeInMarla(p);
    if (!s) continue;
    const key = Math.round(s);
    bySize.set(key, [...(bySize.get(key) ?? []), Number(p.rate) || 0]);
  }
  const sizesSorted = [...bySize.keys()].sort((a, b) => a - b);
  return {
    count: listings.length,
    minPrice: prices.length ? formatPrice(prices[0]) : "Price on request",
    maxPrice: prices.length ? formatPrice(prices[prices.length - 1]) : "Price on request",
    sizes: sizesSorted.map(sizeLabel),
    phases: [...new Set(listings.map(phaseOf).filter((n): n is number => Boolean(n)))].sort(),
    kinds: [...new Set(listings.map(kindOf))],
    fromBySize: sizesSorted
      .map((s) => {
        const list = (bySize.get(s) ?? []).filter(Boolean).sort((a, b) => a - b);
        return { size: sizeLabel(s), from: list.length ? formatPrice(list[0]) : "", count: bySize.get(s)?.length ?? 0 };
      })
      .filter((x) => x.from),
  };
}

export type LandingPage = { slug: string; filter: LandingFilter; count: number; h1: string };

/** Every landing page that currently has inventory behind it. */
export function allLandingPages(properties: Property[]): LandingPage[] {
  const available = properties.filter((p) => !p.is_sold);
  const kinds = Object.keys(KIND_COPY) as ListingKind[];
  const phases = [1, 2, 3, 4, 5, 6, 7];
  const candidates: Array<{ filter: LandingFilter; min: number }> = [
    ...kinds.map((kind) => ({ filter: { kind }, min: 1 })),
    ...phases.map((phase) => ({ filter: { phase }, min: 1 })),
    ...phases.flatMap((phase) => kinds.map((kind) => ({ filter: { phase, kind }, min: MIN_COMBO_LISTINGS }))),
    ...POPULAR_SIZES.flatMap((sizeMarla) =>
      (["house", "plot"] as ListingKind[]).map((kind) => ({ filter: { sizeMarla, kind }, min: MIN_COMBO_LISTINGS })),
    ),
  ];

  return candidates
    .map(({ filter, min }) => {
      const count = available.filter((p) => matches(p, filter)).length;
      return { slug: buildSlug(filter), filter, count, h1: describe(filter).h1, min };
    })
    .filter((page) => page.count >= page.min)
    .map(({ min: _min, ...page }) => page);
}

export function landingFaqs(filter: LandingFilter, stats: LandingStats): Array<{ q: string; a: string }> {
  const d = describe(filter);
  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `How many ${d.plural} are for sale in ${d.place}?`,
      a: `Elite Property Exchange currently has ${stats.count} verified ${stats.count === 1 ? d.plural.replace(/s$/, "") : d.plural} for sale in ${d.shortPlace}, priced from ${stats.minPrice} to ${stats.maxPrice}. Listings are updated as soon as properties are added or sold.`,
    },
  ];
  if (stats.fromBySize.length > 1 && !filter.sizeMarla) {
    faqs.push({
      q: `What is the price of ${d.plural} in ${d.place}?`,
      a: `Current asking prices by size: ${stats.fromBySize
        .map((s) => `${s.size} from ${s.from}`)
        .join("; ")}. Prices vary with location, facing, construction and possession status.`,
    });
  }
  if (stats.sizes.length > 0 && !filter.sizeMarla) {
    faqs.push({
      q: `What sizes are available?`,
      a: `Available sizes right now include ${stats.sizes.join(", ")}.`,
    });
  }
  faqs.push(
    {
      q: `Are these listings verified?`,
      a: `Yes. Every property is checked for ownership and documentation before it is listed, and our advisors inspect listings in person.`,
    },
    {
      q: `Can overseas Pakistanis buy property in ${d.shortPlace}?`,
      a: `Yes. We arrange live video viewings, share documents digitally and guide the DHA transfer, which can be completed in person or through an authorised representative.`,
    },
    {
      q: `How do I book a visit?`,
      a: `Call or WhatsApp +92 334 4111778, or request a call back on our website. Our office is in Sector G, DHA Phase II, Islamabad and is open Monday to Sunday, 9 AM to 7 PM.`,
    },
  );
  return faqs;
}
