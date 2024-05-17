"use client";

import React from "react";
import { buttonVariants } from "../ui/button";
import { ChannelProps } from "@/types/channel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { useIsOnline } from "react-use-is-online";

interface ChatCardProps {
  channel: ChannelProps;
  currentUserId: string;
}

const ChatCard: React.FC<ChatCardProps> = ({ channel, currentUserId }) => {
  const { isOnline } = useIsOnline();
  const pathname = usePathname();
  const chatPartner = channel.members[0];

  return (
    <Link
      href={`/chat-rooms/me/dm/${channel.id}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === `/chat-rooms/me/dm/${channel.id}` && "bg-accent/50",
        "mb-1 flex justify-start gap-2 py-[22px] !rounded-[4px]",
      )}
    >
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={chatPartner.user.avatarUrl ?? undefined}
            className="object-cover"
            alt={chatPartner.user.avatarUrl ?? undefined}
          />
          <AvatarFallback>
            {chatPartner.user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm">{chatPartner.user.username}</p>
    </Link>
  );
};

export default ChatCard;
