import { ChannelProps } from "@/types/channel";
import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MessageRequestCardProps {
  channel: ChannelProps;
}

const MessageRequestCard: React.FC<MessageRequestCardProps> = ({ channel }) => {
  const chatPartner = channel.members[0];

  return (
    <Card>
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
    </Card>
  );
};

export default MessageRequestCard;
