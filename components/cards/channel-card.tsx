"use client";

import { cn } from "@/lib/utils";
import { ChannelProps } from "@/types/channel";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { Hash } from "lucide-react";

interface ChannelCardProps {
  roomId: string;
  channel: ChannelProps;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ roomId, channel }) => {
  const pathname = usePathname();
  return (
    <Link
      href={`/chat-rooms/${roomId}/${channel.id}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        pathname === `/chat-rooms/${roomId}/${channel.id}` && "bg-accent/50",
        "mb-1 flex justify-start gap-2 rounded-[4px]",
      )}
    >
      <p className="text-sm inline-flex gap-1">
        <Hash className="w-5 h-5" />
        {channel.channelName}
      </p>
    </Link>
  );
};

export default ChannelCard;
