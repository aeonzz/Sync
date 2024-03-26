"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { sidebarNav } from "@/constants/index";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Image from "next/image";

const LeftSideBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <aside
      className={cn(
        open || openSearch
          ? "-translate-x-[70%] opacity-0"
          : "translate-x-0 opacity-100",
        "sticky left-0 top-0 flex h-screen w-[270px] flex-col items-start space-y-7 p-5 transition-all duration-300",
      )}
    >
      <div className="flex h-auto w-full flex-col items-start space-y-3">
        <h2 className="w-full scroll-m-20 border-b border-stone-800 pb-4 pl-4 text-3xl font-semibold tracking-tight first:mt-0 mb-2">
          Sync
        </h2>
        <>
          {sidebarNav.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.link
                  ? "bg-primary hover:bg-primary"
                  : undefined,
                "group flex w-full justify-start py-6 text-base tracking-tight active:text-slate-400",
              )}
            >
              <Image
                src={item.icon}
                width={28}
                height={28}
                alt={item.alt}
                className="mr-4 transition-all duration-300 group-hover:scale-105 group-active:scale-95"
              />
              {item.title}
            </Link>
          ))}
        </>
      </div>
    </aside>
  );
};

export default LeftSideBar;
