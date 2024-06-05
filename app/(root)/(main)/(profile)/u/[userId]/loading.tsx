import Loader from "@/components/loaders/loader";
import React from "react";

const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader />
    </div>
  );
};

export default loading;
