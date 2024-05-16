"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChannelProps, RoomProps } from "@/types/channel";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { useMessageRequestsStore } from "@/context/store";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import RoomForm from "../forms/room-form";
import RoomLinks from "../ui/room-links";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMenuProps {
  currentUserId: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ currentUserId }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getAllRoomsQuery = useQuery<RoomProps[]>({
    queryFn: async () => {
      const response = await axios.get(
        `/api/chat/chats/${currentUserId}/rooms`,
      );
      return response.data.userRooms;
    },
    queryKey: ["rooms"],
  });

  return (
    <aside className="flex h-auto w-auto flex-col items-center border-l px-3 pt-5">
      <TooltipProvider delayDuration={100}>
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger>
              <Link
                href="/chat-rooms/me"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  pathname.startsWith("/chat-rooms/me") &&
                    "bg-primary hover:bg-primary",
                  "aspect-square p-0",
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  color={"#ededed"}
                  fill={"none"}
                >
                  <path
                    d="M7 7H7.00897M12.991 7H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.991 14.5H18M14 14.5H14.009"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 16C10 18.7614 12.6863 21 16 21C16.9072 21 17.7673 20.8322 18.5382 20.5319C18.7266 20.4585 18.9312 20.4321 19.13 20.4689L22 21L21.3483 18.9702C21.2531 18.6738 21.3075 18.3533 21.4575 18.0805C21.8058 17.447 22 16.7424 22 16C22 13.2386 19.3137 11 16 11C12.6863 11 10 13.2386 10 16Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.8731 11.2485C17.9565 10.8434 18 10.4261 18 10C18 6.13401 14.4183 3 10 3C5.58172 3 2 6.13401 2 10C2 11.1124 2.29653 12.1641 2.8242 13.0981C2.97102 13.358 3.01971 13.6653 2.93243 13.9507L2 17L5.91414 16.2394C6.12183 16.199 6.33621 16.2273 6.53119 16.3094C7.61561 16.7662 8.84138 17.0157 10.1198 16.9992"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="start"
              hideWhenDetached
              className="rounded-sm px-4 py-2"
            >
              <p>Direct Messages</p>
            </TooltipContent>
          </Tooltip>
          {getAllRoomsQuery.data?.map((room, index) => (
            <Tooltip key={index}>
              <TooltipTrigger>
                <RoomLinks room={room} />
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="start"
                hideWhenDetached
                className="rounded-sm px-4 py-2"
              >
                <p>{room.roomName}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <Separator className="my-2 w-full" />
        <Dialog open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="secondary" className="aspect-square p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                    color={"#ededed"}
                    fill={"none"}
                  >
                    <path
                      d="M12 4V20M20 12H4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="start"
              hideWhenDetached
              className="rounded-sm px-4 py-2"
            >
              <p>Creat Room</p>
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogClose className="absolute right-4 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogHeader>
              <DialogTitle>Create Room</DialogTitle>
              <DialogDescription>
                Create a room and hangout with your friends
              </DialogDescription>
            </DialogHeader>
            <RoomForm setOpen={setOpen} currentUserId={currentUserId} />
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </aside>
  );
};

export default ChatMenu;
