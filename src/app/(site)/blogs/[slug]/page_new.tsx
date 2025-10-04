import { getBlogBySlug } from "@/app/admin/blogs/actions";
import markdownToHtml from "@/components/utils/markdownToHtml";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const data = await params;
  const result = await getBlogBySlug(data.slug);

  const siteName = process.env.SITE_NAME || "Elite Property";
  const authorName = process.env.AUTHOR_NAME || "Elite Property Team";

  if (result.success && result.data) {
    const blog = result.data;
    const metadata = {
      title: `${blog.title || "Blog Post"} | ${siteName}`,
      description: blog.excerpt || blog.detail || "",
      author: blog.author || authorName,
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };

    return metadata;
  } else {
    return {
      title: "Not Found",
      description: "No blog article has been found",
      author: authorName,
      robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
          index: false,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }
}

export default async function Post({ params }: PageProps) {
  const data = await params;
  const result = await getBlogBySlug(data.slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const blog = result.data;
  const content = await markdownToHtml(blog.content || "");

  return (
    <>
      <section className="relative !pt-44 pb-0!">
        <div className="container max-w-8xl mx-auto md:px-0 px-4">
          <div>
            <div>
              <Link
                href="/blogs"
                className="flex items-center gap-3 text-white bg-primary py-3 px-4 rounded-full w-fit hover:bg-dark duration-300"
              >
                <Icon
                  icon={"ph:arrow-left"}
                  width={20}
                  height={20}
                  className=""
                />
                <span>Go Back</span>
              </Link>
              <h2 className="text-dark dark:text-white md:text-52 text-40 leading-[1.2] font-semibold pt-7">
                {blog.title}
              </h2>
              <h6 className="text-xm mt-5 text-dark dark:text-white">
                {blog.detail}
              </h6>
            </div>
            <div className="flex items-center justify-between gap-6 mt-12">
              <div className="flex items-center gap-4">
                {blog.author_image && (
                  <Image
                    src={blog.author_image}
                    alt={blog.author}
                    className="bg-no-repeat bg-contain inline-block rounded-full !w-12 !h-12 object-cover"
                    width={48}
                    height={48}
                    quality={100}
                    unoptimized={true}
                  />
                )}
                <div>
                  <span className="text-xm text-dark dark:text-white">
                    {blog.author}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-4">
                  <Icon icon={"ph:clock"} width={20} height={20} className="" />
                  <span className="text-base text-dark font-medium dark:text-white">
                    {format(new Date(blog.published_at), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="py-2.5 px-5 bg-dark/5 rounded-full dark:bg-white/15">
                  <p className="text-sm font-semibold text-dark dark:text-white">
                    {blog.tag || "General"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {blog.cover_image && (
            <div className="z-20 mt-12 overflow-hidden rounded">
              <Image
                src={blog.cover_image}
                alt={blog.title}
                width={1170}
                height={766}
                quality={100}
                className="h-full w-full object-cover object-center rounded-3xl"
                unoptimized={true}
              />
            </div>
          )}
        </div>
      </section>
      <section className="pt-12!">
        <div className="container max-w-8xl mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="blog-details markdown xl:pr-10">
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
