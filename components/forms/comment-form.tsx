"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { PostProps } from "@/types/post";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { createComment } from "@/lib/actions/comment.actions";
import { Session } from "next-auth";
import { toast } from "sonner";

interface CommentFormProps {
  post: PostProps;
  session: Session | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ post, session }) => {
  const avatarUrl = post.author.avatarUrl ? post.author.avatarUrl : undefined;
  const initialLetter = post.author.username?.charAt(0).toUpperCase();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(data: { comment: string }) {
    setIsLoading(true);

    const createData = {
      text: data.comment,
      postId: post.postId,
      userId: session!.user.id,
    };

    const response = await createComment(createData);

    if (response.status === 200) {
      form.reset();
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
        className="flex w-full items-center space-x-1 border border-white"
      >
        <Link href={`/u/${post.author.id}`} className="group relative">
          <div className="absolute z-50 h-7 w-7 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={avatarUrl}
              className="object-cover"
              alt={avatarUrl}
            />
            <AvatarFallback>{initialLetter}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-full">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Add a comment..."
                    autoComplete="off"
                    className="h-8 rounded-sm bg-transparent pt-1 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={!form.formState.isDirty || isLoading}
          variant="ghost"
          size="sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
