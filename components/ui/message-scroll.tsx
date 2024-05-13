import { MessageProps, MessageVariable } from "@/types/message";
import React, { useEffect, useRef, useState } from "react";
import MessageCard from "../cards/message-card";
import { UserProps } from "@/types/user";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useReplyMessage } from "@/context/store";

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
  const { messageId, setMessageId } = useReplyMessage();

  const variables = useMutationState<MessageVariable>({
    filters: { mutationKey: ["send-message"], status: "pending" },
    // @ts-ignore
    select: (mutation) => mutation.state.variables,
  });

  useEffect(() => {
    pusherClient.subscribe(channelId);

    pusherClient.bind("incoming-message", (data: MessageProps) => {
      setNewMessages((prev) => [...prev, data]);
      // queryClient.invalidateQueries({ queryKey: [channelId] });
    });

    return () => {
      pusherClient.unsubscribe(channelId);
    };
  }, []);

  useEffect(() => {
    pusherClient.subscribe(channelId);

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
      pusherClient.unsubscribe(channelId);
    };
  }, []);

  useEffect(() => {
    if (newMessages.length === 0 || isFetchingNextPage) {
      setNewMessages(initialMessages);
    }
  }, [newMessages, initialMessages, isFetchingNextPage]);

  useEffect(() => {
    setNewMessages(initialMessages);
  }, [initialMessages]);

  return (
    <>
      {newMessages.length > 0 && (
        <>
          {newMessages.map((message, index) => (
            <div key={index}>
              <MessageCard
                messages={newMessages}
                index={index}
                message={message}
                currentUser={currentUser}
                channelId={channelId}
                isEditing={isEditing === message.id}
                setIsEditing={setIsEditing}
                isFetchingNextPage={isFetchingNextPage}
              />
              {messageId === message.id && (
                <div className="absolute bottom-0 w-full px-4 z-50">
                  <div className="flex w-full items-center justify-between rounded-sm bg-primary/20 px-4 py-1">
                    <h4 className="text-xs text-muted-foreground">
                      Replying to{" "}
                      <span className="font-semibold">
                        {message.sender.username}
                      </span>
                    </h4>
                    <X
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => setMessageId(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default MessageScroll;
