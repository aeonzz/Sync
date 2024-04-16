import React from "react";
import { Skeleton } from "../ui/skeleton";

const ReactorSkeleton = () => {
  return (
    <div className="flex h-12 w-full items-center p-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default ReactorSkeleton;
