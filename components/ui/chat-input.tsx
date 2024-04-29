"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

interface ChatInputProps {
  channelId: string;
  currentUserId: string;
}

interface NewMessage {
  text: string;
  senderId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ channelId, currentUserId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const queryClient = useQueryClient();
  const [input, setInput] = useState<string>("");

  const { isPending, variables, mutate } = useMutation({
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
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  function handleMessageSubmit() {
    const data = {
      text: input,
      senderId: currentUserId,
    };
    mutate(data);
  }

  return (
    <div>
      <TextareaAutosize
        ref={textareaRef}
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessageSubmit();
          }
        }}
        rows={1}
        placeholder="Write a message..."
        className="flex h-auto w-full resize-none rounded-md border-input bg-input px-5 py-4 text-sm shadow-sm ring-offset-background transition duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default ChatInput;
