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
            title: data.name || "",
            location: data.location || "",
            price: String(data.rate) || "",
            areaSize: data.area || 0,
            areaUnit: data.area_unit || "Marla",
            bedrooms:
              data.beds !== null && data.beds !== undefined
                ? String(data.beds)
                : undefined,
            bathrooms:
              data.baths !== null && data.baths !== undefined
                ? String(data.baths)
                : undefined,
            propertyType: data.property_type || "house",
            propertyCategory: data.property_category || "Home",
            city: data.city || "",
            purpose: data.purpose || "Sell",
            images: images,
            description: data.description || "",
            amenities: data.features || {},
            videoUrl: data.video_url || "",
            installmentAvailable: data.installment_available || false,
            advanceAmount: data.advance_amount || undefined,
            noOfInstallments: data.no_of_installments || undefined,
            monthlyInstallments: data.monthly_installments || undefined,
            constructed_covered_area:
              data.constructed_covered_area || undefined,
            is_sold: data.is_sold || false,
            phase: data.phase || "",
            sector: data.sector || "",
            street: data.street || "",
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
    uploadedImages: string[],
    photo_sphere: string | undefined
  ) => {
    setLoading(true);
    setError("");

    try {
      // Map frontend data → DB schema (same as create page)
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
