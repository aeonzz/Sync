"use client";

import { UserProps } from "@/types/user";
import { Session } from "next-auth";
import Feed from "./feed";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FollowingTab from "./following-tab";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeTabs = () => {
  const pathname = usePathname()
  return (
    <div className="relative">
      <div className="sticky top-0 z-10 mb-3 flex h-16 w-full backdrop-blur-sm backdrop-filter dark:bg-background/50">
        <Link
          href="/home"
          className={cn(
            buttonVariants({ variant: "tab" }),
            pathname === "/home"
              ? "border-b border-b-primary text-foreground"
              : "text-muted-foreground",
            "h-full flex-1",
          )}
        >
          Feed
        </Link>
        <Link
          href="/home/following"
          className={cn(
            buttonVariants({ variant: "tab" }),
            pathname === "/home/following"
              ? "border-b border-b-primary text-foreground"
              : "text-muted-foreground",
            "h-full flex-1",
          )}
        >
          Following
        </Link>
      </div>
    </div>
  );
};

export default HomeTabs;
