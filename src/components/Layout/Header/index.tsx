"use client";
import type React from "react";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Home,
  Info,
  LandPlot,
  Mail,
  Menu,
  MessageCircle,
  Newspaper,
  Phone,
  PhoneCall,
  Users,
  X,
} from "lucide-react";

// Navigation configuration - edit this array to modify navigation items
const navigationItems = [
  { name: "Houses", href: "/explore?type=homes", icon: Home },
  { name: "Plots", href: "/explore?type=plots", icon: LandPlot },
  { name: "Apartments", href: "/explore?type=apartments", icon: Building2 },
  { name: "About", href: "/about", icon: Info },
  { name: "Team", href: "/team", icon: Users },
  { name: "Blogs", href: "/blogs", icon: Newspaper },
  { name: "Contact", href: "/contactus", icon: Mail },
];

const CTA = { name: "Request a Call Back", href: "/request-callback" };

const announcements = [
  { text: "Prime DHA Plots Selling Fast", highlight: "Reserve Yours Today." },
  { text: "Limited Listings in DHA Phase 2", highlight: "Act Now." },
  { text: "Don't Miss Out", highlight: "New Listings Added Daily." },
  { text: "Book a Viewing", highlight: "Before It's Gone." },
  { text: "High-Demand DHA Properties", highlight: "Inquire Today." },
];

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementFade, setAnnouncementFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementFade(false);
      setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setAnnouncementFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScroll = window.scrollY;

      // Only hide/show after 50vh: hide while scrolling down, reveal on scroll up
      if (currentScroll > window.innerHeight * 0.5) {
        setHidden(currentScroll > lastScrollY.current);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close the mobile menu on navigation
  useEffect(() => {
    setNavbarOpen(false);
  }, [pathname, typeParam]);

  // Lock page scroll and allow Escape while the mobile menu is open
  useEffect(() => {
    if (!navbarOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavbarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [navbarOpen]);

  // Only the homepage has a dark photo hero behind the header
  const hasDarkHero = pathname === "/";
  const useWhiteHeader = hasDarkHero && !sticky;

  const isActive = (href: string) => {
    if (href === pathname) return true;
    if (pathname === "/explore" && href.startsWith("/explore?type=")) {
      return href.endsWith(`type=${typeParam}`);
    }
    return false;
  };

  const linkTone = useWhiteHeader
    ? "text-white/90 hover:text-white"
    : "text-[#1a1714]/80 hover:text-[#1a1714]";

  return (
    <>
      {/* Top Fixed Announcement Bar */}
      <div className="fixed top-0 left-0 z-[100] flex h-11 w-full select-none items-center justify-center border-b border-stone-200 bg-[#faf8f3] px-4">
        <div
          className={`flex items-center justify-center gap-1.5 text-center text-[13px] tracking-wide transition-all duration-500 ease-in-out md:text-sm ${
            announcementFade ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <span className="font-medium text-stone-700">{announcements[announcementIndex].text}</span>
          <span className="mx-1 text-stone-300">—</span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9a7a1e]">
            {announcements[announcementIndex].highlight}
          </span>
        </div>
      </div>

      <header
        className={`fixed z-50 h-20 w-full px-4 transition-all duration-300 md:h-24 lg:px-0 ${
          sticky
            ? "top-11 border-b border-stone-200 bg-white/95 backdrop-blur-md"
            : "top-12 border-b border-transparent bg-transparent"
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <nav className={`mx-auto flex h-full max-w-8xl items-center justify-between ${sticky ? "lg:px-4" : ""}`}>
          <Link href="/" className="shrink-0" aria-label="Elite Property Exchange home">
            <Image
              src="/elite-logo-brown.png"
              alt="Elite Property Exchange Logo"
              width={600}
              height={600}
              priority
              sizes="160px"
              className="h-[60px] w-auto object-contain sm:w-32 md:w-40"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex xl:gap-8">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[15px] transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-primary after:transition-transform after:duration-300 ${
                    active
                      ? `${useWhiteHeader ? "text-white" : "text-[#1a1714]"} font-medium after:scale-x-100`
                      : `${linkTone} after:scale-x-0 hover:after:scale-x-100`
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a
              href="tel:+923344111778"
              className={`hidden items-center gap-2 text-[15px] transition-colors xl:flex ${linkTone}`}
            >
              <Phone size={16} strokeWidth={1.75} className="text-primary" />
              +92 334 4111778
            </a>

            <Link
              href={CTA.href}
              className={`hidden h-11 items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors lg:inline-flex ${
                useWhiteHeader
                  ? "bg-white text-[#1a1714] hover:bg-primary hover:text-white"
                  : "bg-[#1a1714] text-white hover:bg-[#9a7a1e]"
              }`}
            >
              <PhoneCall size={14} strokeWidth={2} />
              Call Back
            </Link>

            <button
              type="button"
              onClick={() => setNavbarOpen(true)}
              aria-label="Open menu"
              aria-expanded={navbarOpen}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors lg:hidden ${
                useWhiteHeader ? "text-white hover:bg-white/10" : "text-[#1a1714] hover:bg-stone-100"
              }`}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {navbarOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end lg:hidden">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setNavbarOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className="relative flex h-full w-[86vw] max-w-sm flex-col bg-[#faf8f3] text-[#1a1714] shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-stone-200 px-5 py-4">
              <Image
                src="/elite-logo-brown.png"
                alt="Elite Property Exchange Logo"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setNavbarOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition-colors hover:text-[#1a1714]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4">
              {navigationItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setNavbarOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-center justify-between border-b border-stone-200 py-4"
                  >
                    <span className="flex items-center gap-4">
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        className={active ? "text-[#9a7a1e]" : "text-stone-400"}
                      />
                      <span
                        className={`font-[family-name:var(--font-display)] text-2xl ${
                          active ? "text-[#9a7a1e]" : "group-hover:text-[#9a7a1e]"
                        }`}
                      >
                        {item.name}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-[#9a7a1e]"
                    />
                  </Link>
                );
              })}

              <Link
                href={CTA.href}
                onClick={() => setNavbarOpen(false)}
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-[#1a1714] text-xs font-semibold uppercase tracking-[0.15em] text-white"
              >
                <PhoneCall size={14} strokeWidth={2} />
                {CTA.name}
              </Link>
            </nav>

            <div className="shrink-0 space-y-3 border-t border-stone-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                Quick reach
              </p>
              <div className="flex gap-2">
                <a
                  href="tel:+923344111778"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 text-sm font-medium transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
                >
                  <Phone size={16} strokeWidth={1.5} className="text-[#9a7a1e]" />
                  Call
                </a>
                <a
                  href="https://wa.me/923344111778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 text-sm font-medium transition-colors hover:border-[#9a7a1e] hover:text-[#9a7a1e]"
                >
                  <MessageCircle size={16} strokeWidth={1.5} className="text-[#9a7a1e]" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
