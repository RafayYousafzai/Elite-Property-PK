"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import PropertyForm, {
  PropertyFormData,
} from "@/components/Admin/PropertyForm";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { updateProperty } from "../../actions";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

export default function EditPropertyPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<Partial<PropertyFormData>>({});

  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const propertyId = params.id as string;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (error) {
          setError(error.message);
        } else if (data) {
          // Convert images array to the format expected by PropertyForm
          const images = Array.isArray(data.images)
            ? data.images.map((url: string) => ({
                src: url,
                type: "url" as const,
              }))
            : [];

          setInitialData({
            name: data.name || "",
            slug: data.slug || "",
            location: data.location || "",
            rate: data.rate || "",
            area: data.area || 0,
            area_sqft: data.area_sqft,
            area_sqyards: data.area_sqyards,
            area_marla: data.area_marla,
            area_kanal: data.area_kanal,
            beds: data.beds,
            baths: data.baths,
            photo_sphere: data.photo_sphere || "",
            property_type: data.property_type || "house",
            images: images,
            description: data.description || "",
            is_featured: data.is_featured || false,
          });
        }
      } catch {
        setError("Failed to fetch property");
      } finally {
        setFetching(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, supabase]);

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

      const result = await updateProperty(propertyId, propertyData);

      if (!result.success) {
        setError(result.error || "Failed to update property");
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

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div
                className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-2"
                style={{ animationDirection: "reverse" }}
              ></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
              Loading property details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <PencilIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Edit Property
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Update property information and details
            </p>
          </div>
        </div>

        <PropertyForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Update Property"
          loading={loading}
          error={error}
          onCancel={() => router.back()}
        />
      </div>
    </DashboardLayout>
  );
}
