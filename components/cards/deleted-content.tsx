import React from "react";

const DeletedContent = () => {
  return (
    <div className="flex h-[calc(100vh-54px)] flex-col items-center justify-center px-4 md:px-6">
      <div className="max-w-md space-y-4 text-center mb-[54px]">
        <h1 className="text-2xl font-bold">Content Deleted</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The content you were trying to access has been deleted and is no
          longer available.
        </p>
      </div>
    </div>
  );
};

export default DeletedContent;
