"use client";

import { useMutationSuccess } from "@/context/store";
import { UserProps } from "@/types/user";
import {
  useInfiniteQuery,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import NoPostMessage from "./no-post-message";
import { MessageProps, MessageVariable } from "@/types/message";
import { ScrollArea } from "./scroll-area";
import MessageCard from "../cards/message-card";
import { useEffect, useRef, useState } from "react";
import Loader from "../loaders/loader";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChannelProps } from "@/types/channel";
import MessageSkeleton from "../loaders/message-skeleton";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import MessageScroll from "./message-scroll";

interface ChatMessagesProps {
  channel: ChannelProps;
  currentUser: UserProps;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  channel,
  currentUser,
}) => {
  const chatPartner = channel.members[0];

  const fetchMessages = async ({ pageParam = 0 }) => {
    const res = await axios.get(`/api/chat/${channel.id}?cursor=${pageParam}`);
    return res.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSuccess,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  const messages = data?.pages.flatMap((page) => page.messages) || [];
  const reversedMessages = messages.reverse();

  function getMoreMessage() {
    if (hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <ScrollArea className="h-full pb-5">
      {isLoading ? (
        <MessageSkeleton />
      ) : (
        <>
          {hasNextPage && hasPreviousPage ? (
            <div className="flex w-full justify-center p-2">
              <Button
                onClick={getMoreMessage}
                disabled={isFetchingNextPage}
                size="sm"
                variant="outline"
              >
                View more
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-3 p-4">
              <Avatar className="h-28 w-28">
                <AvatarImage
                  src={chatPartner.user.avatarUrl ?? undefined}
                  className="object-cover"
                  alt={chatPartner.user.avatarUrl ?? undefined}
                />
                <AvatarFallback>
                  {chatPartner.user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-3xl font-semibold">
                {chatPartner.user.username}
              </h3>
              <p className="text-sm text-muted-foreground">
                This is the beginning fo your direct message history with{" "}
                <span className="text-base font-semibold">
                  {chatPartner.user.username}
                </span>
              </p>
            </div>
          )}
        </>
      )}
      <MessageScroll
        initialMessages={reversedMessages}
        currentUser={currentUser}
        channelId={channel.id}
        isFetchingNextPage={isFetchingNextPage}
      />
      {/* <div ref={messageEndRef} className="border border-transparent"></div> */}
    </ScrollArea>
  );
};

export default ChatMessages;
