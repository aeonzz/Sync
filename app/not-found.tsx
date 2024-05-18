"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <section
      className={cn(
        className,
        "flex h-screen items-center justify-center bg-[#0C0C0C]",
      )}
    >
      <div
        className={cn(className, "max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16")}
      >
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-6xl font-extrabold tracking-tight text-white">
            404
          </h1>
          <p className="mb-4 text-xl font-bold tracking-tight text-white">
            Something&apos;s missing.
          </p>
          <p className="text-md mb-4 text-muted-foreground">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.{" "}
          </p>
          <Link
            href="/home"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
