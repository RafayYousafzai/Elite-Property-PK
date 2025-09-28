import DashboardLayout from "@/components/Admin/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  BuildingOfficeIcon,
  HomeIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendValue,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: "up" | "down";
  trendValue?: string;
}) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
    style={{
      animation: "fadeInUp 0.6s ease-out forwards",
    }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && trendValue && (
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1 animate-bounce" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trendValue}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              vs last month
            </span>
          </div>
        )}
      </div>
      <div
        className={`p-3 rounded-xl ${color} transform transition-transform duration-200 hover:scale-110`}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
  </div>
);

const ActionCard = ({
  title,
  description,
  icon: Icon,
  href,
  bgColor,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  bgColor: string;
}) => (
  <Link href={href}>
    <div
      className={`${bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer border border-opacity-20`}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-xl bg-white/10 bg-opacity-20`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white ml-4">{title}</h3>
      </div>
      <p className="text-white text-opacity-90 text-sm">{description}</p>
    </div>
  </Link>
);

export default async function AdminDashboard() {
  const supabase = await createClient(cookies());

  // Get total properties count
  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact" });

  // Get properties by type
  const { data: houses } = await supabase
    .from("properties")
    .select("id", { count: "exact" })
    .eq("type", "house");

  const { data: apartments } = await supabase
    .from("properties")
    .select("id", { count: "exact" })
    .eq("type", "apartment");

  const { data: plots } = await supabase
    .from("properties")
    .select("id", { count: "exact" })
    .eq("type", "plot");

  // Get recent properties
  const { data: recentProperties } = await supabase
    .from("properties")
    .select("id, title, created_at, type, price")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back! Here&apos;s what&apos;s happening with your
              properties today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              System Online
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Properties"
            value={propertiesCount || 0}
            icon={BuildingOfficeIcon}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Houses"
            value={houses?.length || 0}
            icon={HomeIcon}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Apartments"
            value={apartments?.length || 0}
            icon={BuildingOffice2Icon}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            trend="down"
            trendValue="-3%"
          />
          <StatCard
            title="Plots"
            value={plots?.length || 0}
            icon={MapPinIcon}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            trend="up"
            trendValue="+15%"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              title="Create Property"
              description="Add a new property to your portfolio with our easy-to-use form"
              icon={PlusIcon}
              href="/admin/properties/create"
              bgColor="bg-gradient-to-r from-blue-500 to-purple-600"
            />
            <ActionCard
              title="View Properties"
              description="Browse and manage all your existing properties in one place"
              icon={EyeIcon}
              href="/admin/properties"
              bgColor="bg-gradient-to-r from-green-500 to-teal-600"
            />
            <ActionCard
              title="Analytics"
              description="View detailed insights and performance metrics"
              icon={ChartBarIcon}
              href="/admin/analytics"
              bgColor="bg-gradient-to-r from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Properties
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest properties added to your portfolio
              </p>
            </div>
            <div className="p-6">
              {recentProperties && recentProperties.length > 0 ? (
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <HomeIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {property.type} • Added{" "}
                            {new Date(property.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${property.price?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No properties yet
                  </p>
                  <Link
                    href="/admin/properties/create"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Create your first property →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Metrics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Key performance indicators
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Views This Month
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  2,847
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Inquiries
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  142
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <ChartBarIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Conversion Rate
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  12.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
