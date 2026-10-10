import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="relative overflow-hidden !pt-40 !pb-12 md:!pt-44 md:!pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_15%_10%,rgba(212,175,55,0.16),transparent_70%)]"
      />

      <div className="container relative mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              <span className="h-px w-8 bg-primary/60" />
              About Elite Property Exchange
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Real estate,
              <em className="block bg-gradient-to-r from-[#b8902a] via-[#a8861f] to-[#7a5c0f] bg-clip-text pb-2 pr-2 font-semibold italic text-transparent">
                verified.
              </em>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
              Based in DHA Phase 2, Islamabad, we list verified properties only
              — every home, plot and commercial space we show is authentic,
              inspected and worth your investment.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contactus"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#1a1714] px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
              >
                Book a Consultation
              </Link>
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 px-8 text-sm font-semibold uppercase tracking-[0.15em] text-[#1a1714] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
              >
                View Properties
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200 lg:aspect-[5/6]">
              <Image
                src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
                alt="Modern luxury residence"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="pointer-events-none absolute inset-3 border border-white/60" />
            </div>

            <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-sm border border-stone-200 bg-white px-6 py-5 shadow-xl shadow-stone-900/5 md:-left-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#faf8f3] text-[#9a7a1e]">
                <MapPin size={20} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">
                  Our home office
                </span>
                <span className="mt-1 block font-[family-name:var(--font-display)] text-xl font-medium">
                  DHA Phase 2, Islamabad
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
