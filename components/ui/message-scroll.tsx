import { MessageProps, MessageVariable } from "@/types/message";
import React, { useEffect, useRef, useState } from "react";
import MessageCard from "../cards/message-card";
import { UserProps } from "@/types/user";
import { useMutationState } from "@tanstack/react-query";
import { pusherClient } from "@/lib/pusher";

interface MessageScrollProps {
  initialMessages: MessageProps[];
  currentUser: UserProps;
  channelId: string;
}

const MessageScroll: React.FC<MessageScrollProps> = ({
  initialMessages,
  currentUser,
  channelId,
}) => {
  const [newMessages, setNewMessages] = useState<MessageProps[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);

  const handleStartEditing = (index: number) => {
    setEditingMessageIndex(index);
  };

  const variables = useMutationState<MessageVariable>({
    filters: { mutationKey: ["send-message"], status: "pending" },
    // @ts-ignore
    select: (mutation) => mutation.state.variables,
  });

  const scrollTobottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollTobottom();
  }, [newMessages]);

  useEffect(() => {
    pusherClient.subscribe("messages");

    pusherClient.bind("incoming-message", (data: MessageProps) => {
      console.log(data)
      setNewMessages((prev) => [...prev, data]);
    });

    return () => {
      pusherClient.unsubscribe("messages");
    };
  }, []);

  return (
    <div>
      {initialMessages.map((message, index) => (
        <MessageCard
          key={index}
          messages={initialMessages}
          index={index}
          message={message}
          currentUser={currentUser}
          channelId={channelId}
          isEditing={editingMessageIndex === index}
          onStartEditing={() => handleStartEditing(index)}
        />
      ))}
      {newMessages.map((message, index) => (
        <MessageCard
          key={index}
          messages={newMessages}
          index={index}
          message={message}
          currentUser={currentUser}
          channelId={channelId}
          isEditing={editingMessageIndex === index}
          onStartEditing={() => handleStartEditing(index)}
        />
      ))}
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default MessageScroll;
