"use client";

import DashboardLayout from "@/components/Admin/DashboardLayout";
import BlogForm, { BlogFormData } from "@/components/Admin/BlogForm";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { getBlogById, updateBlog } from "../../actions";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";

export default function EditBlogPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<Partial<BlogFormData>>({});

  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await getBlogById(blogId);
        if (result.success && result.data) {
          const blog = result.data;
          setInitialData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || "",
            cover_image: blog.cover_image || null,
            author: blog.author,
            author_image: blog.author_image || null,
            content: blog.content,
            detail: blog.detail || "",
            tag: blog.tag || "General",
            is_published: blog.is_published,
            published_at: blog.published_at
              ? new Date(blog.published_at).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          });
        } else {
          setError(result.error || "Failed to fetch blog");
          toast.error(result.error || "Failed to fetch blog");
        }
      } catch {
        setError("Failed to fetch blog");
        toast.error("Failed to fetch blog");
      } finally {
        setFetching(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

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

      const result = await updateBlog(blogId, blogData);

      if (!result.success) {
        setError(result.error || "Failed to update blog");
        toast.error(result.error || "Failed to update blog");
      } else {
        toast.success("Blog updated successfully!");
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

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
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
            <NewspaperIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Edit Blog Post
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Update your blog article
            </p>
          </div>
        </div>

        <BlogForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Update Blog"
          loading={loading}
          error={error}
          onCancel={() => router.back()}
        />
      </div>
    </DashboardLayout>
  );
}
