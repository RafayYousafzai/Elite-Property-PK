import BlogList from "@/components/Blog/BlogListServer";
import HeroSub from "@/components/shared/HeroSub";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Real Estate Blogs & Insights | Elite Property Exchange",
  description: "Stay updated with latest real estate market analysis, property investment tips, and trends in DHA Islamabad, DHA Rawalpindi, and surrounding luxury markets.",
  keywords: ["real estate blog islamabad", "property investment tips pakistan", "dha islamabad updates", "pakistan real estate news"],
};

const Blog = () => {
  return (
    <>
      <HeroSub
        title="Real estate insights."
        description="Stay ahead in the property market with expert advice and updates."
        badge="Blog"
      />
      <BlogList />
    </>
  );
};

export default Blog;
