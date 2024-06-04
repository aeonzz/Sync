"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { createComment, updateComment } from "@/lib/actions/comment.actions";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import EmojiPicker from "../ui/emoji-picker";
import { useMutationSuccess } from "@/context/store";
import { commentValidation } from "@/lib/validations/post";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationType } from "@prisma/client";
import { createNotification } from "@/lib/actions/notification.actions";
import TextareaAutosize from "react-textarea-autosize";

interface CommentFormProps {
  avatarUrl: string | null;
  username: string | null;
  userId: string;
  postId: string;
  postAuthor?: string | undefined;
  parentId?: string | undefined;
  setAccourdionValue?: (state: string) => void;
  className?: string | undefined;
  editData?: {
    text: string;
    commentId: string;
  };
  setDialogOpen?: (state: boolean) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  avatarUrl,
  username,
  userId,
  postId,
  postAuthor,
  parentId,
  setAccourdionValue,
  className,
  editData,
  setDialogOpen,
}) => {
  const avatar = avatarUrl ? avatarUrl : undefined;
  const initialLetter = username?.charAt(0).toUpperCase();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<string | undefined>(editData?.text);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsMutate } = useMutationSuccess();

  const handleEmojiClick = (emojiData: string) => {
    setInput((prev) => prev + emojiData);
  };

  async function onSubmit() {
    if (input) {
      setIsLoading(true);

      let response;
      if (editData) {
        const createData = {
          text: input,
          commentId: editData.commentId,
        };
        response = await updateComment(createData);
      } else {
        const createData = {
          text: input,
          postId: postId,
          userId: userId,
          parentId: parentId,
        };
        response = await createComment(createData);
      }

      if (response.status === 200) {
        setInput("");
        setDialogOpen && setDialogOpen(false);
        setIsMutate(true);
        setIsLoading(false);
        setAccourdionValue && setAccourdionValue("");

        if (!editData && response.data !== null) {
          if (userId !== postAuthor) {
            const notificationData = {
              type: NotificationType.COMMENT,
              from: userId,
              resourceId: `/f/${postId}`,
              text: response.data.text,
              recipientId: postAuthor,
            };

            await createNotification(notificationData);
          }
        }
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description:
            "An error occurred while making the request. Please try again later",
        });
      }
    }
  }

  return (
    <div className="flex w-full space-x-2">
      <Link href={`/u/${userId}`} className="group relative h-fit">
        <div className="absolute z-50 h-7 w-7 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
        <Avatar className="h-7 w-7">
          <AvatarImage src={avatar} className="object-cover" alt={avatar} />
          <AvatarFallback>{initialLetter}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex w-full flex-col items-center overflow-hidden rounded-md border-input bg-input">
        <TextareaAutosize
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={1}
          maxRows={5}
          placeholder="Write a comment..."
          className={cn(
            "flex h-auto w-full resize-none bg-input px-4 py-3 text-sm shadow-sm ring-offset-background transition duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <div className="flex w-full items-center justify-end">
          <EmojiPicker
            onOpenEmojiPicker={setOpen}
            openEmojiPicker={open}
            isLoading={isLoading}
            handleEmojiClick={handleEmojiClick}
            sideOffset={10}
            align="end"
            iconSize="w-4 h-4"
          />
          <Button
            disabled={isLoading || input?.length === 0}
            variant="ghost"
            className="aspect-square w-fit rounded-full p-1"
            onClick={onSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
