"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { sidebarNav } from "@/constants/index";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const LeftSideBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <aside className="sticky left-0 top-0 flex h-screen w-[270px] flex-col items-start space-y-7 p-5 transition-all duration-300">
      <div className="flex h-auto w-full flex-col items-start space-y-3">
        <Link
          href="/home"
          className="mb-2 w-full scroll-m-20 pl-5 text-3xl font-semibold tracking-tight first:mt-0"
        >
          Sync
        </Link>
        <>
          {sidebarNav.map((item, index) => {
            if (item.type === "link") {
              return (
                <Link
                  key={index}
                  href={item.data.link}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === item.data.link
                      ? "bg-primary hover:bg-primary"
                      : undefined,
                    "group flex w-full justify-start py-6 text-base tracking-tight active:text-slate-400",
                  )}
                >
                  <Image
                    src={item.data.icon}
                    width={28}
                    height={28}
                    alt={item.data.alt}
                    className="mr-4 transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                  />
                  {item.data.title}
                </Link>
              );
            } else if (item.type === "button") {
              return (
                <Button
                  variant="ghost"
                  key={index}
                  onClick={() => {
                    if (item.data.link === "notification") {
                      setOpen(true);
                    }
                  }}
                  className="group flex w-full justify-start py-6 text-base tracking-tight active:text-slate-400"
                >
                  <Image
                    src={item.data.icon}
                    width={28}
                    height={28}
                    alt={item.data.alt}
                    className="mr-4 transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                  />
                  {item.data.title}
                </Button>
              );
            } else {
              return null;
            }
          })}
        </>
        <Drawer open={open} onOpenChange={setOpen} direction="left">
          <DrawerContent className="h-full w-[460px]">
            
          </DrawerContent>
        </Drawer>
      </div>
    </aside>
  );
};

export default LeftSideBar;
