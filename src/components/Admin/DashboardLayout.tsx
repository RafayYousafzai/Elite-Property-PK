"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState, useMemo } from "react";
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
  NewspaperIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [profile, setProfile] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; is_read: boolean; created_at: string }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setProfile(data.user);
          } else {
            router.push("/admin/login");
          }
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Failed to load session profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (!profile) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("crm_notifications")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (!error && data) {
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel("crm-notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "crm_notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as any, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, supabase]);

  useEffect(() => {
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

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("crm_notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (!error) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = profile?.role === "admin";

  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Properties",
      href: "/admin/properties",
      icon: BuildingOfficeIcon,
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
    {
      name: "Teams",
      href: "/admin/team",
      icon: UserCircleIcon,
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: NewspaperIcon,
    },
    ...(isAdmin
      ? [
          {
            name: "CRM Agents",
            href: "/admin/agents",
            icon: UserGroupIcon,
          },
        ]
      : []),
    {
      name: "Leads CRM",
      href: "/admin/leads",
      icon: EnvelopeIcon,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-amber-100 border-t-primary rounded-full animate-spin absolute top-2 left-2 animate-pulse"></div>
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
      className={`flex min-h-screen bg-gray-50 dark:bg-gray-950 ${
        darkMode ? "dark" : ""
      }`}
    >
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

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
        <div className="flex items-center justify-between h-16 px-6 bg-primary">
          {!sidebarCollapsed && (
            <h1 className="text-white text-xl font-bold tracking-tight">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2 rounded-lg bg-transparent hover:bg-black/10 text-white transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg bg-transparent hover:bg-black/10 text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

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
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:scale-[1.01]"
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
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
                {!sidebarCollapsed && <span className="flex-1">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900">
            <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-300" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {profile?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {profile?.role === "admin" ? "Administrator" : "Agent"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 px-4 flex justify-between items-center sm:px-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1 max-w-lg mx-4 lg:mx-8"></div>

            <div className="flex items-center space-x-4">
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

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.filter((n) => !n.is_read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                      <span className="font-semibold text-sm">Notifications</span>
                      {notifications.filter((n) => !n.is_read).length > 0 && (
                        <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                          {notifications.filter((n) => !n.is_read).length} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              setShowNotifications(false);
                            }}
                            className={`p-3 text-left transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                              !notif.is_read ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                            }`}
                          >
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(notif.created_at).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-xs text-gray-500">
                          No notifications yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:scale-105"
              >
                <ArrowRightEndOnRectangleIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 w-full">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div>{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
