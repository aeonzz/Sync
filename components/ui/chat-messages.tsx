"use client";

import { MessageProps } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import MessageCard from "../cards/message-card";
import { ScrollArea } from "./scroll-area";

interface ChatMessagesProps {
  channelId: string;
  currentUserId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  channelId,
  currentUserId,
}) => {
  const messageEndRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery<MessageProps[]>({
    queryFn: async () => {
      const response = await axios.get(`/api/chat/${channelId}`);
      return response.data.messages;
    },
    queryKey: ["messages"],
  });

  const scrollTobottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollTobottom();
  }, [data]);

  return (
    <ScrollArea className="h-full">
      {data?.map((message, index) => (
        <MessageCard
          key={message.id}
          messages={data}
          index={index}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={messageEndRef}></div>
    </ScrollArea>
  );
};

export default ChatMessages;
