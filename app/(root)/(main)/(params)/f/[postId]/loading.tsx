import PostSkeleton from "@/components/loaders/post-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="mt-10 min-h-[400px] w-full">
      <div className="flex w-full space-x-3">
        <PostSkeleton />
        <div className="flex flex-1 gap-2 pr-4">
          <Skeleton className="aspect-square h-8 w-8 rounded-full" />
          <Skeleton className="h-20 w-[calc(100%-16px)]" />
        </div>
      </div>
    </div>
  );
};

export default loading;
