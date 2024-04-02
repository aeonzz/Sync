import PostSkeleton from "@/components/loaders/post-skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="min-h-[400px] w-[550px]">
      <PostSkeleton />
    </div>
  );
};

export default loading;
