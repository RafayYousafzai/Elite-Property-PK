import { Skeleton } from "@heroui/react";

export const PropertyCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-dark/10 dark:border-white/10">
    <div className="overflow-hidden rounded-t-2xl">
      <Skeleton className="w-full h-64 rounded-t-2xl" />
    </div>
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="flex space-x-8">
        <div className="space-y-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-18 rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
      </div>
    </div>
  </div>
);

export const PropertyListSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-10 py-6">
    {Array.from({ length: count }).map((_, index) => (
      <PropertyCardSkeleton key={index} />
    ))}
  </div>
);
