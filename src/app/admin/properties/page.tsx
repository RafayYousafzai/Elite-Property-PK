import DashboardLayout from "@/components/Admin/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import PropertiesList from "@/components/Admin/PropertiesList";
import { PlusIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default async function PropertiesPage() {
  const supabase = await createClient(cookies());

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
  }

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
                {properties?.length || 0}
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
          <PropertiesList initialProperties={properties || []} />
        </div>
      </div>
    </DashboardLayout>
  );
}
