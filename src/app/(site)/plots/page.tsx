import HeroSub from "@/components/shared/HeroSub";
import PropertyPlots from "@/components/Properties/PropertyPlots";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Property List | Homely",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Property Plots."
        description="Experience elegance and comfort with our exclusive luxury Plots, designed for sophisticated living."
        badge="Properties"
      />
      <PropertyPlots />
    </>
  );
};

export default page;
