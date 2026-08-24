"use client";

import { Skeleton } from "@heroui/react";

export const PropertyCardSkeleton = () => (
  <div className="w-full">
    {/* Desktop Layout Skeleton (md:flex flex-col) */}
    <div className="hidden md:flex flex-col space-y-3.5 bg-transparent border-0 shadow-none">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-64 sm:h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />

      {/* Details Skeleton */}
      <div className="pt-1 space-y-2.5">
        {/* Title */}
        <Skeleton className="h-5 w-4/5 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />

        {/* Location & Category Pill */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <Skeleton className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Price */}
        <Skeleton className="h-6 w-2/5 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />

        {/* Specs Bar */}
        <Skeleton className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Skeleton className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <Skeleton className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>

    {/* Mobile Horizontal Layout Skeleton (Image Left, Content Right) */}
    <div className="flex md:hidden flex-row gap-3 bg-transparent rounded-2xl p-0 overflow-hidden border-0 shadow-none items-stretch">
      {/* Left Thumbnail */}
      <Skeleton className="w-36 shrink-0 h-36 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />

      {/* Right Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1.5">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <Skeleton className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <Skeleton className="h-5 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <Skeleton className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <Skeleton className="h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <Skeleton className="h-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export const PropertyListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-x-6 gap-y-5 sm:gap-x-8 sm:gap-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 pb-20">
    {Array.from({ length: count }).map((_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);
