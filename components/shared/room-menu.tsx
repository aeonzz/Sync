"use client";

import { RoomProps } from "@/types/channel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FetchDataError from "../ui/fetch-data-error";
import NotFound from "@/app/not-found";
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
import { UserProps } from "@/types/user";
import Loader from "../loaders/loader";
import { Input } from "../ui/input";
import InviteUserCard from "../cards/invite-user-card";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChannelCard from "../cards/channel-card";

interface RoomMenuProps {
  roomId: string;
  currentUserId: string;
}

const RoomMenu: React.FC<RoomMenuProps> = ({ roomId, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchUsersResults, setSearchUsersResults] = useState<
    UserProps[] | null
  >([]);

  const roomQuery = useQuery<RoomProps>({
    queryFn: async () => {
      const response = await axios.get(`/api/chat/room/${roomId}`);
      return response.data.room;
    },
    queryKey: [roomId],
  });

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length && !searchTerm.startsWith(" ")) {
        setIsLoading(true);
        const response = await axios.get(
          `/api/chat/search/users?q=${searchTerm}`,
        );
        setSearchUsersResults(response.data.users);
        setIsLoading(false);
      } else {
        setSearchUsersResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (!roomQuery.isLoading && !roomQuery.data) return <NotFound />;

  return (
    <div className="h-auto w-[262px] border-x bg-card/50 px-3 pt-5">
      {roomQuery.isLoading ? (
        <h1>Loading...</h1>
      ) : roomQuery.isError ? (
        <FetchDataError />
      ) : (
        <div className="flex flex-col">
          <div className="mb-6 flex justify-between pt-1">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {roomQuery.data?.roomName}
            </h3>
            <Dialog>
              <DialogTrigger>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 cursor-pointer fill-none stroke-foreground outline-none transition-transform duration-500 hover:rotate-90 active:scale-95 active:stroke-blue-200 active:duration-0"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    strokeWidth="1.8"
                  ></path>
                  <path d="M8 12H16" strokeWidth="1.5"></path>
                  <path d="M12 16V8" strokeWidth="1.5"></path>
                </svg>
              </DialogTrigger>
              <DialogContent>
                <DialogClose className="absolute right-4 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle>Inivite Users</DialogTitle>
                  <DialogDescription>
                    Invite friends to{" "}
                    <span className="text-lg font-semibold">
                      {roomQuery.data?.roomName}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Search users..."
                  autoComplete="off"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && searchTerm.length > 0 && (
                  <>
                    {!isLoading && searchUsersResults?.length === 0 && (
                      <div className="w-full py-3 text-center">
                        <h4 className="w-full text-sm">No results</h4>
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex items-center justify-center py-5">
                        <Loader className="!bg-primary" />
                      </div>
                    )}
                    {searchUsersResults &&
                      searchUsersResults
                        .filter((user) => user.id !== currentUserId)
                        .map((user, index) => (
                          <InviteUserCard
                            key={index}
                            user={user}
                            roomId={roomId}
                          />
                        ))}
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <Separator />
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xs text-muted-foreground">
                Channels
              </AccordionTrigger>
              <AccordionContent>
                {roomQuery.data?.channels.map((channel, index) => (
                  <ChannelCard key={index} roomId={roomId} channel={channel} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default RoomMenu;
