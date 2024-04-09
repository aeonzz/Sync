"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { createComment, updateComment } from "@/lib/actions/comment.actions";
import { Session } from "next-auth";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Cemoji from "../ui/c-emoji";

interface CommentFormProps {
  avatarUrl: string | null;
  username: string | null;
  userId: string;
  postId: string;
  parentId?: number | undefined;
  setAccourdionValue?: (state: string) => void;
  className?: string | undefined;
  editData?: {
    text: string;
    commentId: number;
  };
  setDialogOpen?: (state: boolean) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  avatarUrl,
  username,
  userId,
  postId,
  parentId,
  setAccourdionValue,
  className,
  editData,
  setDialogOpen,
}) => {
  const avatar = avatarUrl ? avatarUrl : undefined;
  const initialLetter = username?.charAt(0).toUpperCase();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      comment: editData ? editData.text : "",
    },
  });

  const isDirty = form.formState.isDirty;


  const handleEmojiClick2 = (emojiData: string) => {
    const currentContent = form.getValues("comment");

    const newContent = currentContent + emojiData;

    form.setValue("comment", newContent);
  };

  async function onSubmit(data: { comment: string }) {
    setIsLoading(true);

    let response;
    if (editData) {
      const createData = {
        text: data.comment,
        commentId: editData.commentId,
      };
      response = await updateComment(createData);
    } else {
      const createData = {
        text: data.comment,
        postId: postId,
        userId: userId,
        parentId: parentId,
      };
      response = await createComment(createData);
    }

    if (response.status === 200) {
      setDialogOpen && setDialogOpen(false);
      setIsLoading(false);
      form.reset();
      setAccourdionValue && setAccourdionValue("");
      router.refresh();
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex w-full")}
      >
        <div className="flex w-full space-x-2">
          <Link href={`/u/${userId}`} className="group relative h-fit">
            <div className="absolute z-50 h-7 w-7 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatar} className="object-cover" alt={avatar} />
              <AvatarFallback>{initialLetter}</AvatarFallback>
            </Avatar>
          </Link>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="relative w-full rounded-md bg-secondary">
                <FormControl>
                  <Textarea
                    placeholder="Add a comment..."
                    className="resize-none"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <div className="absolute bottom-0 right-0 flex items-center">
                  <Cemoji
                    isLoading={isLoading}
                    handleEmojiClick={handleEmojiClick2}
                    sideOffset={10}
                    align="end"
                    className="h-5 w-5"
                  />
                  <Button
                    type="submit"
                    disabled={!isDirty || isLoading}
                    variant="ghost"
                    className="aspect-square w-fit rounded-full p-1"
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
