import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3v88.4a74.6 74.6 0 1 0 52.2 71.2V0h88.1a121.2 121.2 0 0 0 1.9 22.2h.1a122.2 122.2 0 0 0 54.1 80.9 121.7 121.7 0 0 0 66.6 19.9z" />
  </svg>
);

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Houses", href: "/explore?type=homes" },
      { label: "Plots", href: "/explore?type=plots" },
      { label: "Apartments", href: "/explore?type=apartments" },
      { label: "Commercial", href: "/explore?type=commercial" },
      { label: "All Listings", href: "/explore" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Blog", href: "/blogs" },
      { label: "Contact", href: "/contactus" },
      { label: "Request a Call Back", href: "/request-callback" },
    ],
  },
];

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@elitepropertiespk", icon: TiktokIcon },
  { label: "Facebook", href: "https://www.facebook.com/elitepropexch/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/elitepropertyexchange/", icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/@elitepropertypk", icon: Youtube },
];

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-stone-200 bg-white text-[#1a1714]">
      {/* Closing call to action */}
      <div className="border-b border-stone-200 bg-[#faf8f3] bg-[radial-gradient(45%_90%_at_50%_100%,rgba(212,175,55,0.14),transparent_70%)]">
        <div className="container mx-auto flex max-w-8xl flex-col gap-10 px-5 py-14 md:py-16 lg:flex-row lg:items-end lg:justify-between 2xl:px-0">
          <div>
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
              Begin your search
            </p>
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-medium leading-tight md:text-6xl">
              Your next home in DHA starts with{" "}
              <em className="text-[#9a7a1e]">one conversation</em>
            </h2>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/request-callback"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a1714] px-7 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
            >
              Request a call back
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/923344111778"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-7 text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container mx-auto grid max-w-8xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 md:py-14 lg:grid-cols-12 lg:gap-10 2xl:px-0">
        <div className="col-span-2 lg:col-span-4">
          <Link href="/" aria-label="Elite Property Exchange home">
            <Image
              src="/elite-logo-brown.png"
              alt="Elite Property Exchange"
              width={600}
              height={600}
              sizes="160px"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <p className="mt-6 max-w-xs leading-relaxed text-stone-600">
            Verified homes, plots and commercial property in DHA Islamabad —
            handled with honesty from first viewing to final transfer.
          </p>
          <div className="mt-8 flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
              >
                <Icon width={16} height={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="lg:col-span-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
              {col.title}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-700 transition-colors hover:text-[#9a7a1e]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 lg:col-span-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            Visit us
          </h3>
          <ul className="mt-6 space-y-4 text-stone-700">
            <li>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=33.535113,73.170038"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 transition-colors hover:text-[#9a7a1e]"
              >
                <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
                2nd Floor, Plaza No. 19, Tipu Boulevard, Sector G, DHA Phase II, Islamabad
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
              Monday – Sunday, 9:00 AM – 7:00 PM
            </li>
            <li>
              <a href="tel:+923344111778" className="flex gap-3 transition-colors hover:text-[#9a7a1e]">
                <Phone size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
                +92 334 4111778
              </a>
            </li>
            <li>
              <a
                href="mailto:pk.eliteproperty@gmail.com"
                className="flex gap-3 break-all transition-colors hover:text-[#9a7a1e]"
              >
                <Mail size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#9a7a1e]" />
                pk.eliteproperty@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-stone-200">
        <div className="container mx-auto flex max-w-8xl flex-col gap-4 px-5 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between 2xl:px-0">
          <p>© {new Date().getFullYear()} Elite Property Exchange. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="transition-colors hover:text-[#1a1714]">
              Terms of service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#1a1714]">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
