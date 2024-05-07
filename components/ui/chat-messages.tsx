"use client";

import { UserProps } from "@/types/user";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChannelProps } from "@/types/channel";
import MessageSkeleton from "../loaders/message-skeleton";
import MessageScroll from "./message-scroll";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useMutationSuccess } from "@/context/store";

interface ChatMessagesProps {
  channel: ChannelProps;
  currentUser: UserProps;
  params: string
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  channel,
  currentUser,
  params
}) => {
  const chatPartner = channel.members[0];
  const queryClient = useQueryClient();
  const { isMutate, setIsMutate } = useMutationSuccess();

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
    queryKey: ["messages", [params]],
    queryFn: fetchMessages,
    initialPageParam: 0,
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
          {hasNextPage ? (
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
