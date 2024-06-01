import React from "react";
import { Skeleton } from "../ui/skeleton";

const EventDetailsSkeleton = () => {
  return (
    <div className="h-screen w-full space-y-10">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-14 w-60" />
        <Skeleton className="mr-5 h-10 w-40" />
      </div>
      <div className="flex space-x-3">
        <div className="w-[345px] space-y-3">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-9 w-40 mt-1" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-[250px]" />
          <Skeleton className="h-3 w-[300px]" />
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;
