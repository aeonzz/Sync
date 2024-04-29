import { MessageProps } from "@/types/message";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  message: MessageProps;
  currentUserId: string;
  messages: MessageProps[];
  index: number;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  messages,
  index,
  currentUserId,
}) => {
  const hasNextMessageFromSameUser =
    messages.length > index + 1 &&
    messages[index + 1].senderId === messages[index].senderId;

  return (
    <div className="mb-2 flex items-center space-x-2">
      <Avatar
        className={cn("h-8 w-8", {
          invisible:
            (hasNextMessageFromSameUser && index !== messages.length - 1)
        })}
      >
        <AvatarImage
          src={message.sender.avatarUrl ?? undefined}
          className="object-cover"
          alt={message.sender.avatarUrl ?? undefined}
        />
        <AvatarFallback>
          {message.sender.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="rounded-md bg-card px-4 py-3">
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageCard;
