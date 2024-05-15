"use client";

import { useQuery } from "@tanstack/react-query";
import NewChat from "./new-chat";
import axios from "axios";
import FetchDataError from "./fetch-data-error";
import { ScrollArea } from "./scroll-area";
import { ChannelProps, ExtendedChannelProps } from "@/types/channel";
import ChatCard from "../cards/chat-card";
import { Input } from "./input";
import ChatSkeleton from "../loaders/chat-skeleton";
import { useEffect, useState } from "react";
import Loader from "../loaders/loader";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { usePathname } from "next/navigation";
import { ChannelStatus } from "@prisma/client";
import { useMessageRequestsStore } from "@/context/store";

interface ChatMenuProps {
  currentUserId: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const {
    setChannel,
    setIsError,
    setIsLoading: setQueryLoading,
  } = useMessageRequestsStore();

  const [searchChatsResults, setSearchChatsResults] = useState<
    ChannelProps[] | null
  >([]);

  const chatsQuery = useQuery<ChannelProps[]>({
    queryFn: async () => {
      const response = await axios.get(`/api/chat/chats/${currentUserId}`);
      return response.data.channels;
    },
    queryKey: ["chat-cards"],
  });

  const messageRequestsQuery = useQuery<ExtendedChannelProps[]>({
    queryFn: async () => {
      const response = await axios.get(
        `/api/chat/message/message-request/${currentUserId}`,
      );
      return response.data.channels;
    },
    queryKey: ["message-request"],
  });

  useEffect(() => {
    setChannel(messageRequestsQuery.data);
    setIsError(messageRequestsQuery.isError);
    setQueryLoading(messageRequestsQuery.isLoading);
  }, [messageRequestsQuery.isFetching]);

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
    <aside className="flex w-auto">
      <div className="flex h-auto w-auto flex-col items-center border-l px-3 pt-5">
        <Link
          href="/chat-rooms/dm"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            pathname.startsWith("/chat-rooms/dm") &&
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
      </div>
      <div className="h-auto w-[262px] border-x bg-card/50 px-3 pt-5">
        <div className="mb-6 flex justify-between pt-1">
          <h3 className="ml-3 scroll-m-20 text-xl font-semibold tracking-tight">
            Direct Messages
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
          <Link
            href="/chat-rooms/dm/message-request"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === "/chat-rooms/dm/message-request" && "bg-accent/60",
              "relative mb-1 flex justify-start gap-2 !rounded-[4px] py-[22px]",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              color={"#ededed"}
              fill={"none"}
              className="mx-1"
            >
              <path
                d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Message Requests
            {messageRequestsQuery.data &&
              messageRequestsQuery.data.length > 0 && (
                <span className="absolute right-4 rounded-full bg-red-500 px-1.5 py-[1px] text-xs">
                  <p className="-ml-[1px]">
                    {messageRequestsQuery.data.length}
                  </p>
                </span>
              )}
          </Link>
          <p className="text-sm text-muted-foreground">Direct Messages</p>
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
              {chatsQuery.isLoading ? (
                <ChatSkeleton />
              ) : chatsQuery.isError ? (
                <FetchDataError />
              ) : chatsQuery.data?.length === 0 ? (
                <p className="py-5 text-center text-sm text-muted-foreground">
                  No direct messages yet
                </p>
              ) : (
                <ScrollArea className="max-h-60">
                  <>
                    {chatsQuery.data?.map((channel, index) => (
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
    </aside>
  );
};

export default ChatMenu;
