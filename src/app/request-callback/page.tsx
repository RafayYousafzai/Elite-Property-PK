import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Phone, ShieldCheck, UserRound } from "lucide-react";
import { display } from "@/lib/fonts";
import CallbackForm from "@/components/shared/CallbackForm";

export const metadata: Metadata = {
  title: "Request a Call Back",
  description:
    "Tell us what you're looking for in DHA Islamabad and an Elite Property Exchange advisor will call you back.",
};

const promises = [
  { icon: BadgeCheck, text: "Verified listings only" },
  { icon: UserRound, text: "A dedicated advisor for your search" },
  { icon: ShieldCheck, text: "Transparent pricing, no hidden costs" },
];

export default function RequestCallbackPage() {
  return (
    <main className={`${display.variable} min-h-screen bg-[#faf8f3] text-[#1a1714] lg:grid lg:grid-cols-[5fr_7fr]`}>
      {/* Visual panel (desktop) */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
          alt="Modern luxury residence"
          fill
          priority
          sizes="42vw"
          className="object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        <span className="pointer-events-none absolute inset-4 border border-white/40" />

        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight xl:text-5xl">
            Real estate, <em className="text-[#e6c45a]">verified.</em>
          </p>
          <ul className="mt-8 space-y-3 text-white/85">
            {promises.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon size={18} strokeWidth={1.5} className="text-[#e6c45a]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Elite Property Exchange home">
            <Image
              src="/elite-logo-brown.png"
              alt="Elite Property Exchange"
              width={200}
              height={80}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <a
            href="tel:+923344111778"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#9a7a1e]"
          >
            <Phone size={16} strokeWidth={1.5} className="text-[#9a7a1e]" />
            <span className="hidden sm:inline">+92 334 4111778</span>
            <span className="sm:hidden">Call us</span>
          </a>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
            Request a call back
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium leading-tight sm:text-5xl">
            Tell us what you&apos;re <em className="text-[#9a7a1e]">looking for</em>
          </h1>
          <p className="mt-4 text-stone-600">
            Share a few details and one of our property advisors will call you
            to talk through options in DHA Islamabad.
          </p>

          <div className="mt-10">
            <CallbackForm />
          </div>
        </div>

        <p className="text-center text-xs text-stone-400">
          Elite Property Exchange · DHA Phase II, Islamabad
        </p>
      </div>
    </main>
  );
}
