import React from "react";
import { Skeleton } from "../ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="mt-3 flex items-center justify-between pr-4">
        <div className="flex w-1/2 flex-col gap-2">
          <div className="flex w-full gap-2">
            <Skeleton className="h-7 w-8 rounded-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="flex w-full space-x-2 pl-9">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between pr-4">
        <div className="flex w-1/2 flex-col gap-2">
          <div className="flex w-full gap-2">
            <Skeleton className="h-7 w-8 rounded-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="flex w-full space-x-2 pl-9">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between pr-4">
        <div className="flex w-1/2 flex-col gap-2">
          <div className="flex w-full gap-2">
            <Skeleton className="h-7 w-8 rounded-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="flex w-full space-x-2 pl-9">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between pr-4">
        <div className="flex w-1/2 flex-col gap-2">
          <div className="flex w-full gap-2">
            <Skeleton className="h-7 w-8 rounded-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="flex w-full space-x-2 pl-9">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between pr-4">
        <div className="flex w-1/2 flex-col gap-2">
          <div className="flex w-full gap-2">
            <Skeleton className="h-7 w-8 rounded-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="flex w-full space-x-2 pl-9">
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 flex-1" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  );
};

export default CommentSkeleton;
