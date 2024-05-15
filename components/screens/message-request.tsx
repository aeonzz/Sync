"use client";

import React, { useEffect } from "react";
import ChatSkeleton from "../loaders/chat-skeleton";
import FetchDataError from "../ui/fetch-data-error";
import { ScrollArea } from "../ui/scroll-area";
import MessageRequestCard from "../cards/message-request-card";
import { useMessageRequestsStore } from "@/context/store";

interface MessageRequestProps {
  currentUserId: string;
}

const MessageRequest: React.FC<MessageRequestProps> = ({ currentUserId }) => {
  const { channel, isLoading, isError } = useMessageRequestsStore();

  return (
    <div>
      <h3 className="ml-4 py-2 text-sm text-muted-foreground">
        Pending Request: {channel ? channel.length : 0}
      </h3>
      {isLoading ? (
        <ChatSkeleton />
      ) : isError ? (
        <FetchDataError />
      ) : channel?.length === 0 ? (
        <p className="py-5 text-center text-sm text-muted-foreground">
          There are no pending message requests
        </p>
      ) : (
        <ScrollArea className="h-[calc(100vh-130px)] p-1">
          <>
            {channel?.map((channel, index) => (
              <MessageRequestCard key={index} channel={channel} />
            ))}
          </>
        </ScrollArea>
      )}
    </div>
  );
};

export default MessageRequest;
