"use client";

import { useQuery } from "@tanstack/react-query";
import NewChat from "./new-chat";
import axios from "axios";
import FetchDataError from "./fetch-data-error";
import { ScrollArea } from "./scroll-area";
import { ChannelProps } from "@/types/channel";
import ChatCard from "../cards/chat-card";
import { Input } from "./input";
import ChatSkeleton from "../loaders/chat-skeleton";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";
import { gg } from "@/lib/actions/chat.actions";
import { UserProps } from "@/types/user";
import Loader from "../loaders/loader";

interface ChatMenuProps {
  currentUserId: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchChatsResults, setSearchChatsResults] = useState<
    ChannelProps[] | null
  >([]);

  const {
    data,
    isLoading: queryLoading,
    isError,
    isSuccess,
  } = useQuery<ChannelProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/chat");
      return response.data.channels;
    },
    queryKey: ["chat-cards"],
  });

  console.log("hah", data, "yawa", searchChatsResults);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length && !searchTerm.startsWith(" ")) {
        setIsLoading(true);
        const response = await axios.get(
          `/api/chat/search/chats?q=${searchTerm}`,
        );
        setSearchChatsResults(response.data.channels);
        setIsLoading(false);
      } else {
        setSearchChatsResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="h-auto w-[262px] border-x px-3 pt-5">
      <div className="mb-6 flex justify-between pt-1">
        <h3 className="ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
          Chat rooms
        </h3>
        <NewChat currentUserId={currentUserId} />
      </div>
      <div className="space-y-1">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && searchTerm.length > 0 ? (
          <>
            {!isLoading && searchChatsResults?.length === 0 && (
              <div className="w-full py-3 text-center">
                <h4 className="w-full text-sm">No results</h4>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center py-5">
                <Loader className="!bg-primary" />
              </div>
            )}
            {searchChatsResults?.map((channel, index) => (
              <ChatCard
                key={index}
                channel={channel}
                currentUserId={currentUserId}
              />
            ))}
          </>
        ) : (
          <>
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
                <>
                  {data?.map((channel, index) => (
                    <ChatCard
                      key={index}
                      channel={channel}
                      currentUserId={currentUserId}
                    />
                  ))}
                </>
              </ScrollArea>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMenu;
