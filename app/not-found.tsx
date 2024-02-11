import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        className,
        "mt-24 max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16",
      )}
    >
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight">
          404
        </h1>
        <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Something&apos;s missing.
        </p>
        <p className="text-md mb-4 font-light text-gray-500 dark:text-gray-400">
          Sorry, we can&apos;t find that page. You&apos;ll find lots to explore
          on the home page.{" "}
        </p>
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-800 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-black dark:text-white"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
