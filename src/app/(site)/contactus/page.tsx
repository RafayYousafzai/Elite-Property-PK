import { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { display } from "@/lib/fonts";
import CallbackForm from "@/components/shared/CallbackForm";
import MapEmbed from "@/components/shared/MapEmbed";

export const metadata: Metadata = {
  title: "Contact Us | Elite Property Exchange",
  description: "Get in touch with Elite Property Exchange. Contact our expert real estate agents for consultations, bookings, or inquiries in DHA Islamabad.",
  keywords: ["contact elite property", "dha islamabad real estate office", "real estate agent contact islamabad"],
};

const channels = [
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
    href: "https://wa.me/923344111778",
  },
  {
    icon: Mail,
    label: "Email",
    value: "pk.eliteproperty@gmail.com",
    href: "mailto:pk.eliteproperty@gmail.com",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "2nd Floor, Plaza No. 19, Tipu Boulevard, Sector G, DHA Phase II, Islamabad",
    href: "https://www.google.com/maps/dir/?api=1&destination=33.535113,73.170038",
  },
];

export default function ContactUs() {
  return (
    <main className={`${display.variable} bg-[#faf8f3] text-[#1a1714]`}>
      <section className="relative overflow-hidden !pt-48 !pb-16 md:!pt-56 md:!pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_15%_0%,rgba(212,175,55,0.16),transparent_70%)]"
        />
        <div className="container relative mx-auto max-w-8xl px-5 2xl:px-0">
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
            <span className="h-px w-8 bg-primary/60" />
            Contact
          </p>
          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Let&apos;s <em className="text-[#9a7a1e]">talk property</em>
          </h1>
          <p className="mt-6 max-w-xl text-stone-600 md:text-lg">
            Buying, selling or investing in DHA Islamabad — tell us what you
            need and an advisor will get back to you.
          </p>
        </div>
      </section>

      <section className="!pt-0 !pb-24 md:!pb-32">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            {/* Form */}
            <div className="self-start rounded-sm border border-stone-200 bg-white p-6 sm:p-10 md:p-12">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium md:text-4xl">
                Request a call back
              </h2>
              <p className="mt-2 mb-10 text-stone-500">
                A few quick details help us prepare the right options for you.
              </p>
              <CallbackForm trackingCategory="Contact Page Lead" />
            </div>

            {/* Direct channels */}
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                Or reach us directly
              </h2>
              <ul className="mt-6 border-t border-stone-300">
                {channels.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-5 border-b border-stone-200 py-6"
                    >
                      <Icon size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-[#9a7a1e]" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-stone-400">
                          {label}
                        </span>
                        <span className="mt-1 block break-words text-base transition-colors group-hover:text-[#9a7a1e] md:text-lg">
                          {value}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.5}
                        className="mt-1 shrink-0 text-stone-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9a7a1e]"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-6 flex items-center gap-3 text-sm text-stone-600">
                <Clock size={18} strokeWidth={1.5} className="text-[#9a7a1e]" />
                Open Monday – Sunday, 9:00 AM – 7:00 PM
              </p>

              <MapEmbed className="mt-10 aspect-[4/3]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
