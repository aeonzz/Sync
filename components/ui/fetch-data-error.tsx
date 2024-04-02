"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FetchDataError() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const click = () => {
    setIsLoading(true);
    router.refresh();
  };

  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center space-y-4">
      <svg
        className=" h-8 w-8 text-red-500 dark:text-red-400"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Failed to fetch data
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        There was a problem fetching the data. Please try again.
      </p>
      <Button variant="outline" onClick={() => click()} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? <p>Retrying</p> : <p>Retry</p>}
      </Button>
    </div>
  );
}
