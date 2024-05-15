import { MessageProps, MessageReactionProps } from "@/types/message";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { UserProps } from "@/types/user";
import { differenceInMinutes, format, formatDistanceToNow } from "date-fns";
import MessageActions from "../ui/message-actions";
import ChatInput from "../forms/chat-input";
import { pusherClient } from "@/lib/pusher";
import MessageReaction from "../ui/message-reaction";

interface MessageCardProps {
  message: MessageProps;
  currentUser: UserProps;
  messages: MessageProps[];
  index: number;
  channelId: string;
  isEditing: boolean;
  setIsEditing: (messageId: string | null) => void;
  isFetchingNextPage: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  messages,
  index,
  currentUser,
  channelId,
  isEditing,
  setIsEditing,
  isFetchingNextPage,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
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

  function scrollTobottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    if (!isFetchingNextPage) {
      scrollTobottom();
    }
  }, [isFetchingNextPage]);

  return (
    <div
      ref={index === messages.length - 1 ? messageEndRef : null}
      className={cn(
        !hasNextMessageFromSameUserAndIsSameTime ||
          (message.parent !== null && "mt-4"),
        messageAction && "bg-accent/30",
        isEditing && "bg-card/50",
        message.text.length > 200 && "pb-1",
        "relative flex gap-1 py-1 pl-1 transition-colors",
      )}
      onMouseEnter={() => setMessageAction(true)}
      onMouseLeave={() => setMessageAction(false)}
    >
      {!message.deleted && (
        <>
          {messageAction && !isEditing && (
            <MessageActions
              currentUser={currentUser}
              senderId={message.senderId}
              setIsEditing={setIsEditing}
              messageId={message.id}
              setMessageAction={setMessageAction}
              channelId={channelId}
            />
          )}
        </>
      )}
      <div className="flex w-16 flex-col items-center justify-center">
        {message.parent !== null && (
          <>
            <div className="mr-[1px] mt-1.5 w-[50%] self-end border border-muted-foreground/50" />
            <div className="h-5 border border-muted-foreground/50" />
          </>
        )}
        <div className="mt-1 flex h-full flex-col justify-start">
          {hasNextMessageFromSameUserAndIsSameTime &&
          messageAction &&
          message.parent === null ? (
            <span className="inline-flex items-center text-xs font-light text-muted-foreground">
              {format(sentAt, "p")}
            </span>
          ) : (
            <Avatar
              className={cn(
                hasNextMessageFromSameUserAndIsSameTime &&
                  message.parent === null &&
                  "hidden",
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
      </div>
      <div className="flex h-auto w-[calc(100%-100px)] flex-col items-start justify-center overflow-hidden pr-4">
        {message.parent && (
          <div>
            <div className="flex items-center space-x-2 pb-2">
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={message.parent.sender.avatarUrl ?? undefined}
                  className="object-cover"
                  alt={message.parent.sender.avatarUrl ?? undefined}
                />
                <AvatarFallback>
                  {message.parent.sender.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">
                <span className="mr-1 font-semibold">
                  {message.parent.sender.username}
                </span>{" "}
                {message.parent.text}
              </p>
            </div>
            {hasNextMessageFromSameUserAndIsSameTime && (
              <p className="mb-1 text-base font-semibold">
                {message.sender.username}{" "}
                <span className="ml-2 text-xs font-light text-muted-foreground">
                  {format(sentAt, "PPp")}
                </span>
              </p>
            )}
          </div>
        )}
        {!hasNextMessageFromSameUserAndIsSameTime && (
          <p className="mb-1 text-base font-semibold">
            {message.sender.username}{" "}
            <span className="ml-2 text-xs font-light text-muted-foreground">
              {format(sentAt, "PPp")}
            </span>
          </p>
        )}
        {message.deleted ? (
          <div>
            <p className="text-sm text-red-800">Message Removed</p>
          </div>
        ) : (
          <>
            {isEditing ? (
              <ChatInput
                channelId={channelId}
                currentUserId={currentUser.id}
                isEditing={isEditing}
                isEditingData={message}
                setIsEditing={setIsEditing}
                setMessageAction={setMessageAction}
                className="w-full"
              />
            ) : (
              <p className="whitespace-pre-wrap break-words break-all text-[15px] font-light">
                {message.text}
                {message.createdAt !== message.updatedAt &&
                  message.text.length - 1 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (edited)
                    </span>
                  )}
              </p>
            )}
            <MessageReaction
              reactions={message.messageReaction}
              messageId={message.id}
              currentUserId={currentUser.id}
              channelId={channelId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
