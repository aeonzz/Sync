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
import { useEffect, useState } from "react";
import Loader from "../loaders/loader";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { usePathname } from "next/navigation";

interface ChatMenuProps {
  currentUserId: string;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

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
    <aside className="flex w-auto border-x">
      <div className="flex h-auto w-auto flex-col items-center border-r px-2 pt-5">
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
      <div className="h-auto w-[262px] px-2 pt-5">
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
    </aside>
  );
};

export default ChatMenu;
