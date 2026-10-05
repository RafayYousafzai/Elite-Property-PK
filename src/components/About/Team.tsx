import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TeamMember } from "@/types/team";

// Compact team preview for the About page; full profiles live on /team
const Team = ({ members }: { members: TeamMember[] }) => {
  if (members.length === 0) return null;

  return (
    <section className="border-t border-stone-200 bg-white !py-24 md:!py-32">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Our People
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              The advisors behind <em className="text-[#9a7a1e]">every deal</em>
            </h2>
          </div>
          <Link
            href="/team"
            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#9a7a1e]"
          >
            Meet the team
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-10">
          {members.map((m) => (
            <Link
              key={m.id}
              href="/team"
              className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-200">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top grayscale-[20%] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-medium transition-colors group-hover:text-[#9a7a1e]">
                {m.name}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">{m.role}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
