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

  return (
    <>
      {channel.members.map(
        (member) =>
          member.user.id !== currentUserId && (
            <Link
              href={`/chat-rooms/c/${channel.id}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === `/chat-rooms/c/${channel.id}` && "bg-accent/50",
                "flex justify-start gap-2 py-7",
              )}
            >
              <Avatar>
                <AvatarImage
                  src={member.user.avatarUrl ?? undefined}
                  className="object-cover"
                  alt={member.user.avatarUrl ?? undefined}
                />
                <AvatarFallback>
                  {member.user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs">{member.user.username}</p>
            </Link>
          ),
      )}
    </>
  );
};

export default ChatCard;
