import { ExtendedChannelProps } from "@/types/channel";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { ChannelStatus } from "@prisma/client";
import { updateMessageRequest } from "@/lib/actions/chat.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface MessageRequestCardProps {
  channel: ExtendedChannelProps;
}

const MessageRequestCard: React.FC<MessageRequestCardProps> = ({ channel }) => {
  const chatPartner = channel.members[0];
  const createdAt = new Date(channel.createdAt);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleDm(status: ChannelStatus) {
    setIsLoading(true);
    const response = await updateMessageRequest(channel.id, status);
    if (response.status === 200) {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["chat-cards"] });
      queryClient.invalidateQueries({ queryKey: ["message-request"] });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Card className="flex w-full cursor-pointer items-center justify-between p-3 hover:bg-accent/30">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={chatPartner.user.avatarUrl ?? undefined}
            className="object-cover"
            alt={chatPartner.user.avatarUrl ?? undefined}
          />
          <AvatarFallback>
            {chatPartner.user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm">
            {chatPartner.user.username}{" "}
            <span className="text-xs text-muted-foreground">
              {format(createdAt, "PPp")}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            {channel.messages[channel.messages.length - 1].text}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="destructive"
          size="sm"
          disabled={isLoading}
          onClick={() => handleDm(ChannelStatus.DECLINED)}
        >
          Ignore
        </Button>
        <Button
          size="sm"
          disabled={isLoading}
          onClick={() => handleDm(ChannelStatus.ACCEPTED)}
        >
          Accept
        </Button>
      </div>
    </Card>
  );
};

export default MessageRequestCard;
