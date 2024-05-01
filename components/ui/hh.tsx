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
import { useEffect, useRef } from "react";
import Loader from "../loaders/loader";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ChannelProps } from "@/types/channel";
import MessageSkeleton from "../loaders/message-skeleton";

interface ChatMessagesProps {
  channel: ChannelProps;
  currentUser: UserProps;
}

const Hh: React.FC<ChatMessagesProps> = ({ channel, currentUser }) => {
  const chatPartner = channel.members[0];
  const messageEndRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async ({ pageParam = 0 }) => {
    const res = await axios.get(`/api/chat/${channel.id}?cursor=${pageParam}`);
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["messages"],
      queryFn: fetchMessages,
      initialPageParam: 0,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

  const messages = data?.pages.flatMap((page) => page.messages) || [];
  const reversedMessages = messages.reverse();

  const scrollTobottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const variables = useMutationState<MessageVariable>({
    filters: { mutationKey: ["add-message"], status: "pending" },
    // @ts-ignore
    select: (mutation) => mutation.state.variables,
  });

  useEffect(() => {
    scrollTobottom();
  }, [data]);

  function getMoreMessage() {
    if (hasNextPage) {
      fetchNextPage();
    }
  }

  return (
    <ScrollArea className="h-full">
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
      {reversedMessages?.map((message, index) => (
        <MessageCard
          key={index}
          messages={reversedMessages}
          index={index}
          message={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={messageEndRef}></div>
    </ScrollArea>
  );
};

export default Hh;
