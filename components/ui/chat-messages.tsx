"use client";

import { MessageProps, MessageVariable } from "@/types/message";
import { useMutationState, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import MessageCard from "../cards/message-card";
import { ScrollArea } from "./scroll-area";
import { UserProps } from "@/types/user";

interface ChatMessagesProps {
  channelId: string;
  currentUser: UserProps;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  channelId,
  currentUser,
}) => {
  const messageEndRef = useRef<HTMLInputElement>(null);

  const { data } = useQuery<MessageProps[]>({
    queryFn: async () => {
      const response = await axios.get(`/api/chat/${channelId}`);
      return response.data.messages;
    },
    queryKey: ["messages"],
  });

  const variables = useMutationState<MessageVariable>({
    filters: { mutationKey: ["add-message"], status: "pending" },
    // @ts-ignore
    select: (mutation) => mutation.state.variables,
  });

  const scrollTobottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollTobottom();
  }, [data, variables]);

  return (
    <ScrollArea className="h-full">
      {data?.map((message, index) => (
        <MessageCard
          key={index}
          messages={data}
          index={index}
          message={message}
          currentUser={currentUser}
        />
      ))}
      <div ref={messageEndRef}>
        {/* {variables.map((variable, index) => (
          <MessageCard
            key={index}
            messages={data}
            index={index}
            message={variable}
            currentUserId={currentUserId}
          />
        ))} */}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
