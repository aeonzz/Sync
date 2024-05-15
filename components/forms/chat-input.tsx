"use client";

import { cn } from "@/lib/utils";
import { MessageProps } from "@/types/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { updateMessage } from "@/lib/actions/chat.actions";
import { useRouter } from "next/navigation";
import { useReplyMessageStore } from "@/context/store";
import EmojiPicker from "../ui/emoji-picker";

interface ChatInputProps {
  channelId: string;
  currentUserId: string;
  isEditing?: boolean | undefined;
  setIsEditing?: (messageId: string | null) => void;
  className?: string | undefined;
  isEditingData?: MessageProps | undefined;
  setMessageAction?: (state: boolean) => void;
}

interface NewMessage {
  text: string;
  senderId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  channelId,
  currentUserId,
  isEditing,
  setIsEditing,
  className,
  isEditingData,
  setMessageAction,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { messageId, setMessageId } = useReplyMessageStore();
  const [input, setInput] = useState<string>(
    isEditingData?.text ? isEditingData.text : "",
  );

  const handleEmojiClick = (emojiData: string) => {
    setInput((prev) => prev + emojiData);
  };

  const { mutate } = useMutation({
    mutationKey: ["send-message"],
    mutationFn: (newMessage: NewMessage) => {
      return axios.post(`/api/chat/${channelId}`, newMessage);
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not send message, Try again later.",
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      setMessageId(null);
    },
    // onSettled: async () => {
    //   return await queryClient.invalidateQueries({ queryKey: ["messages"] });
    // },
  });

  async function handleMessageSubmit() {
    if (input) {
      setInput("");
      setIsLoading(true);
      if (isEditing && isEditingData) {
        if (input === isEditingData.text) {
          setIsEditing?.(null);
          setMessageAction?.(false);
        } else {
          const data = {
            text: input,
            messageId: isEditingData.id,
            channelId,
          };
          const response = await updateMessage(data);

          if (response.status === 200) {
            setIsLoading(false);
            setIsEditing?.(null);
            setMessageAction?.(false);
          } else {
            setIsLoading(false);
            toast.error("Uh oh! Something went wrong.", {
              description:
                "An error occurred while making the request. Please try again later",
            });
          }
        }
      } else {
        const data = {
          text: input,
          senderId: currentUserId,
          parentId: messageId,
        };
        mutate(data);
      }
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setIsEditing?.(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messageId]);

  return (
    <div className={cn(isEditing && "pb-2 pt-3", "space-y-2", className)}>
      <div className="flex items-center overflow-hidden rounded-md border-input bg-input pr-3">
        <TextareaAutosize
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleMessageSubmit();
            }
          }}
          rows={1}
          maxRows={8}
          placeholder="Write a message..."
          className={cn(
            isEditing ? "px-4 py-3" : "px-5 py-4",
            "flex h-auto w-full resize-none bg-input text-sm shadow-sm ring-offset-background transition duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <EmojiPicker
          onOpenEmojiPicker={setOpen}
          openEmojiPicker={open}
          isLoading={isLoading}
          handleEmojiClick={handleEmojiClick}
          side="top"
          align="end"
          sideOffset={12}
        />
      </div>
      {isEditing && (
        <div className="flex items-center">
          <p className="text-xs text-muted-foreground">Escape to</p>
          <Button
            variant="link"
            className="ml-[5px] h-fit p-0 text-xs"
            onClick={() => {
              setIsEditing?.(null);
              setMessageAction?.(false);
            }}
            disabled={isLoading}
          >
            cancel
          </Button>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <p className="text-xs text-muted-foreground">Enter to</p>
          <Button
            variant="link"
            className="ml-[5px] h-fit p-0 text-xs"
            onClick={handleMessageSubmit}
            disabled={isLoading}
          >
            save
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
