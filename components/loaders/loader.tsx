import { cn } from "@/lib/utils";
import React from "react";

const Loader = ({ className }: { className?: string | undefined }) => {
  return (
    <div className="flex flex-row gap-1">
      <div
        className={cn(
          className,
          "h-1.5 w-1.5 animate-bounce rounded-full bg-foreground",
        )}
      ></div>
      <div
        className={cn(
          className,
          "h-1.5 w-1.5 animate-bounce rounded-full bg-foreground [animation-delay:-.1s]",
        )}
      ></div>
      <div
        className={cn(
          className,
          "h-1.5 w-1.5 animate-bounce rounded-full bg-foreground [animation-delay:-.3s]",
        )}
      ></div>
    </div>
  );
};

export default Loader;
