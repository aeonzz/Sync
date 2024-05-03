"use client";

import { cn } from "@/lib/utils";
import { MessageProps } from "@/types/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

interface ChatInputProps {
  channelId: string;
  currentUserId: string;
  isEditing?: boolean | undefined;
  className?: string | undefined;
  isEditingData?: MessageProps | undefined;
}

interface NewMessage {
  text: string;
  senderId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  channelId,
  currentUserId,
  isEditing,
  className,
  isEditingData,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const queryClient = useQueryClient();
  const [input, setInput] = useState<string>("");

  const { isPending, variables, mutate } = useMutation({
    mutationKey: ["send-message"],
    mutationFn: (newMessage: NewMessage) => {
      return axios.post(`/api/chat/${channelId}`, newMessage);
    },
    onError: () => {
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not send message, Try again later.",
      });
    },
    onSuccess: () => {
      setInput("");
    },
    // onSettled: async () => {
    //   return await queryClient.invalidateQueries({ queryKey: ["messages"] });
    // },
  });

  function handleMessageSubmit() {
    const data = {
      text: input,
      senderId: currentUserId,
    };
    mutate(data);
  }

  return (
    <div className={cn(className)}>
      <TextareaAutosize
        ref={textareaRef}
        autoFocus
        value={isEditingData ? isEditingData.text : input}
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
          "flex h-auto w-full resize-none rounded-md border-input bg-input text-sm shadow-sm ring-offset-background transition duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
    </div>
  );
};

export default ChatInput;
