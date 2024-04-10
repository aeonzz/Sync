import PostSkeleton from "@/components/loaders/post-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="min-h-[400px] w-[550px] mt-16">
      <PostSkeleton />
    </div>
  );
};

export default loading;
