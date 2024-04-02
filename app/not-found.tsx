"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <section className="flex h-screen items-center justify-center bg-[#0C0C0C]">
      <div
        className={cn(className, "max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16")}
      >
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-white">
            404
          </h1>
          <p className="mb-4 text-2xl font-bold tracking-tight text-white">
            Something&apos;s missing.
          </p>
          <p className="text-md mb-4 font-light text-muted-foreground">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.{" "}
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-primary-600 hover:bg-primary-800 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white"
          >
            Go back
          </Button>
        </div>
      </div>
    </section>
  );
}
