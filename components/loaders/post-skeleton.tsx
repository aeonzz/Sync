import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="mt-3 flex w-[550px] h-screen">
      <div className="h-fit w-full p-5 rounded-md border">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-1 h-3 w-10" />
          </div>
        </div>
        <Skeleton className="mt-2 ml-1 h-3 w-[50%]" />
        <div className="flex h-44 w-full gap-2">
          <Skeleton className="mt-3 flex-1" />
          <Skeleton className="mt-3 flex-1" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
