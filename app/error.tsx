"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-stone-950">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-50">
          Oops! Something went wrong.
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          We&apos;re sorry, but the page you were trying to access is not available.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
