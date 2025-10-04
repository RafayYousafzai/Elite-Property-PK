"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import BlogForm, { BlogFormData } from "@/components/Admin/BlogForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { createBlog } from "../actions";
import toast from "react-hot-toast";

export default function CreateBlogPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (
    formData: BlogFormData,
    coverImageUrl?: string,
    authorImageUrl?: string
  ) => {
    setLoading(true);
    setError("");

    try {
      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        cover_image: coverImageUrl,
        author: formData.author,
        author_image: authorImageUrl,
        content: formData.content,
        detail: formData.detail || undefined,
        tag: formData.tag,
        is_published: formData.is_published,
        published_at: formData.published_at,
      };

      const result = await createBlog(blogData);

      if (!result.success) {
        setError(result.error || "Failed to create blog");
        toast.error(result.error || "Failed to create blog");
      } else {
        toast.success("Blog created successfully!");
        router.push("/admin/blogs");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
            <NewspaperIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Create New Blog Post
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Write and publish a new blog article
            </p>
          </div>
        </div>

        <BlogForm
          onSubmit={handleSubmit}
          submitLabel="Create Blog"
          loading={loading}
          error={error}
          onCancel={() => router.back()}
        />
      </div>
    </DashboardLayout>
  );
}
