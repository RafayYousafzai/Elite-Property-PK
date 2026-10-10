"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { PhoneCall, X } from "lucide-react";

const DISMISSED_KEY = "elite_callback_popup_dismissed";
const SHOW_AFTER_MS = 25000;
const SHOW_AFTER_SCROLL = 0.6;

// Pages that already are a contact form
const EXCLUDED = ["/contactus", "/request-callback"];

export default function CallbackPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Appear only once the visitor is clearly engaged (time on site or deep
  // scroll), never during first paint where it would hide the page content.
  useEffect(() => {
    if (EXCLUDED.includes(pathname)) return;
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      return;
    }

    let timer = 0;
    const stop = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
    // Show at most once: stop both triggers, and re-check the flag in case it
    // was dismissed in another tab or earlier on this page
    const show = () => {
      stop();
      try {
        if (sessionStorage.getItem(DISMISSED_KEY)) return;
      } catch {
        return;
      }
      setIsOpen(true);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > SHOW_AFTER_SCROLL) show();
    };
    timer = window.setTimeout(show, SHOW_AFTER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return stop;
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const remember = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // storage blocked — the popup simply may show again
    }
  };

  const handleClose = () => {
    remember();
    setIsOpen(false);
  };

  const handleRedirect = () => {
    remember();
    setIsOpen(false);
    router.push("/request-callback");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-stone-900/40 p-0 backdrop-blur-sm animate-in fade-in duration-300 sm:items-center sm:p-4">
      <div className="absolute inset-0" onClick={handleClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="callback-popup-title"
        className="relative w-full max-w-md overflow-hidden bg-[#faf8f3] text-[#1a1714] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 sm:rounded-sm"
      >
        <div className="relative aspect-[16/9] bg-stone-200">
          <Image
            src="/images/hero/modern-apartment-building-with-numerous-windows-and-balconies_49091535.jpeg"
            alt=""
            fill
            sizes="448px"
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-3 border border-white/60" />
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-stone-600 backdrop-blur-sm transition-colors hover:text-[#1a1714]"
            aria-label="Close popup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-7 sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#9a7a1e]">
            Elite Property Exchange
          </p>
          <h2
            id="callback-popup-title"
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium leading-tight"
          >
            Speak with an <em className="text-[#9a7a1e]">advisor</em>
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            Looking to buy, sell or invest in DHA Islamabad? Request a call
            back and one of our consultants will reach out shortly.
          </p>

          <div className="mt-7 flex flex-col gap-2.5">
            <button
              onClick={handleRedirect}
              className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1a1714] text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9a7a1e]"
            >
              <PhoneCall size={15} /> Request a call back
            </button>
            <button
              onClick={handleClose}
              className="h-11 cursor-pointer text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 transition-colors hover:text-[#1a1714]"
            >
              No thanks, just browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
