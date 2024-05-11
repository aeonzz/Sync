"use client";

import { pusherClient } from "@/lib/pusher";
import { MessageReactionProps } from "@/types/message";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { removeReaction } from "@/lib/actions/chat.actions";

interface MessageReactionContainerProps {
  reactions: MessageReactionProps[];
  messageId: string;
  currentUserId: string;
  channelId: string;
}

const MessageReactionContainer: React.FC<MessageReactionContainerProps> = ({
  reactions,
  messageId,
  currentUserId,
  channelId,
}) => {
  const [messageReactions, setMessageReactions] =
    useState<MessageReactionProps[]>(reactions);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pusherClient.subscribe(messageId);

    pusherClient.bind("incoming-reaction", (data: MessageReactionProps) => {
      if (data.messageId === messageId) {
        setMessageReactions((prev) => [...prev, data]);
      }
    });

    return () => {
      pusherClient.unsubscribe(messageId);
    };
  }, []);

  useEffect(() => {
    pusherClient.subscribe(messageId);

    pusherClient.bind("deleted-reaction", (data: MessageReactionProps) => {
      if (data.messageId === messageId) {
        setMessageReactions((prevReactions) =>
          prevReactions.filter((reaction) => reaction.id !== data.id),
        );
      }
    });

    return () => {
      pusherClient.unsubscribe(messageId);
    };
  }, []);

  async function handleRemoveReaction(userId: string, reactionId: string) {
    if (userId === currentUserId) {
      setIsLoading(true);
      const response = await removeReaction(reactionId, messageId);
      if (response.status === 200) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description:
            "An error occurred while making the request. Please try again later",
        });
      }
    }
  }

  return (
    <div className="flex space-x-1">
      {messageReactions?.map((reaction, index) => (
        <Button
          key={index}
          variant="secondary"
          size="sm"
          className={cn(
            currentUserId === reaction.user.id &&
              "border border-primary/50 bg-primary/15",
            "mt-1 h-fit p-1 text-base",
          )}
          disabled={isLoading}
          onClick={() => handleRemoveReaction(reaction.user.id, reaction.id)}
        >
          {reaction.reaction}
        </Button>
      ))}
    </div>
  );
};

export default MessageReactionContainer;
