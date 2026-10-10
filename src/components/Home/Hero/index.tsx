import Link from "next/link";
import HeroSearchBar from "./SearchBar";

// Server-rendered: only the search panel ships JavaScript.
const Hero = () => {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden !pb-28 !pt-40 md:!pb-20 lg:items-center lg:!pb-16">
      {/* Background image & overlays */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/hero/hero-bg-mobile.webp" type="image/webp" />
          <source media="(min-width: 769px)" srcSet="/images/hero/hero-bg.webp" type="image/webp" />
          <img
            src="/images/hero/hero-bg.webp"
            alt="Aerial view of DHA Islamabad"
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        {/* Darker on the text side and at the bottom so copy stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
      </div>

      <div className="container relative z-10 mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-[#e6c45a] sm:mb-6 sm:tracking-[0.35em]">
              <span className="hidden h-px w-8 bg-[#e6c45a]/70 sm:block" />
              DHA Islamabad · Verified listings
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-6xl font-medium leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl">
              Live{" "}
              <em className="font-semibold italic text-[#e6c45a]">
                Elite
              </em>
              <br /> by{" "}
              <em className="font-semibold italic text-[#e6c45a]">
                Elite
              </em>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              Verified homes, plots and commercial property across DHA
              Islamabad — handpicked to fit your lifestyle and investment goals.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:flex">
              <Link
                href="/contactus"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-4 text-[11px] sm:px-7 sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#1a1714] transition-colors hover:bg-[#e6c45a]"
              >
                Book a visit
              </Link>
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-4 text-[11px] sm:px-7 sm:text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:border-white hover:bg-white/10"
              >
                View properties
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <HeroSearchBar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
