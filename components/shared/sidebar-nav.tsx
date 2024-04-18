"use client";

import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { sidebarNav } from "@/constants/index";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import NotificationCard from "../cards/notification-card";
import { NotificationProps } from "@/types/notification";
import { ScrollArea } from "../ui/scroll-area";
import { updateAllReadStatus } from "@/lib/actions/notification.actions";
import { toast } from "sonner";
import Loader from "../loaders/loader";

interface SideBarNavProps {
  currentUserId: string;
}

const SideBarNav: React.FC<SideBarNavProps> = ({ currentUserId }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    isError,
  } = useQuery<NotificationProps[]>({
    queryFn: async () => {
      const response = await axios.get(`/api/notification/${currentUserId}`);
      return response.data.data;
    },
    queryKey: ["notifications"],
  });

  const hasActiveNotifications = notifications?.some(
    (item) => item.isRead === false,
  );

  async function handleMarkAllAsRead() {
    setIsLoading(true);
    const response = await updateAllReadStatus(currentUserId);

    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setIsLoading(false);
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
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
                <div className="relative w-auto">
                  {hasActiveNotifications && (
                    <div className="absolute left-0 top-0">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                      </span>
                    </div>
                  )}
                  <Image
                    src={item.data.icon}
                    width={28}
                    height={28}
                    alt={item.data.alt}
                    priority
                    className="mr-4 transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                  />
                </div>
                {item.data.title}
              </Button>
            );
          } else {
            return null;
          }
        })}
      </>
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerContent className="h-full w-[460px] px-2 pb-7">
          <DrawerHeader className="gap-0 pl-6">
            <DrawerTitle className="text-2xl">Notifications</DrawerTitle>
            <div className="flex w-full items-center justify-between">
              <DrawerDescription>
                View all your notifications.
              </DrawerDescription>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex h-screen flex-col">
            {isLoadingNotifications && <Loader />}
            {isError && <p className="text-center text-sm">Error fetching notifications</p>}
            {!isLoadingNotifications && (
              <>
                {notifications?.length === 0 && (
                  <p className="text-center text-sm">You have no notifications yet.</p>
                )}
                {notifications?.map((notification, index) => (
                  <NotificationCard
                    key={index}
                    notification={notification}
                    setOpen={setOpen}
                  />
                ))}
              </>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideBarNav;