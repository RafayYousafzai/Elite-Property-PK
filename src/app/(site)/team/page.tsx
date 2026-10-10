import type { Metadata } from "next";
import { display } from "@/lib/fonts";
import { getTeamMembersServer } from "@/lib/supabase/team-server";
import TeamShowcase from "@/components/Team/TeamShowcase";

// Statically rendered and refreshed in the background so visitors never wait on a fetch.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Our Team – Real Estate Advisors in DHA Islamabad",
  description:
    "Meet the property advisors at Elite Property Exchange — specialists in houses, plots and commercial real estate across DHA Islamabad and Rawalpindi.",
  alternates: { canonical: "/team" },
};

export default async function TeamPage() {
  const members = await getTeamMembersServer();

  return (
    <main className={`${display.variable} bg-[#faf8f3] text-[#1a1714]`}>
      {/* Hero */}
      <section className="relative overflow-hidden !pt-40 !pb-10 md:!pt-48 md:!pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,175,55,0.18),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />

        <div className="container relative mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              <span className="h-px w-8 bg-primary/60" />
              The People Behind Elite
              <span className="h-px w-8 bg-primary/60" />
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Advisors of{" "}
              <em className="bg-gradient-to-r from-[#b8902a] via-[#a8861f] to-[#7a5c0f] bg-clip-text pr-2 font-semibold italic text-transparent">
                distinction
              </em>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
              A close-knit team of real estate specialists who know DHA
              Islamabad street by street — guiding every purchase, sale and
              investment with discretion and care.
            </p>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="!pt-8 !pb-14 md:!pt-12 md:!pb-20">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          {members.length > 0 ? (
            <TeamShowcase members={members} />
          ) : (
            <p className="py-24 text-center text-stone-500">
              Our team profiles are being updated. Please check back soon.
            </p>
          )}
        </div>
      </section>

    </main>
  );
}
