import React from "react";
import BlogCard from "@/components/shared/Blog/blogCard";
import { getAllBlogs } from "@/app/admin/blogs/actions";
import { Icon } from "@iconify/react";
import Link from "next/link";

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

const BlogSmallServer = async () => {
  // Fetch published blogs from database
  const result = await getAllBlogs(false); // Only published
  const dbBlogs: Blog[] = result.success && result.data ? result.data : [];

  // Transform database blogs to match BlogCard interface
  const blogs = dbBlogs.slice(0, 3).map((blog) => ({
    title: blog.title,
    date: blog.published_at,
    excerpt: blog.excerpt || "",
    coverImage: blog.cover_image || "/images/blog/placeholder.jpg",
    slug: blog.slug,
    detail: blog.excerpt || "",
    tag: blog.tag || "General",
  }));

  return (
    <>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        <div className="flex justify-between md:items-end items-start mb-10 md:flex-row flex-col">
          <div>
            <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2">
              <Icon
                icon="ph:house-simple-fill"
                className="text-2xl text-primary"
                aria-label="Home icon"
              />
              Blog
            </p>
            <h2 className="lg:text-52 text-40 font-medium dark:text-white">
              Real estate insights
            </h2>
            <p className="text-dark/50 dark:text-white/50 text-xm">
              Stay ahead in the property market with expert advice and updates
            </p>
          </div>
          <Link
            href="/blogs"
            className="bg-dark dark:bg-white text-white dark:text-dark py-4 px-8 rounded-full hover:bg-primary duration-300"
            aria-label="Read all blog articles"
          >
            Read all articles
          </Link>
        </div>
        {blogs.length > 0 ? (
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-12">
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
    </>
  );
};

export default BlogSmallServer;
