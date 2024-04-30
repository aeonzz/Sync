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

interface MessageActionsProps {
  currentUser: UserProps;
  senderId: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  currentUser,
  senderId,
}) => {
  const isSender = currentUser.id === senderId;
  const [isLoading, setIsLoading] = useState(false);

  const handleEmojiClick2 = (emojiData: string) => {
    // const currentContent = form.getValues("content");
    // const newContent = currentContent + emojiData;
    // form.setValue("content", newContent);
  };
  return (
    <Card className="absolute -top-5 right-[10%] h-auto w-auto rounded-sm">
      <div className="p-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <EmojiPicker
                  isLoading={isLoading}
                  handleEmojiClick={handleEmojiClick2}
                  side="top"
                />  
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          {isSender ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
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
              <DropdownMenuItem
                className="text-xs text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default MessageActions;
