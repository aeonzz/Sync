"use client";

import { useQuery } from "@tanstack/react-query";
import NewChat from "./new-chat";
import axios from "axios";
import ReactorSkeleton from "../loaders/reactor-skeleton";
import FetchDataError from "./fetch-data-error";
import { ScrollArea } from "./scroll-area";
import { ChannelProps } from "@/types/channel";
import ChatCard from "../cards/chat-card";
import { Input } from "./input";
import ChatSkeleton from "../loaders/chat-skeleton";

interface ChatMenuProps {
  currentUserId: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ currentUserId }) => {
  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery<ChannelProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/chat");
      return response.data.channels;
    },
    queryKey: ["chat-cards"],
  });

  return (
    <div className="mt-5 h-auto w-[250px]">
      <div className="mb-6 flex justify-between pt-1">
        <h3 className="ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
          Chat rooms
        </h3>
        <NewChat currentUserId={currentUserId} />
      </div>
      <div className="space-y-2">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute left-3 top-[9px] h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <Input
            placeholder="Search..."
            autoComplete="off"
            className="pl-9 pt-1"
          />
        </div>
        {queryLoading ? (
          <ChatSkeleton />
        ) : isError ? (
          <FetchDataError />
        ) : data?.length === 0 ? (
          <p className="py-5 text-center text-sm text-muted-foreground">
            Nothing to show here
          </p>
        ) : (
          <ScrollArea className="max-h-60">
            {data?.map((channel, index) => (
              <ChatCard
                key={index}
                channel={channel}
                currentUserId={currentUserId}
              />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ChatMenu;
