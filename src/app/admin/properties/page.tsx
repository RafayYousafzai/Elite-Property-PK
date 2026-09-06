import DashboardLayout from "@/components/Admin/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import PropertiesList from "@/components/Admin/PropertiesList";
import { PlusIcon } from "@heroicons/react/24/outline";
import { transformDatabaseProperty } from "@/lib/supabase/properties";

const propertyTypes = {
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

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "All";
  const page = Number(resolvedParams.page) || 1;
  const search = resolvedParams.search || "";
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient(cookies());

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" });

  // Apply search filtering
  if (search) {
    query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
  }

  // Apply category filtering (case-insensitive by generating variations)
  if (category && category !== "All") {
    const types = propertyTypes[category as keyof typeof propertyTypes];
    if (types) {
      const caseVariations = Array.from(
        new Set([
          ...types,
          ...types.map((t) => t.toLowerCase()),
          ...types.map((t) => t.toUpperCase()),
          ...types.map((t) =>
            t
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ")
          ),
        ])
      );
      query = query.in("property_type", caseVariations);
    }
  }

  // Order and paginate
  const { data: properties, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching properties:", error);
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Properties Management
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage all your properties in one place
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {totalCount}
              </span>{" "}
              total properties
            </div>
            <Link
              href="/admin/properties/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Property
            </Link>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <PropertiesList
            initialProperties={(properties || []).map((p: any) =>
              transformDatabaseProperty(p)
            )}
            initialCategory={category}
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            searchQuery={search}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
