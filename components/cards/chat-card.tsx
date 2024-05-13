"use client";

import React, { useEffect } from "react";
import { Button, buttonVariants } from "../ui/button";
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

  useEffect(() => {
    
  }, [])

  return (
    <Link
      href={`/chat-rooms/${channel.id}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === `/chat-rooms/${channel.id}` && "bg-accent/20",
        "mb-1 flex justify-start gap-2 py-6",
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

        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500" />
        )}
      </div>
      <p className="text-sm">{chatPartner.user.username}</p>
    </Link>
  );
};

export default ChatCard;
