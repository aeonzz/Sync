import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="mt-4 flex w-[550px] flex-col gap-4 px-1">
      <div className=" h-[450px] w-full px-5 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-1 h-3 w-10" />
          </div>
        </div>
        <div className="flex h-44 w-full gap-2">
          <Skeleton className="mt-[20px] flex-1" />
          <Skeleton className="mt-[20px] flex-1" />
        </div>
        <Skeleton className="mt-3 h-5 w-[50%]" />
      </div>
    </div>
  );
};

export default PostSkeleton;
