import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PostSkeleton = () => {
  return (
    <div className="mt-4 flex w-full flex-col gap-4 px-1">
      <div className=" h-[450px] w-full px-5 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-1 h-3 w-10" />
          </div>
        </div>
        <div className="mt-[30px] flex flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[70%]" />
          <Skeleton className="h-5 w-[50%]" />
        </div>
        <div className="flex h-44 w-full gap-2">
          <Skeleton className="mt-[20px] flex-1" />
          <Skeleton className="mt-[20px] flex-1" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
