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
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import NotificationCard from "../cards/notification-card";
import { NotificationProps } from "@/types/notification";
import { ScrollArea } from "../ui/scroll-area";
import { updateAllReadStatus } from "@/lib/actions/notification.actions";
import { toast } from "sonner";
import Loader from "../loaders/loader";
import { pusherClient } from "@/lib/pusher";

interface SideBarNavProps {
  currentUserId: string;
}

const SideBarNav: React.FC<SideBarNavProps> = ({ currentUserId }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const isChatRoom = pathname.startsWith("/chat-rooms");

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

  useEffect(() => {
    pusherClient.subscribe("notify-post");

    pusherClient.bind("incoming-notification", (data: NotificationProps) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      console.log(data)
      if (data.recipientId === currentUserId) {
        toast(<NotificationCard notification={data} setOpen={setOpen} />);
      }
    });

    return () => {
      pusherClient.unsubscribe("notify-post");
    };
  }, [currentUserId]);

  return (
    <div
      className={cn(
        isChatRoom ? "w-24" : "w-[270px]",
        "flex h-auto flex-col items-start space-y-2 p-5 transition-all duration-300",
      )}
    >
      <Link
        href="/home"
        className="mb-2 w-full scroll-m-20 pl-5 text-3xl font-semibold tracking-tight first:mt-0"
      >
        {isChatRoom ? "S" : "Sync"}
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
                  pathname.startsWith(item.data.link)
                    ? "bg-primary hover:bg-primary"
                    : undefined,
                  "group flex w-full justify-start py-6 text-base tracking-tight active:text-slate-400",
                )}
              >
                <Image
                  src={item.data.icon}
                  priority
                  width={24}
                  height={24}
                  alt={item.data.alt}
                  className="transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                />
                <span
                  className={cn(isChatRoom && "opacity-0 duration-300", "ml-4")}
                >
                  {item.data.title}
                </span>
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
                className={cn(
                  "group flex w-full justify-start py-6 text-base tracking-tight active:text-slate-400 relative",
                )}
              >
                {hasActiveNotifications && (
                  <div className="absolute left-4 top-3">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                    </span>
                  </div>
                )}
                <Image
                  src={item.data.icon}
                  width={24}
                  height={24}
                  alt={item.data.alt}
                  priority
                  className="transition-all duration-300 group-hover:scale-105 group-active:scale-95"
                />
                {!isChatRoom && <span className="ml-4">{item.data.title}</span>}
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
            {isError && (
              <p className="text-center text-sm">
                Error fetching notifications
              </p>
            )}
            {!isLoadingNotifications && (
              <>
                {notifications?.length === 0 && (
                  <p className="text-center text-sm">
                    You have no notifications yet.
                  </p>
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
