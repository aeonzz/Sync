"use client";

import { ChannelProps } from "@/types/channel";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import ChatSkeleton from "../loaders/chat-skeleton";
import FetchDataError from "../ui/fetch-data-error";
import { ScrollArea } from "../ui/scroll-area";
import MessageRequestCard from "../cards/message-request-card";

interface MessageRequestProps {
  currentUserId: string;
}

const MessageRequest: React.FC<MessageRequestProps> = ({ currentUserId }) => {
  const { data, isLoading, isError } = useQuery<ChannelProps[]>({
    queryFn: async () => {
      const response = await axios.get(
        `/api/chat/message/message-request/${currentUserId}`,
      );
      return response.data.channels;
    },
    queryKey: ["message-request"],
  });

  return (
    <div>
      {isLoading ? (
        <ChatSkeleton />
      ) : isError ? (
        <FetchDataError />
      ) : data?.length === 0 ? (
        <p className="py-5 text-center text-sm text-muted-foreground">
          No direct messages yet
        </p>
      ) : (
        <ScrollArea className="max-h-60">
          <>
            {data?.map((channel, index) => (
              <MessageRequestCard key={index} channel={channel} />
            ))}
          </>
        </ScrollArea>
      )}
    </div>
  );
};

export default MessageRequest;
