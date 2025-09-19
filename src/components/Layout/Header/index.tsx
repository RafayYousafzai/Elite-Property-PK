"use client";
import { navLinks } from "@/app/api/navlink";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import NavLink from "./Navigation/NavLink";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

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

  const isHomepage = pathname === "/";

  return (
    <header
      className={`fixed h-24 py-1 z-50 w-full transition-all duration-300 lg:px-0 px-4  ${
        sticky
          ? "top-0 bg-white dark:bg-dark shadow-md"
          : "top-1 bg-transparent "
      }  ${hidden ? "-translate-y-full" : "translate-y-0 "}`}
    >
      <nav
        className={`w-auto mx-auto max-w-8xl flex items-center justify-between py-4 duration-300 ${
          sticky ? " dark:bg-dark top-5 px-4 " : "shadow-none top-0"
        }`}
      >
        <div className="flex justify-between items-center gap-2 w-full">
          <div>
            <Link href="/">
              <Image
                src={"/images/header/dark-logo.svg"}
                alt="logo"
                width={150}
                height={68}
                unoptimized={true}
                className={`${
                  isHomepage
                    ? sticky
                      ? "block dark:hidden"
                      : "hidden"
                    : sticky
                    ? "block dark:hidden"
                    : "block dark:hidden"
                }`}
              />
              <Image
                src={"/images/header/logo.svg"}
                alt="logo"
                width={150}
                height={68}
                unoptimized={true}
                className={`${
                  isHomepage
                    ? sticky
                      ? "hidden dark:block"
                      : "block"
                    : sticky
                    ? "dark:block hidden"
                    : "dark:block hidden"
                }`}
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <Button
              isIconOnly
              className="bg-transparent hover:cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Icon
                icon={"solar:sun-bold"}
                width={32}
                height={32}
                className={`dark:hidden block ${
                  isHomepage
                    ? sticky
                      ? "text-dark"
                      : "text-white"
                    : "text-dark"
                }`}
              />
              <Icon
                icon={"solar:moon-bold"}
                width={32}
                height={32}
                className="dark:block hidden text-white"
              />
            </Button>
            <div className={`hidden md:block`}>
              <Link
                href="#"
                className={`text-base text-inherit flex items-center gap-2 border-r pr-6 ${
                  isHomepage
                    ? sticky
                      ? "text-dark dark:text-white hover:text-primary border-dark dark:border-white"
                      : "text-white hover:text-primary"
                    : "text-dark hover:text-primary"
                }`}
              >
                <Icon icon={"ph:phone-bold"} width={24} height={24} />
                +1-212-456-789
              </Link>
            </div>

            <div className="md:hidden" ref={sideMenuRef}>
              <Button
                onClick={() => setNavbarOpen(true)}
                className={`flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${
                  isHomepage
                    ? sticky
                      ? "text-white bg-dark dark:bg-white dark:text-dark dark:hover:text-white dark:hover:bg-dark hover:text-dark hover:bg-white border-dark dark:border-white"
                      : "text-dark bg-white dark:text-dark hover:bg-transparent hover:text-white border-white"
                    : "bg-dark text-white hover:bg-transparent hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-transparent dark:hover:text-white duration-300"
                }`}
                aria-label="Toggle mobile menu"
              >
                <span>
                  <Icon icon={"ph:list"} width={24} height={24} />
                </span>
                <span className="hidden sm:block">Menu</span>
              </Button>
            </div>
            <Drawer
              isOpen={navbarOpen}
              onOpenChange={() => setNavbarOpen(!navbarOpen)}
            >
              <DrawerContent>
                {(onClose) => (
                  <>
                    <DrawerHeader className="flex flex-col gap-1">
                      Drawer Title
                    </DrawerHeader>
                    <DrawerBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                    </DrawerBody>
                    <DrawerFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </DrawerFooter>
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
