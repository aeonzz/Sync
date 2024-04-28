import React from "react";
import { Skeleton } from "../ui/skeleton";

const ChatSkeleton = () => {
  return (
    <div className="flex h-14 w-full items-center p-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-sm" />
          <Skeleton className="h-3 w-28 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
