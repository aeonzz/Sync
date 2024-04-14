import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProfileHoverSkeleton = () => {
  return (
    <div className="space-y-7">
      <Skeleton className="relative h-16 w-full rounded-none">
        <Skeleton className="absolute -bottom-8 left-3 h-16 w-16 rounded-full" />
      </Skeleton>
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};

export default ProfileHoverSkeleton;
