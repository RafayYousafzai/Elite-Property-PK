import Link from "next/link";
import { ArrowRight, ChevronRight, MessageCircle, PhoneCall, Plus } from "lucide-react";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/Home/Properties/Card/Card";
import type { LandingPage, LandingStats } from "@/lib/seo/landing";

export type Crumb = { name: string; href: string };

export default function LandingView({
  h1,
  intro,
  crumbs,
  stats,
  listings,
  related,
  faqs,
  exploreHref,
}: {
  h1: string;
  intro: string;
  crumbs: Crumb[];
  stats: LandingStats;
  listings: Property[];
  related: Array<{ title: string; pages: LandingPage[] }>;
  faqs: Array<{ q: string; a: string }>;
  exploreHref: string;
}) {
  return (
    <main className="min-h-screen bg-[#faf8f3] text-[#1a1714]">
      {/* Title */}
      <section className="border-b border-stone-200 bg-[radial-gradient(50%_80%_at_10%_0%,rgba(212,175,55,0.14),transparent_70%)] !pb-10 !pt-36 md:!pb-12 md:!pt-44">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-stone-300" />}
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-stone-700">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className="transition-colors hover:text-[#9a7a1e]">
                    {c.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl">
            {h1}
          </h1>
          <p className="mt-5 max-w-3xl leading-relaxed text-stone-600 md:text-lg">{intro}</p>

          <dl className="mt-8 flex flex-wrap gap-px overflow-hidden rounded-sm border border-stone-200 bg-stone-200">
            {[
              { label: "Available now", value: String(stats.count) },
              { label: "Prices from", value: stats.minPrice },
              { label: "Up to", value: stats.maxPrice },
              ...(stats.sizes.length ? [{ label: "Sizes", value: stats.sizes.slice(0, 4).join(", ") }] : []),
            ].map((s) => (
              <div key={s.label} className="min-w-[140px] flex-1 bg-white px-5 py-4">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">{s.label}</dt>
                <dd className="mt-1 font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Listings */}
      <section className="!py-12 md:!py-16">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10 lg:grid-cols-3">
            {listings.map((p, i) => (
              <PropertyCard key={p.id ?? p.slug} item={p} priority={i < 3} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={exploreHref}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-stone-300 bg-white px-7 text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
            >
              Filter & sort all listings <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs + CTA */}
      <section className="border-t border-stone-200 bg-white !py-12 md:!py-16">
        <div className="container mx-auto grid max-w-8xl gap-12 px-5 lg:grid-cols-[3fr_2fr] lg:gap-16 2xl:px-0">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-8 border-t border-stone-300">
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0} className="group border-b border-stone-200 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium transition-colors hover:text-[#9a7a1e]">
                    {f.q}
                    <Plus size={18} strokeWidth={1.5} className="shrink-0 text-[#9a7a1e] transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="-mt-1 pb-5 pr-8 leading-relaxed text-stone-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="self-start rounded-sm border border-stone-200 bg-[#faf8f3] p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium">Speak with an advisor</h2>
            <p className="mt-3 text-stone-600">
              Tell us your budget and preferred size — we&apos;ll shortlist verified options, including ones not yet online.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/request-callback"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a1714] text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
              >
                <PhoneCall size={15} /> Request a call back
              </Link>
              <a
                href="https://wa.me/923344111778"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
              >
                <MessageCircle size={15} /> WhatsApp +92 334 4111778
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Related searches (internal links) */}
      {related.some((g) => g.pages.length > 0) && (
        <section className="border-t border-stone-200 !py-12 md:!py-14">
          <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium">Related searches</h2>
            <div className="mt-8 grid gap-10 md:grid-cols-3">
              {related
                .filter((g) => g.pages.length > 0)
                .map((group) => (
                  <div key={group.title}>
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">{group.title}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {group.pages.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/dha-islamabad/${p.slug}`}
                            className="text-stone-700 transition-colors hover:text-[#9a7a1e]"
                          >
                            {p.h1} <span className="text-stone-400">({p.count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
