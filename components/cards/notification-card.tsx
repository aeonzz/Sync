"use client";

import React from "react";
import { NotificationProps } from "@/types/notification";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { updateReadStatus } from "@/lib/actions/notification.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";

interface NotificationCardProps {
  notification: NotificationProps;
  setOpen: (state: boolean) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  setOpen,
}) => {
  const queryClient = useQueryClient();
  const trimContent = notification.text.slice(0, 50);

  async function handleNotificationClick() {
    setOpen(false);

    const response = await updateReadStatus(notification.id);

    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Link
      href={`/f/${notification.resourceId}`}
      onClick={() => handleNotificationClick()}
      className="relative flex h-20 cursor-pointer items-center rounded-sm border-b px-6 py-2 hover:bg-accent/50"
    >
      {notification.isRead == false && (
        <div className="absolute left-1 top-1">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Avatar className="h-10 w-10 dark:border">
            <AvatarImage
              src={notification.from.avatarUrl ?? undefined}
              alt={notification.from.username ?? "No avatar"}
              className="object-cover"
            />
            <AvatarFallback className="h-10 w-10 bg-stone-900 pb-1 pr-1"></AvatarFallback>
          </Avatar>
          {notification.type === "POST" && (
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-500">
              <SquarePen className="ml-1 mt-1 h-4 w-4" />
            </div>
          )}
        </div>
        <div>
          {notification.type === "POST" && (
            <>
              <h3 className="text-sm font-semibold">
                <span className="font-light">New post from</span>{" "}
                {notification.from.username}
              </h3>
              <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                &quot;{trimContent}...&quot;
              </p>
            </>
          )}
          {notification.type === "COMMENT" && (
            <>
              <h3 className="text-sm font-semibold">
                {notification.from.username}{" "}
                <span className="font-light">commented on your post</span>
              </h3>
              <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">
                &quot;{trimContent}...&quot;
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NotificationCard;
