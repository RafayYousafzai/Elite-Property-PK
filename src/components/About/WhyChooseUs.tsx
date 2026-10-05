import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Handshake, ScanSearch, UserRound } from "lucide-react";

const pillars = [
  {
    icon: BadgeCheck,
    title: "Verified listings only",
    text: "Every property is checked for ownership and legal compliance before it ever reaches our platform.",
  },
  {
    icon: ScanSearch,
    title: "Inspected in person",
    text: "Our advisors visit and inspect what we list, so what you see is exactly what you get.",
  },
  {
    icon: Handshake,
    title: "Transparent deals",
    text: "Clear pricing and complete documentation at every step — no hidden costs, no surprises.",
  },
  {
    icon: UserRound,
    title: "Personal guidance",
    text: "One dedicated advisor from your first viewing to the final transfer, at home or overseas.",
  },
];

const services = [
  "Property Investment Consultation",
  "Legal Documentation Support",
  "Property Valuation",
  "Overseas Client Support",
  "Property Management",
  "Market Analysis Reports",
];

const WhyChooseUs = () => {
  return (
    <section className="!py-24 md:!py-32">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Why Elite
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              The Elite <em className="text-[#9a7a1e]">standard</em>
            </h2>
          </div>
          <p className="max-w-md text-stone-600 md:text-lg">
            Four promises we keep on every listing and every deal — whether
            you&apos;re buying your first home or growing a portfolio.
          </p>
        </div>

        <div className="mt-16 grid gap-px border-y border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="bg-[#faf8f3] px-1 py-10 sm:px-8"
            >
              <div className="flex items-center justify-between">
                <Icon size={28} strokeWidth={1.25} className="text-[#9a7a1e]" />
                <span className="font-[family-name:var(--font-display)] text-lg italic text-stone-400">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-8 font-[family-name:var(--font-display)] text-2xl font-medium md:text-3xl">
                {title}
              </h3>
              <p className="mt-4 leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid gap-12 rounded-sm border border-stone-200 bg-white p-8 md:p-14 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
              What we offer
            </h3>
            <p className="mt-4 text-stone-600">
              Full-service support for buyers, sellers and investors in DHA
              Islamabad and Rawalpindi.
            </p>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service}>
                <Link
                  href="/contactus"
                  className="group flex items-center justify-between gap-4 border-b border-stone-200 py-5 transition-colors hover:text-[#9a7a1e]"
                >
                  <span className="text-base md:text-lg">{service}</span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                    className="shrink-0 text-stone-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9a7a1e]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
