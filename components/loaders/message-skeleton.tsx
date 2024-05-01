import React from "react";
import { Skeleton } from "../ui/skeleton";

const MessageSkeleton = () => {
  return (
    <div className="space-y-5 my-5">
      <div className="flex items-start pl-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="flex items-start pl-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="flex items-start pl-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="flex items-start pl-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="flex items-start pl-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
