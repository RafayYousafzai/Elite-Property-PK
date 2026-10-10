import BlogList from "@/components/Blog/BlogListServer";
import HeroSub from "@/components/shared/HeroSub";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DHA Islamabad Real Estate Blog – Prices, Guides & Market News",
  description:
    "Guides and market updates on buying, selling and investing in DHA Islamabad and Rawalpindi property, from the advisors at Elite Property Exchange.",
  alternates: { canonical: "/blogs" },
};

const Blog = () => {
  return (
    <>
      <HeroSub
        title="DHA Islamabad real estate insights"
        description="Stay ahead in the property market with expert advice and updates."
        badge="Blog"
      />
      <BlogList />
    </>
  );
};

export default Blog;
