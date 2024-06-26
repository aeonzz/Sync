"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Reply, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserProps } from "@/types/user";
import { useState } from "react";
import EmojiPicker from "./emoji-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createReaction, deleteMessage } from "@/lib/actions/chat.actions";
import { useReplyMessageStore } from "@/context/store";

interface MessageActionsProps {
  currentUser: UserProps;
  senderId: string;
  messageId: string;
  setIsEditing: (messageId: string | null) => void;
  setMessageAction: (state: boolean) => void;
  channelId: string;
}

interface Reaction {
  reaction: string;
  userId: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  currentUser,
  senderId,
  messageId,
  setIsEditing,
  setMessageAction,
  channelId,
}) => {
  const isSender = currentUser.id === senderId;
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { setMessageId } = useReplyMessageStore();

  // const { mutate } = useMutation({
  //   mutationKey: ["message-reaction"],
  //   mutationFn: (reaction: Reaction) => {
  //     return axios.post(`/api/chat/message/${messageId}`, reaction);
  //   },
  //   onError: () => {
  //     toast.error("Uh oh! Something went wrong.", {
  //       description: "Could not send message, Try again later.",
  //     });
  //   },
  //   onSuccess: () => {
  //     setMessageAction(false);
  //   },
  //   onSettled: async () => {
  //     return await queryClient.invalidateQueries({ queryKey: ["messages"] });
  //   },
  // });

  async function handleReaction(emojiData: string) {
    setOpen(false);
    const data = {
      reaction: emojiData,
      userId: currentUser.id,
      messageId,
    };

    // mutate(data);
    const response = await createReaction(data);

    if (response.status === 200) {
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  async function handleDelete() {
    const response = await deleteMessage(messageId, channelId);

    if (response.status === 200) {
      setMessageAction(false);
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Card className="absolute -top-5 right-[10%] h-auto w-auto rounded-sm bg-input">
      <div className="p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <EmojiPicker
                onOpenEmojiPicker={setOpen}
                openEmojiPicker={open}
                isLoading={isLoading}
                handleEmojiClick={handleReaction}
                side="left"
                iconSize="w-4 h-4"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Reaction</p>
            </TooltipContent>
          </Tooltip>
          {isSender ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(messageId)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMessageId(messageId)}
                >
                  <Reply className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply</p>
              </TooltipContent>
            </Tooltip>
          )}
          <DropdownMenu modal={false}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>More</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="left" className="p-1.5">
              <DropdownMenuItem
                onClick={() => setMessageId(messageId)}
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
              <AlertDialog>
                {isSender && (
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                )}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the message from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default MessageActions;
