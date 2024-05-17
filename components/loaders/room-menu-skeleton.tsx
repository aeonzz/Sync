import React from "react";
import { Skeleton } from "../ui/skeleton";

const RoomMenuSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full rounded-none" />
      <div className="px-3 space-y-3">
        <Skeleton className="w-14 h-3" />
        <Skeleton className="h-10 w-full rounded-[4px]" />
      </div>
    </div>
  );
};

export default RoomMenuSkeleton;
