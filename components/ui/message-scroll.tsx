import { MessageProps, MessageVariable } from "@/types/message";
import React, { useEffect, useRef, useState } from "react";
import MessageCard from "../cards/message-card";
import { UserProps } from "@/types/user";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/lib/pusher";

interface MessageScrollProps {
  initialMessages: MessageProps[];
  currentUser: UserProps;
  channelId: string;
  isFetchingNextPage: boolean;
}

const MessageScroll: React.FC<MessageScrollProps> = ({
  initialMessages,
  currentUser,
  channelId,
  isFetchingNextPage,
}) => {
  const [newMessages, setNewMessages] = useState<MessageProps[]>([]);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const variables = useMutationState<MessageVariable>({
    filters: { mutationKey: ["send-message"], status: "pending" },
    // @ts-ignore
    select: (mutation) => mutation.state.variables,
  });

  useEffect(() => {
    pusherClient.subscribe("messages");

    pusherClient.bind("incoming-message", (data: MessageProps) => {
      setNewMessages((prev) => [...prev, data]);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    });

    return () => {
      pusherClient.unsubscribe("messages");
    };
  }, []);

  useEffect(() => {
    pusherClient.subscribe("messages");

    pusherClient.bind("updated-message", (data: MessageProps) => {
      setNewMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((message) => {
          if (message.id === data.id) {
            return data;
          }
          return message;
        });
        return updatedMessages;
      });
    });

    return () => {
      pusherClient.unsubscribe("messages");
    };
  }, []);

  useEffect(() => {
    if (newMessages.length === 0 || isFetchingNextPage) {
      setNewMessages(initialMessages);
    }
  }, [newMessages, initialMessages, isFetchingNextPage]);


  return (
    <div>
      {newMessages.length > 0 && (
        <>
          {newMessages.map((message, index) => (
            <MessageCard
              key={index}
              messages={newMessages}
              index={index}
              message={message}
              currentUser={currentUser}
              channelId={channelId}
              isEditing={isEditing === message.id}
              setIsEditing={setIsEditing}
              isFetchingNextPage={isFetchingNextPage}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MessageScroll;
