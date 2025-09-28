"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PropertyImage {
  src: string;
}

interface PropertyFormData {
  name: string;
  slug: string;
  location: string;
  rate: string;
  area: number;
  beds?: number;
  baths?: number;
  photo_sphere?: string;
  property_type: "house" | "apartment" | "plot";
  images: PropertyImage[];
  description?: string;
  is_featured: boolean;
}

export default function EditPropertyPage() {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    slug: "",
    location: "",
    rate: "",
    area: 0,
    beds: undefined,
    baths: undefined,
    photo_sphere: "",
    property_type: "house",
    images: [],
    description: "",
    is_featured: false,
  });
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

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
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            location: data.location || "",
            rate: data.rate || "",
            area: data.area || 0,
            beds: data.beds,
            baths: data.baths,
            photo_sphere: data.photo_sphere || "",
            property_type: data.property_type || "house",
            images: data.images || [],
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

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { src: imageInput.trim() }],
      }));
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase
        .from("properties")
        .update(formData)
        .eq("id", propertyId);

      if (error) {
        setError(error.message);
      } else {
        router.push("/admin/properties");
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Property</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow px-6 py-8 rounded-lg"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 570,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.rate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (sq ft) *
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.area || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    area: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.property_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    property_type: e.target.value as
                      | "house"
                      | "apartment"
                      | "plot",
                  }))
                }
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="plot">Plot</option>
              </select>
            </div>

            {(formData.property_type === "house" ||
              formData.property_type === "apartment") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.beds || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        beds: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.baths || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        baths: parseInt(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                360° Photo Sphere URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/360-photo.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.photo_sphere || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    photo_sphere: e.target.value,
                  }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter a detailed description of the property..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_featured: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="featured"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <span className="text-yellow-500 mr-1">⭐</span>
                  Featured Property
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Featured properties will be highlighted in the listings
              </p>
            </div>
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <div className="flex space-x-2 mb-4">
              <input
                type="url"
                placeholder="Enter image URL"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Image
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image.src}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      width={96}
                      height={96}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
