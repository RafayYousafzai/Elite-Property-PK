"use client";
import { Icon } from "@iconify/react";
import type React from "react";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Drawer, DrawerBody, DrawerContent } from "@heroui/react";

// Navigation configuration - edit this array to modify navigation items
const navigationItems = [
  { name: "Houses", href: "/explore?type=homes", icon: "ph:house-line-bold" },
  { name: "Plots", href: "/explore?type=plots", icon: "ph:map-pin-line-bold", badge: "Popular" },
  { name: "Apartments", href: "/explore?type=apartments", icon: "ph:buildings-bold" },
  { name: "About", href: "/about", icon: "ph:info-bold" },
  { name: "Team", href: "/team", icon: "ph:users-three-bold" },
  { name: "Contact", href: "/contactus", icon: "ph:envelope-simple-bold" },
  { name: "Blogs", href: "/blogs", icon: "ph:article-bold" },
  { name: "Request a Call Back", href: "/request-callback", icon: "ph:phone-call-bold", isCTA: true },
];

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  
  // Rotating Announcements State
  const announcements = [
    { text: "Prime DHA Plots Selling Fast", highlight: "Reserve Yours Today." },
    { text: "Limited Listings in DHA Phase 2", highlight: "Act Now." },
    { text: "Don't Miss Out", highlight: "New Listings Added Daily." },
    { text: "Book a Viewing", highlight: "Before It's Gone." },
    { text: "High-Demand DHA Properties", highlight: "Inquire Today." }
  ];
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
  const router = useRouter();
  const typeParam = searchParams.get("type");

  const sideMenuRef = useRef<HTMLDivElement>(null);

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScroll = window.scrollY;

      // Only hide/show after 50vh
      if (currentScroll > window.innerHeight * 0.5) {
        if (currentScroll > lastScrollY.current) {
          // scrolling down
          setHidden(true);
        } else {
          // scrolling up
          setHidden(false);
        }
      } else {
        // always show before 50vh
        setHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sideMenuRef.current &&
      !sideMenuRef.current.contains(event.target as Node)
    ) {
      setNavbarOpen(false);
    }
  };

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleScroll]);

  // Only Homepage ('/') and Property Details ('/explore/[id]') have dark hero backgrounds
  const hasDarkHero = pathname === "/" || (pathname.startsWith("/explore/") && pathname !== "/explore");
  const useWhiteHeader = hasDarkHero && !sticky;

  return (
    <>
      {/* Top Fixed Announcement Bar */}
      <div className="fixed top-0 left-0 w-full h-11 bg-zinc-950 border-b border-[#d4af37]/20 flex items-center justify-center z-[100] px-4 select-none">
        <div className={`transition-all duration-500 ease-in-out flex items-center gap-1.5 justify-center text-center text-sm md:text-[15px] tracking-wide ${announcementFade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <span className="text-white/95 font-semibold font-sans">{announcements[announcementIndex].text}</span>
          <span className="text-white/30 font-light mx-1">—</span>
          <span className="text-[#d4af37] font-black uppercase tracking-wider text-xs md:text-sm">{announcements[announcementIndex].highlight}</span>
        </div>
      </div>

      <header
        className={`fixed h-20 md:h-24 py-1 z-50 w-full transition-all duration-300 lg:px-0 px-4  ${
          sticky
            ? "top-11 bg-white shadow-md"
            : "top-12 bg-transparent "
        }  ${hidden ? "-translate-y-full" : "translate-y-0 "}`}
      >
      <nav
        className={`w-auto mx-auto max-w-8xl flex items-center justify-between py-0 pt-2 md:py-4 duration-300 ${
          sticky ? " top-5 px-4 " : "shadow-none top-0"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={"/elite-logo-brown.png"}
                alt="Elite Property Exchange Logo"
                width={600}
                height={600}
                priority={true}
                unoptimized={true}
                className={`h-[60px] w-auto object-contain sm:w-32 md:w-40`}
              />
            </Link>
          </div>

          <div className={`hidden md:flex flex-row items-center`}>
            {navigationItems.map((item, index) => {
              // Check if current path and params match exactly
              let isActive = false;
              if (item.href === pathname) {
                isActive = true;
              } else if (
                pathname === "/explore" &&
                item.href.startsWith("/explore")
              ) {
                // For explore pages, check the type parameter more simply
                if (item.href.includes("type=plots") && typeParam === "plots") {
                  isActive = true;
                } else if (
                  item.href.includes("type=homes") &&
                  typeParam === "homes"
                ) {
                  isActive = true;
                }
              }

              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-base text-inherit flex items-center gap-2 pr-6 transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-medium"
                      : useWhiteHeader
                        ? "text-white hover:text-primary"
                        : "text-dark hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-6 flex-shrink-0">
            <div className={`hidden md:block`}>
              <Link
                href="tel:+923344111778"
                className={`text-base text-inherit flex items-center gap-2 transition-colors duration-200 ${
                  useWhiteHeader
                    ? "text-white hover:text-primary"
                    : "text-dark hover:text-primary"
                }`}
              >
                <Icon icon={"ph:phone-bold"} width={24} height={24} />
                +923344111778
              </Link>
            </div>

            <div className="md:hidden" ref={sideMenuRef}>
              <Button
                onClick={() => setNavbarOpen(true)}
                isIconOnly
                className="bg-transparent hover:cursor-pointer p-1 sm:p-2"
                aria-label="Toggle mobile menu"
              >
                <Icon
                  icon={"ph:list"}
                  width={24}
                  height={24}
                  className={`sm:w-7 sm:h-7 ${
                    useWhiteHeader ? "text-white" : "text-dark"
                  }`}
                />
              </Button>
            </div>

            <Drawer
              isOpen={navbarOpen}
              onOpenChange={() => setNavbarOpen(!navbarOpen)}
              size="sm"
              placement="right"
            >
              <DrawerContent className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 max-w-[85vw] sm:max-w-xs border-l border-slate-200 dark:border-slate-800">
                {() => (
                  <>
                    <DrawerBody className="p-0 flex flex-col h-full overflow-hidden">
                      {/* Drawer Header with Logo & Close Button */}
                      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <Image
                          src="/elite-logo-brown.png"
                          alt="Elite Property Exchange Logo"
                          width={140}
                          height={40}
                          priority
                          className="h-9 w-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setNavbarOpen(false)}
                          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition border-0 cursor-pointer"
                          aria-label="Close menu"
                        >
                          <Icon icon="ph:x-bold" className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Scrollable Navigation Links List */}
                      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
                        {navigationItems.map((item, index) => {
                          let isActive = false;
                          if (item.href === pathname) {
                            isActive = true;
                          } else if (
                            pathname === "/explore" &&
                            item.href.startsWith("/explore")
                          ) {
                            if (
                              item.href.includes("type=plots") &&
                              typeParam === "plots"
                            ) {
                              isActive = true;
                            } else if (
                              item.href.includes("type=homes") &&
                              typeParam === "homes"
                            ) {
                              isActive = true;
                            }
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setNavbarOpen(false);
                                setTimeout(() => {
                                  router.push(item.href);
                                }, 100);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border-0 cursor-pointer ${
                                item.isCTA
                                  ? "bg-primary text-white font-bold hover:bg-primary/90 mt-3 shadow-xs"
                                  : isActive
                                    ? "text-primary font-extrabold bg-transparent"
                                    : "text-slate-700 dark:text-slate-200 font-medium hover:text-primary bg-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  icon={item.icon}
                                  className={`w-5 h-5 shrink-0 ${
                                    item.isCTA
                                      ? "text-white"
                                      : isActive
                                        ? "text-primary"
                                        : "text-slate-400 dark:text-slate-500"
                                  }`}
                                />
                                <span>{item.name}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Drawer Bottom Quick Reach Card (Call & WhatsApp) */}
                      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2.5 shrink-0">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Quick Reach
                        </p>
                        <div className="flex items-center gap-2">
                          <a
                            href="tel:+923344111778"
                            onClick={() => setNavbarOpen(false)}
                            className="flex-1 h-10 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs border-0"
                          >
                            <Icon icon="ph:phone-bold" className="w-4 h-4" />
                            <span>Call Now</span>
                          </a>
                          <a
                            href="https://wa.me/+923344111778"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setNavbarOpen(false)}
                            className="flex-1 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs border-0"
                          >
                            <Icon icon="ph:whatsapp-logo-fill" className="w-4 h-4 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </DrawerBody>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </nav>
    </header>
  </>
);
};

export default Header;
