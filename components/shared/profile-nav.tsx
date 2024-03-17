"use client";

import { profileNav } from "@/constants";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const ProfileNav = () => {
  const pathname = usePathname();
  return (
    <div className="flex h-auto w-full flex-col space-y-2">
      {profileNav.map((item, index) => (
        <Link
          key={index}
          href={item.link}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            pathname === item.link
              ? "bg-secondary hover:bg-secondary"
              : undefined,
            "group flex w-full justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default ProfileNav;
