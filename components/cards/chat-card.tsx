import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { ChannelProps } from "@/types/channel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";

interface ChatCardProps {
  channel: ChannelProps;
  currentUserId: string;
}

const ChatCard: React.FC<ChatCardProps> = ({ channel, currentUserId }) => {
  const pathname = usePathname();
  const chatPartner = channel.members[0];

  return (
    <Link
      href={`/chat-rooms/${channel.id}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === `/chat-rooms/${channel.id}` && "bg-accent/20",
        "flex justify-start gap-2 py-7",
      )}
    >
      <Avatar>
        <AvatarImage
          src={chatPartner.user.avatarUrl ?? undefined}
          className="object-cover"
          alt={chatPartner.user.avatarUrl ?? undefined}
        />
        <AvatarFallback>
          {chatPartner.user.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-xs">{chatPartner.user.username}</p>
    </Link>
  );
};

export default ChatCard;
