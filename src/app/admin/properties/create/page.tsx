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
    uploadedImages: string[],
    photo_sphere: string | undefined
  ) => {
    setLoading(true);
    setError("");
    console.log(formData, "formData");

    try {
      // Map frontend data → DB schema
      const propertyData = {
        name: formData.title,
        location: formData.location,
        rate: Number(formData.price) || 0,
        area: Number(formData.areaSize) || 0,
        beds:
          formData.propertyCategory === "Home" &&
          formData.bedrooms &&
          formData.bedrooms !== "Studio"
            ? parseInt(formData.bedrooms.replace("+", ""), 10)
            : null,
        baths:
          formData.propertyCategory === "Home" && formData.bathrooms
            ? parseInt(formData.bathrooms.replace("+", ""), 10)
            : null,
        photo_sphere: photo_sphere || null,
        property_type: (formData.propertyType || "plot").toLowerCase(),
        images: uploadedImages,
        description: formData.description || null,
        is_featured: false,

        // New fields
        purpose: formData.purpose || null,
        property_category: formData.propertyCategory || null,
        city: formData.city || null,
        area_unit: formData.areaUnit || null,
        installment_available: formData.installmentAvailable || false,
        video_url: formData.videoUrl || null,
        advance_amount: formData.advanceAmount
          ? Number(formData.advanceAmount)
          : null,
        no_of_installments: formData.noOfInstallments
          ? Number(formData.noOfInstallments)
          : null,
        monthly_installments: formData.monthlyInstallments
          ? Number(formData.monthlyInstallments)
          : null,
        constructed_covered_area: formData.constructed_covered_area
          ? Number(formData.constructed_covered_area)
          : null,
        is_sold: formData.is_sold || false,
        phase:
          formData.propertyCategory === "Plots" && formData.phase
            ? formData.phase
            : null,
        sector:
          formData.propertyCategory === "Plots" && formData.sector
            ? formData.sector
            : null,
        street:
          formData.propertyCategory === "Plots" && formData.street
            ? formData.street
            : null,

        // JSON fields
        features: formData.amenities || {},

        // Featured image is always the first image (index 0)
        featured_image_index: 0,
      };

      console.log("Sending property data:", propertyData);

      const result = await createProperty(propertyData);

      if (!result.success) {
        setError(result.error || "Failed to create property");
      } else {
        router.push("/admin/properties");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
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
