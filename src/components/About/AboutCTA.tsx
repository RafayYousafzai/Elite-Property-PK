import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    label: "Call us",
    value: "+92 334 4111778",
    href: "tel:+923344111778",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with an advisor",
    href: "https://wa.me/923344111778?text=Hello%2C%20I%27d%20like%20to%20schedule%20a%20free%20consultation%20regarding%20property%20investments.",
  },
  {
    icon: Mail,
    label: "Email",
    value: "pk.eliteproperty@gmail.com",
    href: "mailto:pk.eliteproperty@gmail.com",
  },
  {
    icon: MapPin,
    label: "Visit our office",
    value: "Phase 2, DHA Islamabad",
    href: "https://www.google.com/maps/dir/?api=1&destination=33.535113,73.170038",
  },
];

const AboutCTA = () => {
  return (
    <section className="border-t border-stone-200 !py-14 md:!py-20">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200">
            <Image
              src="/images/hero/hero-bg.webp"
              alt="Aerial view of DHA Phase 2, Islamabad"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="pointer-events-none absolute inset-3 border border-white/60" />
          </div>

          <div>
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Get in touch
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Let&apos;s find your next <em className="text-[#9a7a1e]">address</em>
            </h2>
            <p className="mt-6 max-w-lg text-stone-600 md:text-lg">
              Speak with an advisor today — we&apos;ll guide you through every
              step, from the first viewing to the final transfer.
            </p>

            <ul className="mt-10 border-t border-stone-300">
              {contactMethods.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-5 border-b border-stone-200 py-5"
                  >
                    <Icon size={20} strokeWidth={1.5} className="shrink-0 text-[#9a7a1e]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">
                        {label}
                      </span>
                      <span className="mt-1 block truncate text-base transition-colors group-hover:text-[#9a7a1e] md:text-lg">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="shrink-0 text-stone-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9a7a1e]"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <Link
              href="/contactus"
              className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-[#1a1714] px-8 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
