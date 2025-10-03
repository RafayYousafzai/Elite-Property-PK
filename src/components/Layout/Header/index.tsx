"use client";
import { Icon } from "@iconify/react";
import type React from "react";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Drawer, DrawerBody, DrawerContent } from "@heroui/react";

// Navigation configuration - edit this array to modify navigation items
const navigationItems = [
  // { name: "Home", href: "/" },
  // { name: "Plots", href: "/explore?type=plots" },
  { name: "Houses", href: "/explore?type=homes" },
  { name: "Apartments", href: "/explore?type=apartments" },
  { name: "Plots", href: "/explore?type=plots" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contactus" },
  { name: "Blogs", href: "/blogs" },
];

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
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

  const isHomepage = pathname === "/" || pathname === "/about";

  return (
    <header
      className={`fixed h-20 md:h-24 py-1 z-50 w-full transition-all duration-300 lg:px-0 px-4  ${
        sticky
          ? "top-0 bg-white dark:bg-dark shadow-md"
          : "top-1 bg-transparent "
      }  ${hidden ? "-translate-y-full" : "translate-y-0 "}`}
    >
      <nav
        className={`w-auto mx-auto max-w-8xl flex items-center justify-between py-0 pt-4 md:py-4 duration-300 ${
          sticky ? " dark:bg-dark top-5 px-4 " : "shadow-none top-0"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex-shrink-0">
            <Link href="/">
              {/* <Image
                src={"/images/header/dark-logo.svg"}
                alt="logo"
                width={300}
                height={300}
                unoptimized={true}
                className={`h-auto w-24 sm:w-32 md:w-40 mt-1 md:mt-2 ${
                  isHomepage
                    ? sticky
                      ? "block dark:hidden"
                      : "hidden"
                    : sticky
                    ? "block dark:hidden"
                    : "block dark:hidden"
                } `}
              />
              <Image
                src={"/images/header/logo.svg"}
                alt="logo"
                width={600}
                height={600}
                unoptimized={true}
                className={`h-auto w-24 sm:w-32 md:w-40 mt-1 md:mt-2 ${
                  isHomepage
                    ? sticky
                      ? "hidden dark:block"
                      : "block"
                    : sticky
                    ? "dark:block hidden"
                    : "dark:block hidden"
                }`}
              /> */}

              <Image
                src={"/elite-logo-brown.png"}
                alt="logo"
                width={600}
                height={600}
                unoptimized={true}
                className={`h-[60px] w-auto object-contain sm:w-32 md:w-40  `}
              />

              {/* <h1
                className={`text-3xl font-semibold mt-2 ${
                  isHomepage
                    ? sticky
                      ? "text-dark dark:text-white"
                      : "text-white"
                    : "text-dark dark:text-white"
                }`}
              >
                Homely
              </h1> */}
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
                      : isHomepage
                      ? sticky
                        ? "text-dark dark:text-white hover:text-primary"
                        : "text-white hover:text-primary"
                      : "text-dark dark:text-white hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-6 flex-shrink-0">
            {/* <Button
              isIconOnly
              className="bg-transparent hover:cursor-pointer p-1 sm:p-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Icon
                icon={"solar:sun-bold"}
                width={24}
                height={24}
                className={`sm:w-8 sm:h-8 dark:hidden block ${
                  isHomepage
                    ? sticky
                      ? "text-dark"
                      : "text-white"
                    : "text-dark"
                }`}
              />
              <Icon
                icon={"solar:moon-bold"}
                width={24}
                height={24}
                className="sm:w-8 sm:h-8 dark:block hidden text-white"
              />
            </Button> */}

            <div className={`hidden md:block`}>
              <Link
                href="tel:+923344111778"
                className={`text-base text-inherit flex items-center gap-2 transition-colors duration-200 ${
                  isHomepage
                    ? sticky
                      ? "text-dark dark:text-white hover:text-primary"
                      : "text-white hover:text-primary"
                    : "text-dark dark:text-white hover:text-primary"
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
                  className={`sm:w-7 sm:h-7  ${
                    isHomepage
                      ? sticky
                        ? "text-dark"
                        : "text-white"
                      : "text-dark"
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
              <DrawerContent>
                {() => (
                  <>
                    <DrawerBody className="p-0">
                      <nav className="flex flex-col">
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
                                // Small delay to ensure drawer closes first
                                setTimeout(() => {
                                  router.push(item.href);
                                }, 100);
                              }}
                              className={`w-full text-left px-6 py-4 text-base transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                                isActive
                                  ? "text-primary bg-primary/5 border-r-2 border-r-primary font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              {item.name}
                            </button>
                          );
                        })}
                      </nav>
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                        <Link
                          href="tel:+923344111778"
                          onClick={() => setNavbarOpen(false)}
                          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                        >
                          <Icon icon="ph:phone-bold" width={20} height={20} />
                          <span>+923344111778</span>
                        </Link>
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
  );
};

export default Header;
