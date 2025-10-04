"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import { PencilIcon, Upload } from "lucide-react";
import { updateTestimonial, TestimonialData } from "../../actions";
import { createClient } from "@/utils/supabase/client";

export const dynamic = "force-dynamic";

export default function EditTestimonialPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;

  const [formData, setFormData] = useState<TestimonialData>({
    name: "",
    position: "",
    review: "",
    image: "",
    is_active: true,
    display_order: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .eq("id", testimonialId)
          .single();

        if (error) {
          setError(error.message);
        } else if (data) {
          setFormData({
            name: data.name,
            position: data.position,
            review: data.review,
            image: data.image,
            is_active: data.is_active,
            display_order: data.display_order,
          });
          setImagePreview(data.image);
        }
      } catch {
        setError("Failed to fetch testimonial");
      } finally {
        setFetching(false);
      }
    };

    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId, supabase]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop() ?? "jpg";
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image: publicUrl }));
      setImagePreview(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await updateTestimonial(testimonialId, formData);

      if (!result.success) {
        setError(result.error || "Failed to update testimonial");
      } else {
        router.push("/admin/testimonials");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <PencilIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Edit Testimonial
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Update testimonial information
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardBody className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-lg font-semibold">
                  Customer Photo <span className="text-red-500">*</span>
                </label>
                {imagePreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-sm text-primary hover:underline"
                      >
                        Change Photo
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="bg-default-100 rounded-xl p-12 text-center hover:bg-default-200 transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      required
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <p className="text-lg font-semibold mb-2">
                        {uploadingImage
                          ? "Uploading..."
                          : "Click to upload photo"}
                      </p>
                      <p className="text-sm text-foreground-500">JPG or PNG</p>
                    </label>
                  </div>
                )}
              </div>

              {/* Name */}
              <Input
                label="Customer Name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                size="lg"
              />

              {/* Position */}
              <Input
                label="Position/Role"
                placeholder="e.g., Buyer, Seller, Investor"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                required
                size="lg"
              />

              {/* Review */}
              <Textarea
                label="Review/Testimonial"
                placeholder="Enter customer review..."
                value={formData.review}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, review: e.target.value }))
                }
                required
                minRows={4}
                size="lg"
              />

              {/* Display Order */}
              <Input
                label="Display Order"
                placeholder="0"
                type="number"
                value={String(formData.display_order)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    display_order: parseInt(e.target.value) || 0,
                  }))
                }
                size="lg"
              />

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="flat"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={loading || uploadingImage}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  disabled={loading || uploadingImage || !formData.image}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" color="white" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Testimonial"
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
