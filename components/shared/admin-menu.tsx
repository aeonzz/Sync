"use client";

import { dashboardNav } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import UserNav from "../ui/user-nav";

interface AdminMenuProps {
  currentUserId: string;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ currentUserId }) => {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-60 flex-col items-center space-y-4 px-2 py-4">
      <Link
        href="/home"
        className="w-full pl-7 text-start text-xl font-semibold tracking-tight text-muted-foreground"
      >
        Sync
      </Link>
      <div className="w-full space-y-1">
        {dashboardNav.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              pathname === item.link
                ? "bg-secondary hover:bg-secondary"
                : undefined,
              "group flex w-full justify-start py-3 text-base tracking-tight active:text-slate-400",
            )}
          >
            <Image
              src={item.icon}
              priority
              width={16}
              height={16}
              alt={item.alt}
            />
            <span className="ml-3 text-sm">{item.title}</span>
          </Link>
        ))}
      </div>
      <UserNav currentUserId={currentUserId} />
    </aside>
  );
};

export default AdminMenu;
