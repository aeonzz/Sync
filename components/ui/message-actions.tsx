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
import { deleteMessage } from "@/lib/actions/chat.actions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface MessageActionsProps {
  currentUser: UserProps;
  senderId: string;
  messageId: string;
  setIsEditing: (messageId: string | null) => void;
  setMessageAction: (state: boolean) => void;
}

interface Reaction {
  messageId: string;
  reaction: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  currentUser,
  senderId,
  messageId,
  setIsEditing,
  setMessageAction,
}) => {
  const isSender = currentUser.id === senderId;
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["message-reaction"],
    mutationFn: (reaction: Reaction) => {
      return axios.patch(`/api/chat`, reaction);
    },
    onError: () => {
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not send message, Try again later.",
      });
    },
    onSuccess: () => {
      
    },
    // onSettled: async () => {
    //   return await queryClient.invalidateQueries({ queryKey: ["messages"] });
    // },
  });

  function handleReaction(emojiData: string) {
    const data = {
      messageId,
      reaction: emojiData,
    };
    mutate(data);
  }

  async function handleDelete() {
    const response = await deleteMessage(messageId);

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
    <Card className="absolute -top-5 right-[10%] h-auto w-auto rounded-sm">
      <div className="p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <EmojiPicker
                  isLoading={isLoading}
                  handleEmojiClick={handleReaction}
                  side="left"
                />
              </Button>
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
                <Button variant="ghost" size="icon">
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
              <AlertDialog>
                {isSender && (
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-xs text-red-600"
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
