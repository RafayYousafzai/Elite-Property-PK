"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  HomeIcon,
  BuildingOfficeIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Properties",
      href: "/admin/properties",
      icon: BuildingOfficeIcon,
      // badge: 12,
    },
    {
      name: "Create Property",
      href: "/admin/properties/create",
      icon: PlusIcon,
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials",
      icon: UserCircleIcon,
    },
    // {
    //   name: "Analytics",
    //   href: "/admin/analytics",
    //   icon: ChartBarIcon,
    // },
    // {
    //   name: "Settings",
    //   href: "/admin/settings",
    //   icon: Cog6ToothIcon,
    // },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-72";

  return (
    <div
      className={`flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        fixed inset-y-0 left-0 z-50 ${sidebarWidth} 
        bg-white dark:bg-gray-900 
        shadow-xl lg:shadow-none
        transition-all duration-300 ease-in-out
        lg:static lg:inset-0
        border-r border-gray-200 dark:border-gray-700
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
          {!sidebarCollapsed && (
            <h1 className="text-white text-xl font-bold tracking-tight">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2 rounded-lg bg-transparent bg-opacity-20 hover:bg-opacity-30 text-white transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-xl
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]"
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: `slideIn 0.5s ease-out forwards`,
                }}
              >
                <item.icon
                  className={`
                  ${sidebarCollapsed ? "mx-auto" : "mr-4"} 
                  h-6 w-6 transition-colors
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                  }
                `}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 dark:from-gray-800 to-transparent">
            <div className="flex items-center p-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600">
              <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-300" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 px-4 flex justify-between items-center sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4 lg:mx-8">
              {/* <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white text-sm transition-colors"
                  placeholder="Search properties, users, or content..."
                />
              </div> */}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Notifications */}
              {/* <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">3</span>
                </span>
              </button> */}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:scale-105"
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none ">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                style={{
                  animation: "fadeInUp 0.8s ease-out forwards",
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
