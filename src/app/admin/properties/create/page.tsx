"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import PropertyForm, {
  PropertyFormData,
} from "@/components/Admin/PropertyForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { createProperty } from "../actions";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

export default function CreatePropertyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (
    formData: PropertyFormData,
    uploadedImages: string[]
  ) => {
    setLoading(true);
    setError("");

    try {
      // Prepare data for database - store only image URLs
      const propertyData = {
        name: formData.name,
        slug: formData.slug,
        location: formData.location,
        rate: formData.rate,
        area: formData.area,
        area_sqft: formData.area_sqft,
        area_sqyards: formData.area_sqyards,
        area_marla: formData.area_marla,
        area_kanal: formData.area_kanal,
        beds: formData.beds,
        baths: formData.baths,
        photo_sphere: formData.photo_sphere,
        property_type: formData.property_type,
        images: uploadedImages, // Store only URLs in database
        description: formData.description,
        is_featured: formData.is_featured,
      };

      const result = await createProperty(propertyData);

      if (!result.success) {
        setError(result.error || "Failed to create property");
      } else {
        router.push("/admin/properties");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <HomeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Create New Property
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Add a new property to your portfolio
            </p>
          </div>
        </div>

        <PropertyForm
          onSubmit={handleSubmit}
          submitLabel="Create Property"
          loading={loading}
          error={error}
          onCancel={() => router.back()}
        />
      </div>
    </DashboardLayout>
  );
}
