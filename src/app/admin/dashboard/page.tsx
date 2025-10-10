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
} from "@heroicons/react/24/outline";

export const propertyTypes = {
  Home: [
    "House",
    "flat/appartment",
    "Farm House",
    "Room",
    "Upper Portion",
    "Lower Portion",
    "Penthouse",
  ],
  Plots: [
    "Residential Plot",
    "Commercial Plot",
    "Agricultural Land",
    "Industrial Land",
    "Plot File",
    "Plot Form",
  ],
  Commercial: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"],
};

export default async function AdminDashboard() {
  const supabase = await createClient(cookies());

  const { data: allProperties } = await supabase
    .from("properties")
    .select("id, name, created_at, property_type, rate, purpose");

  const totalCount = allProperties?.length || 0;

  const homeTypes = propertyTypes.Home.map((t) => t.toLowerCase());
  const plotTypes = propertyTypes.Plots.map((t) => t.toLowerCase());
  const commercialTypes = propertyTypes.Commercial.map((t) => t.toLowerCase());

  const homesCount =
    allProperties?.filter((p) =>
      homeTypes.includes(p.property_type?.toLowerCase() || "")
    ).length || 0;

  const plotsCount =
    allProperties?.filter((p) =>
      plotTypes.includes(p.property_type?.toLowerCase() || "")
    ).length || 0;

  const commercialCount =
    allProperties?.filter((p) =>
      commercialTypes.includes(p.property_type?.toLowerCase() || "")
    ).length || 0;

  const typeBreakdown: Record<string, number> = {};
  Object.entries(propertyTypes).forEach(([, types]) => {
    types.forEach((type) => {
      const count =
        allProperties?.filter(
          (p) => p.property_type?.toLowerCase() === type.toLowerCase()
        ).length || 0;
      if (count > 0) {
        typeBreakdown[type] = count;
      }
    });
  });

  const recentProperties = allProperties
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const forSale =
    allProperties?.filter((p) => p.purpose === "Sell").length || 0;
  const forRent =
    allProperties?.filter((p) => p.purpose === "Rent").length || 0;

  const prices = allProperties?.map((p) => p.rate).filter((p) => p) || [];
  const avgPrice = prices.length
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Property management overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/properties"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 font-medium">
                  Total Properties
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {totalCount}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <BuildingOfficeIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-100 font-medium">Homes</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {homesCount}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <HomeIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100 font-medium">Plots</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {plotsCount}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <MapPinIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100 font-medium">
                  Commercial
                </p>
                <p className="text-4xl font-bold text-white mt-2">
                  {commercialCount}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <BuildingOffice2Icon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/properties/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center text-white">
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm mr-4">
                <PlusIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Add Property</h3>
                <p className="text-sm text-white/90 mt-1">Create new listing</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/properties"
            className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center text-white">
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm mr-4">
                <EyeIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">View All</h3>
                <p className="text-sm text-white/90 mt-1">Manage properties</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Property Types</h2>
            <Link
              href="/admin/properties"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
            >
              View All →
            </Link>
          </div>
          {Object.keys(typeBreakdown).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(typeBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {type}
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No properties found
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Purpose Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">For Sale</span>
                  <span className="text-sm font-bold">
                    {forSale} (
                    {totalCount > 0
                      ? ((forSale / totalCount) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full shadow-sm transition-all duration-500"
                    style={{
                      width: `${
                        totalCount > 0 ? (forSale / totalCount) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">For Rent</span>
                  <span className="text-sm font-bold">
                    {forRent} (
                    {totalCount > 0
                      ? ((forRent / totalCount) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-sm transition-all duration-500"
                    style={{
                      width: `${
                        totalCount > 0 ? (forRent / totalCount) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Category Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Homes</span>
                  <span className="text-sm font-bold">
                    {homesCount} (
                    {totalCount > 0
                      ? ((homesCount / totalCount) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-sm transition-all duration-500"
                    style={{
                      width: `${
                        totalCount > 0 ? (homesCount / totalCount) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Plots</span>
                  <span className="text-sm font-bold">
                    {plotsCount} (
                    {totalCount > 0
                      ? ((plotsCount / totalCount) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full shadow-sm transition-all duration-500"
                    style={{
                      width: `${
                        totalCount > 0 ? (plotsCount / totalCount) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Commercial</span>
                  <span className="text-sm font-bold">
                    {commercialCount} (
                    {totalCount > 0
                      ? ((commercialCount / totalCount) * 100).toFixed(1)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full shadow-sm transition-all duration-500"
                    style={{
                      width: `${
                        totalCount > 0
                          ? (commercialCount / totalCount) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Properties</h3>
              <Link
                href="/admin/properties"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            {recentProperties && recentProperties.length > 0 ? (
              <div className="space-y-3">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                        {property.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {property.property_type} • {property.purpose}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 ml-4">
                      {property.rate
                        ? `PKR ${property.rate.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No properties yet</p>
                <Link
                  href="/admin/properties/create"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  Add your first property →
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm">
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Average Price
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-white mt-1">
                    PKR{" "}
                    {avgPrice > 0
                      ? avgPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      : "0"}
                  </p>
                </div>
                <div className="p-4 bg-blue-500 rounded-xl shadow-md">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-sm">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    For Sale
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-white mt-1">
                    {forSale}
                  </p>
                </div>
                <div className="p-4 bg-green-500 rounded-xl shadow-md">
                  <HomeIcon className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-sm">
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    For Rent
                  </p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-white mt-1">
                    {forRent}
                  </p>
                </div>
                <div className="p-4 bg-purple-500 rounded-xl shadow-md">
                  <MapPinIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
