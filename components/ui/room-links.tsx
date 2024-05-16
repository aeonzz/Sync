"use client";

import { cn } from "@/lib/utils";
import { ChannelProps, RoomProps } from "@/types/channel";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "./button";
import { usePathname } from "next/navigation";

interface RoomLinksProps {
  room: RoomProps;
}

const RoomLinks: React.FC<RoomLinksProps> = ({ room }) => {
  const pathname = usePathname();
  const roomInitialName = room.roomName.charAt(0).toUpperCase();

  return (
    <Link
      href={`/chat-rooms/${room.id}/${room.channels[0].id}`}
      className={cn(
        buttonVariants({ variant: "secondary" }),
        pathname.startsWith(`/chat-rooms/${room.id}`) &&
          "bg-primary hover:bg-primary",
        "aspect-square p-0",
      )}
    >
      {roomInitialName}
    </Link>
  );
};

export default RoomLinks;
