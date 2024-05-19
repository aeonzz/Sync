import React from "react";
import { Skeleton } from "../ui/skeleton";

const EventSkeleton = () => {
  return (
    <div className="flex h-[144px] w-full items-center space-x-3 p-3 pt-5">
      <Skeleton className="aspect-square h-[120px]" />
      <div className="h-full w-full space-y-2">
        <div className="space-y-1">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[80%]" />
        </div>
        <div className="flex space-x-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
};

export default EventSkeleton;
