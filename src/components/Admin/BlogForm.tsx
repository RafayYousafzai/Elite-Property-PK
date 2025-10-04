"use client";

import type React from "react";
import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Card,
  CardBody,
  Image,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import { Upload, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: File | string | null;
  author: string;
  author_image?: File | string | null;
  content: string;
  detail: string;
  tag: string;
  is_published: boolean;
  published_at: string;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (
    formData: BlogFormData,
    coverImageUrl?: string,
    authorImageUrl?: string
  ) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
  error?: string;
  onCancel?: () => void;
}

const blogTags = [
  "Tip",
  "Guide",
  "News",
  "Market Update",
  "Investment",
  "Legal",
  "Design",
  "General",
];

export default function BlogForm({
  initialData,
  onSubmit,
  submitLabel = "Save Blog",
  loading = false,
  error = "",
  onCancel,
}: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    cover_image: null,
    author: "",
    author_image: null,
    content: "",
    detail: "",
    tag: "General",
    is_published: true,
    published_at: new Date().toISOString().split("T")[0],
    ...initialData,
  });

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    typeof initialData?.cover_image === "string"
      ? initialData.cover_image
      : null
  );

  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(
    typeof initialData?.author_image === "string"
      ? initialData.author_image
      : null
  );

  const [uploadingImages, setUploadingImages] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      cover_image: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAuthorImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      author_image: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAuthorImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      cover_image: null,
    }));
    setCoverImagePreview(null);
  };

  const removeAuthorImage = () => {
    setFormData((prev) => ({
      ...prev,
      author_image: null,
    }));
    setAuthorImagePreview(null);
  };

  const uploadImageToSupabase = async (
    image: File | string | null,
    folder: string
  ): Promise<string | undefined> => {
    if (!image) return undefined;

    // If already a URL, return it
    if (typeof image === "string") return image;

    // Upload new file
    const supabase = createClient();
    const fileExt = image.name.split(".").pop() ?? "jpg";
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(filePath, image);

    if (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Failed to upload image: ${image.name}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploadingImages(true);

      // Upload images
      const coverImageUrl = await uploadImageToSupabase(
        formData.cover_image || null,
        "blog-covers"
      );
      const authorImageUrl = await uploadImageToSupabase(
        formData.author_image || null,
        "blog-authors"
      );

      // Call parent's onSubmit
      await onSubmit(formData, coverImageUrl, authorImageUrl);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {(loading || uploadingImages) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Spinner size="lg" color="primary" />
            <p className="text-lg font-semibold">
              {uploadingImages ? "Uploading images..." : "Saving blog..."}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto space-y-12 p-8"
      >
        {/* Basic Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Basic Information</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          <Card className="p-4">
            <CardBody className="space-y-6">
              <Input
                label="Title *"
                placeholder="Enter blog title"
                value={formData.title}
                onValueChange={handleTitleChange}
                size="lg"
                isRequired
              />

              <Input
                label="URL Slug *"
                placeholder="blog-url-slug"
                value={formData.slug}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, slug: value }))
                }
                size="lg"
                description="This will be used in the blog URL"
                isRequired
              />

              <Textarea
                label="Excerpt"
                placeholder="Brief description of the blog post"
                value={formData.excerpt}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, excerpt: value }))
                }
                minRows={2}
                size="lg"
              />

              <Textarea
                label="Detail"
                placeholder="Detailed summary that appears below the title"
                value={formData.detail}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, detail: value }))
                }
                minRows={3}
                size="lg"
              />
            </CardBody>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Content</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          <Card className="p-4">
            <CardBody className="space-y-6">
              <Textarea
                label="Blog Content (Markdown) *"
                placeholder="Write your blog content in markdown format..."
                value={formData.content}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                minRows={15}
                size="lg"
                description="Supports markdown formatting (headings, lists, bold, italic, etc.)"
                isRequired
              />
            </CardBody>
          </Card>
        </div>

        {/* Author & Category */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Author & Category</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          <Card className="p-4">
            <CardBody className="space-y-6">
              <Input
                label="Author Name *"
                placeholder="Enter author name"
                value={formData.author}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, author: value }))
                }
                size="lg"
                isRequired
              />

              <Select
                label="Tag"
                placeholder="Select a tag"
                selectedKeys={[formData.tag]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  setFormData((prev) => ({
                    ...prev,
                    tag: selected as string,
                  }));
                }}
                size="lg"
              >
                {blogTags.map((tag) => (
                  <SelectItem key={tag}>{tag}</SelectItem>
                ))}
              </Select>
            </CardBody>
          </Card>
        </div>

        {/* Images */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Images</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          <Card className="p-4">
            <CardBody className="space-y-8">
              {/* Cover Image */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-foreground-500">
                  Cover Image
                </label>
                <div className="bg-default-100 rounded-xl p-12 text-center hover:bg-default-200 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    id="cover-image-upload"
                  />
                  <label
                    htmlFor="cover-image-upload"
                    className="cursor-pointer"
                  >
                    <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold mb-2">
                      Click to upload cover image
                    </p>
                    <p className="text-sm text-foreground-500">
                      JPG, JPEG or PNG
                    </p>
                  </label>
                </div>

                {coverImagePreview && (
                  <div className="relative group">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onClick={removeCoverImage}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Author Image */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-foreground-500">
                  Author Image
                </label>
                <div className="bg-default-100 rounded-xl p-12 text-center hover:bg-default-200 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleAuthorImageUpload}
                    className="hidden"
                    id="author-image-upload"
                  />
                  <label
                    htmlFor="author-image-upload"
                    className="cursor-pointer"
                  >
                    <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold mb-2">
                      Click to upload author image
                    </p>
                    <p className="text-sm text-foreground-500">
                      JPG, JPEG or PNG
                    </p>
                  </label>
                </div>

                {authorImagePreview && (
                  <div className="relative group w-32 mx-auto">
                    <Image
                      src={authorImagePreview}
                      alt="Author preview"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      onClick={removeAuthorImage}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Publishing Settings */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Publishing</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          <Card className="p-4">
            <CardBody className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">Publish Status</p>
                  <p className="text-sm text-foreground-500">
                    Make this blog post visible to the public
                  </p>
                </div>
                <Switch
                  isSelected={formData.is_published}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, is_published: value }))
                  }
                  size="lg"
                />
              </div>

              <Input
                type="date"
                label="Published Date"
                value={formData.published_at}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, published_at: value }))
                }
                size="lg"
              />
            </CardBody>
          </Card>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end pt-6">
          {onCancel && (
            <Button
              size="lg"
              variant="bordered"
              onPress={onCancel}
              className="font-semibold"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={loading || uploadingImages}
            className="font-semibold px-12"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
