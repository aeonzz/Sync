"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PostValidation } from "@/lib/validations/post";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { UpdatePost } from "@/lib/actions/post.actions";
import { usePathname } from "next/navigation";

interface EditContentFormProps {
  postId: string;
  content: string;
  setIsEditing: (state: boolean) => void;
}
const EditContentForm: React.FC<EditContentFormProps> = ({
  postId,
  content,
  setIsEditing,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      content: content,
    },
  });
  const watchFormContent = form.watch("content");

  async function onSubmit(data: z.infer<typeof PostValidation>) {
    setIsLoading(true);

    const updateData = {
      ...data,
      postId,
      path: pathname,
    };

    const response = await UpdatePost(updateData);

    if (response.status === 200) {
      setIsLoading(false);
      setIsEditing(false);
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
        className="relative w-full space-y-3"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  autoFocus
                  className={cn(
                    watchFormContent.length >= 90 ? "!text-base" : "!text-2xl",
                    watchFormContent.length > 100 && "!h-[80px]",
                    watchFormContent.length > 150 && "!h-[100px]",
                    watchFormContent.length > 200 && "!h-[120px]",
                    watchFormContent.length > 250 && "!h-[140px]",
                    content.length > 100 && "!h-[80px]",
                    content.length > 150 && "!h-[100px]",
                    content.length > 200 && "!h-[120px]",
                    content.length > 250 && "!h-[140px]",
                    "!min-h-[20px] resize-none bg-transparent p-0 text-base",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            disabled={isLoading}
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
          >
            <X className="text-red-500/70" />
          </Button>
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isLoading}
          >
            <Check className="text-green-500/70" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditContentForm;
