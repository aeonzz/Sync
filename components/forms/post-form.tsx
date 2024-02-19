"use client";

import { PostValidation } from "@/lib/validations/post";
import { PostType } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Loader from "../loaders/loader";
import ImageUpload from "../ui/image-upload";
import { Card } from "../ui/card";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileState } from "./multi-image";

interface PostFormProps {
  onMutationSuccess: (state: boolean) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onMutationSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [openImageInput, setOpenImageInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const hasPendingProgress = fileStates.some(
    (item) => item.progress !== "COMPLETE",
  );

  const handleUrlsChange = (urls: string[]) => {
    setImageUrls(urls);
  };

  const fileStatesChange = (state: FileState[]) => {
    setFileStates(state);
  };

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { mutate: createpost } = useMutation({
    mutationFn: (newPost: PostType) => {
      return axios.post("/api/post", newPost);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not create post, Try again later.",
      });
    },
    onSuccess: async (data) => {
      const postId = data.data.postId;

      await Promise.all(
        imageUrls.map(async (url) => {
          await axios.post("/api/files", {
            url,
            postId,
          });
        }),
      );
      onMutationSuccess(false);
      toast("Posted.");
    },
  });

  const onSubmit = async (data: z.infer<typeof PostValidation>) => {
    setIsLoading(true);
    createpost({
      ...data,
    });
  };

  useEffect(() => {
    setIsUploading(hasPendingProgress);
  }, [fileStates, hasPendingProgress]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        {/* <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Label className="absolute -bottom-3 left-3 text-xs text-slate-200/40">
                    (optional)
                  </Label>
                  <Input
                    className="border-none text-lg placeholder:font-medium focus-visible:ring-transparent"
                    placeholder="Title"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write your thoughts here..."
                  className={cn(
                    openImageInput ? "h-[100px]" : "h-[150px]",
                    "resize-none border-none placeholder:font-medium",
                  )}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUpload
          onUrlsChange={handleUrlsChange}
          openImageInput={openImageInput}
          onFileStatesChange={fileStatesChange}
          isLoading={isLoading}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-end">
            <Button
              className={cn(
                openImageInput && "bg-green-500/15",
                "group rounded-full transition-all hover:bg-green-500/15 active:scale-95",
              )}
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setOpenImageInput((prev) => !prev);
              }}
            >
              <ImagePlus
                className={cn(
                  openImageInput ? "text-green-500/70" : "text-slate-500",
                  "group-hover:text-green-500/70",
                )}
              />
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full transition-none"
            disabled={isLoading || isUploading}
          >
            {isLoading && <Loader />}
            {isLoading ? null : <p>Post</p>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
