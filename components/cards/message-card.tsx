import { MessageProps } from "@/types/message";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { UserProps } from "@/types/user";
import { differenceInMinutes, format, formatDistanceToNow } from "date-fns";
import MessageActions from "../ui/message-actions";
import ChatInput from "../forms/chat-input";

interface MessageCardProps {
  message: MessageProps;
  currentUser: UserProps;
  messages: MessageProps[];
  index: number;
  channelId: string;
  isEditing: boolean;
  onStartEditing: (state: boolean) => void
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  messages,
  index,
  currentUser,
  channelId,
  isEditing,
  onStartEditing,
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
  const timeDifference = differenceInMinutes(
    new Date(formatSentAt),
    new Date(formatIndexSentAt),
  );
  const isWithin5Minutes = timeDifference <= 5;
  const hasNextMessageFromSameUser =
    messages[index - 1]?.senderId === messages[index].senderId;
  const hasNextMessageFromSameUserAndIsSameTime =
    hasNextMessageFromSameUser && isWithin5Minutes;
  const [messageAction, setMessageAction] = useState(false);

  return (
    <div
      className={cn(
        hasNextMessageFromSameUserAndIsSameTime ? "mb-0" : "mb-0 mt-4",
        messageAction && "bg-card/50",
        message.text.length > 200 && "pb-1",
        "relative flex items-center pl-1 transition-colors",
      )}
      onMouseEnter={() => setMessageAction(true)}
      onMouseLeave={() => setMessageAction(false)}
    >
      {messageAction && !isEditing && (
        <MessageActions
          currentUser={currentUser}
          senderId={message.senderId}
          setIsEditing={onStartEditing}
        />
      )}
      <div className="flex w-14 justify-end">
        {hasNextMessageFromSameUserAndIsSameTime && messageAction ? (
          <span className="inline-flex h-8 items-center text-xs font-light text-muted-foreground">
            {format(sentAt, "p")}
          </span>
        ) : (
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
        )}
      </div>
      <div
        className={cn(
          !hasNextMessageFromSameUserAndIsSameTime && "mb-1",
          "h-auto w-[calc(100%-100px)] overflow-hidden rounded-md px-4",
        )}
      >
        {!hasNextMessageFromSameUserAndIsSameTime && (
          <p className="mb-1 text-base font-semibold">
            {message.sender.username}{" "}
            <span className="ml-2 text-xs font-light text-muted-foreground">
              {format(sentAt, "PPp")}
            </span>
          </p>
        )}
        {isEditing ? (
          <ChatInput
            channelId={channelId}
            currentUserId={currentUser.id}
            isEditing={isEditing}
            isEditingData={message}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
