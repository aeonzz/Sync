import { MessageProps } from "@/types/message";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { UserProps } from "@/types/user";
import { format, formatDistanceToNow } from "date-fns";
import MessageActions from "../ui/message-actions";

interface MessageCardProps {
  message: MessageProps;
  currentUser: UserProps;
  messages: MessageProps[];
  index: number;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  messages,
  index,
  currentUser,
}) => {
  const sentAt = new Date(message.createdAt);
  const formatSentAt = format(sentAt, "Pp");
  const indexSentAt = new Date(messages[index - 1]?.createdAt);
  let formatIndexSentAt;
  try {
    formatIndexSentAt = format(indexSentAt, "Pp");
  } catch (error) {
    formatIndexSentAt = "Unknown time";
  }
  const hasNextMessageFromSameUser =
    messages[index - 1]?.senderId === messages[index].senderId;
  const lastMessage = index === messages.length - 1;
  const hasNextMessageFromSameUserAndIsSameTime =
    hasNextMessageFromSameUser && formatSentAt === formatIndexSentAt;
  const [messageAction, setMessageAction] = useState(false);

  return (
    <div
      className={cn(
        hasNextMessageFromSameUserAndIsSameTime ? "mb-0" : "mb-0 mt-4",
        lastMessage && "mb-5",
        messageAction && "bg-card/50",
        "relative flex items-center pl-4 transition-colors",
      )}
      onMouseEnter={() => setMessageAction(true)}
      onMouseLeave={() => setMessageAction(false)}
    >
      {messageAction && <MessageActions currentUser={currentUser} senderId={message.senderId} />}
      <Avatar
        className={cn(
          hasNextMessageFromSameUserAndIsSameTime && "invisible",
          "h-8 w-8",
        )}
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
      <div
        className={cn(
          !hasNextMessageFromSameUserAndIsSameTime && "mb-1",
          "h-auto max-w-full overflow-hidden rounded-md px-4",
        )}
      >
        {!hasNextMessageFromSameUserAndIsSameTime && (
          <p className="mb-1 text-base font-semibold">
            {message.sender.username}{" "}
            <span className="ml-2 text-xs font-light text-muted-foreground">
              {format(sentAt, "PPpp")}
            </span>
          </p>
        )}
        <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
          {message.text}
        </p>
      </div>
    </div>
  );
};

export default MessageCard;
