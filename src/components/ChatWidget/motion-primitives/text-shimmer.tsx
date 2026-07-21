"use client";

import React, { memo } from "react";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export const TextShimmer = memo(function TextShimmer({
  children,
  className = "",
}: TextShimmerProps) {
  return (
    <span
      className={`inline-flex bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_2s_infinite] ${className}`}
    >
      {children}
    </span>
  );
});
