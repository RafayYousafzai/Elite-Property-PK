"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import LocationAutocomplete from "@/components/shared/LocationAutocomplete";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  LinkIcon,
  CloudArrowUpIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

interface PropertyImage {
  src: string;
  type?: "url" | "file";
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

export default function CreatePropertyPage() {
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
  const [error, setError] = useState("");
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [sphereInputType, setSphereInputType] = useState<"url" | "file">("url");

  const router = useRouter();
  const supabase = createClient();

  // Auto-generate slug from name
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
        images: [...prev.images, { src: imageInput.trim(), type: "url" }],
      }));
      setImageInput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData((prev) => ({
              ...prev,
              images: [
                ...prev.images,
                { src: event.target!.result as string, type: "file" },
              ],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Clear the input
    e.target.value = "";
  };

  const handleSphereFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            photo_sphere: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
    // Clear the input
    e.target.value = "";
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
        .insert([formData])
        .select();

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

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 px-8 py-10 rounded-2xl"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter property name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="property-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <LocationAutocomplete
                value={formData.location}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
                placeholder="Enter property location"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 570,000"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.rate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Area (sq ft) *
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.area || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    area: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Enter area in sq ft"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Type *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                <option value="house">🏠 House</option>
                <option value="apartment">🏢 Apartment</option>
                <option value="plot">📍 Plot</option>
              </select>
            </div>

            {(formData.property_type === "house" ||
              formData.property_type === "apartment") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.beds || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        beds: parseInt(e.target.value) || undefined,
                      }))
                    }
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.baths || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        baths: parseInt(e.target.value) || undefined,
                      }))
                    }
                    placeholder="Number of bathrooms"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                360° Photo Sphere
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add a 360° panoramic image by uploading a file or providing a
                URL.
              </p>

              {/* Toggle between URL and File upload for 360 sphere */}
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setSphereInputType("url")}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                    sphereInputType === "url"
                      ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setSphereInputType("file")}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                    sphereInputType === "file"
                      ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  Upload
                </button>
              </div>

              {/* URL Input for 360 sphere */}
              {sphereInputType === "url" && (
                <input
                  type="url"
                  placeholder="https://example.com/360-photo.jpg"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  value={formData.photo_sphere || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      photo_sphere: e.target.value,
                    }))
                  }
                />
              )}

              {/* File Upload for 360 sphere */}
              {sphereInputType === "file" && (
                <div>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-300 dark:border-purple-600 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PhotoIcon className="w-8 h-8 mb-2 text-purple-500 dark:text-purple-400" />
                        <p className="mb-2 text-sm text-purple-600 dark:text-purple-400">
                          <span className="font-semibold">
                            Click to upload 360° image
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-purple-500 dark:text-purple-400">
                          Panoramic JPG, PNG or WebP (Recommended: 4K
                          resolution)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleSphereFileUpload}
                      />
                    </label>
                  </div>
                  {formData.photo_sphere && (
                    <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PhotoIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                            360° image uploaded
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              photo_sphere: "",
                            }))
                          }
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Property Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter a detailed description of the property..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
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
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <input
                  type="checkbox"
                  id="featured"
                  className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500 dark:border-yellow-700 dark:bg-yellow-900"
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
                  className="flex items-center text-sm font-medium text-yellow-800 dark:text-yellow-200"
                >
                  <span className="text-yellow-500 mr-2">⭐</span>
                  Featured Property
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Featured properties will be highlighted in the listings and get
                more visibility
              </p>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Property Images
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add images by uploading files or providing URLs. You can use
                both methods.
              </p>

              {/* Toggle between URL and File upload */}
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setImageInputType("url")}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                    imageInputType === "url"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Add by URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputType("file")}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                    imageInputType === "file"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Upload Files
                </button>
              </div>

              {/* URL Input */}
              {imageInputType === "url" && (
                <div className="flex space-x-3 mb-4">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Image
                  </button>
                </div>
              )}

              {/* File Upload */}
              {imageInputType === "file" && (
                <div className="mb-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PhotoIcon className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, JPEG or WebP (MAX. 10MB each)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={image.src}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-200"
                          width={96}
                          height={96}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        {/* Image type indicator */}
                        <div className="absolute bottom-1 left-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              image.type === "file"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {image.type === "file" ? (
                              <CloudArrowUpIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <LinkIcon className="h-3 w-3 mr-1" />
                            )}
                            {image.type === "file" ? "File" : "URL"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No images added yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Add images using the options above
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
