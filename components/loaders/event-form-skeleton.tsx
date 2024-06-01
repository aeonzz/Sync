import React from "react";
import { Skeleton } from "../ui/skeleton";
import Loader from "./loader";

const EventFormSkeleton = () => {
  return (
    <div className="w-ful h-full">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      <div className="flex h-3/4 w-full items-center justify-center">
        <Loader className="!bg-primary" />
      </div>
    </div>
  );
};

export default EventFormSkeleton;
