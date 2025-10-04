import React from "react";
import BlogCard from "@/components/shared/Blog/blogCard";
import { getAllBlogs } from "@/app/admin/blogs/actions";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  author: string;
  author_image?: string;
  tag?: string;
  published_at: string;
}

const BlogListServer = async () => {
  // Fetch published blogs from database
  const result = await getAllBlogs(false); // Only published
  const dbBlogs: Blog[] = result.success && result.data ? result.data : [];

  // Transform database blogs to match BlogCard interface
  const blogs = dbBlogs.map((blog) => ({
    title: blog.title,
    date: blog.published_at,
    excerpt: blog.excerpt || "",
    coverImage: blog.cover_image || "/images/blog/placeholder.jpg",
    slug: blog.slug,
    detail: blog.excerpt || "",
    tag: blog.tag || "General",
  }));

  return (
    <section className="pt-0!">
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog, i) => (
              <div key={i} className="w-full">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-dark/50 dark:text-white/50 text-lg">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListServer;
