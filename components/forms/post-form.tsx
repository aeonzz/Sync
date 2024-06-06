"use client";

import { PostValidation } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import Loader from "../loaders/loader";
import { ImagePlus, SmilePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileState, MultiImageDropzone } from "./multi-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutationSuccess, useThemeStore } from "@/context/store";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion";
import { createPost } from "@/lib/actions/post.actions";
import { useSession } from "next-auth/react";
import EmojiPicker from "../ui/emoji-picker";
import { createNotification } from "@/lib/actions/notification.actions";
import { UserProps } from "@/types/user";
import { AccessibilityType, NotificationType, PostType } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
interface PostFormProps {
  onMutationSuccess: (state: boolean) => void;
  hasUserInput: (state: boolean) => void;
  hasUserImages: (state: boolean) => void;
  onLoading: (state: boolean) => void;
  currentUser: UserProps;
  checked: boolean;
  accChecked: boolean;
}

const PostForm: React.FC<PostFormProps> = ({
  onMutationSuccess,
  hasUserInput,
  hasUserImages,
  onLoading,
  currentUser,
  checked,
  accChecked,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openImageInput, setOpenImageInput] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [accordionValue, setAccourdionValue] = useState("");
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setIsMutate } = useMutationSuccess();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const watchFormContent = form.watch("content");

  const handleEmojiClick2 = (emojiData: string) => {
    const currentContent = form.getValues("content");

    const newContent = currentContent + emojiData;

    form.setValue("content", newContent);
  };

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  async function onSubmit(data: z.infer<typeof PostValidation>) {
    onLoading(true);
    setIsLoading(true);

    const uploadImage = await Promise.all(
      fileStates.map(async (fileState) => {
        try {
          if (
            fileState.progress !== "PENDING" ||
            typeof fileState.file === "string"
          ) {
            return;
          }
          const res = await edgestore.publicImages.upload({
            file: fileState.file,
            onProgressChange: async (progress) => {
              updateFileProgress(fileState.key, progress);
              if (progress === 100) {
                // wait 1 second to set it to complete
                // so that the user can see the progress bar
                // await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(fileState.key, "COMPLETE");
              }
            },
          });

          return res.url;
        } catch (err) {
          updateFileProgress(fileState.key, "ERROR");
        }
      }),
    );

    const postData = {
      ...data,
      userId: currentUser.id,
      images: uploadImage,
      type: checked ? PostType.ANNOUNCEMENT : PostType.POST,
      accessibility: accChecked ? AccessibilityType.EXCLUSIVE : AccessibilityType.PUBLIC,
    };

    const response = await createPost(postData);

    if (response.data && response.status === 200) {
      onMutationSuccess(false);
      toast.success("Posted.");
      router.refresh();
      setIsMutate(true);

      const notificationData = {
        type: NotificationType.POST,
        from: currentUser.id,
        resourceId: `/f/${response.data.postId}`,
        text: response.data.content,
      };

      await createNotification(notificationData);

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["new-announcement"] });
      queryClient.invalidateQueries({ queryKey: ["user-feed"] });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  useEffect(() => {
    hasUserInput(form.formState.isDirty);
    hasUserImages(fileStates.length > 0);
  }, [form.formState.isDirty, fileStates, hasUserImages, hasUserInput]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={
                    checked ? "Post an announcement" : "What's on your mind?"
                  }
                  className={cn(
                    watchFormContent.length >= 90
                      ? "text-md h-[150px]"
                      : "h-[80px] text-xl",
                    "h-150px mb-5 resize-none border-none bg-transparent placeholder:font-medium",
                  )}
                  disabled={isLoading}
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={accordionValue}
          onValueChange={setAccourdionValue}
        >
          <AccordionItem value="item-1">
            <AccordionContent>
              <MultiImageDropzone
                value={fileStates}
                dropzoneOptions={{
                  maxFiles: 20,
                }}
                disabled={isLoading}
                onChange={setFileStates}
                onFilesAdded={async (addedFiles) => {
                  setFileStates([...fileStates, ...addedFiles]);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* <AnimatePresence>
          {openImageInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 225, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={cn("overflow-hidden rounded-md")}
            >
              <MultiImageDropzone
                value={fileStates}
                dropzoneOptions={{
                  maxFiles: 20,
                }}
                disabled={isLoading}
                onChange={setFileStates}
                onFilesAdded={async (addedFiles) => {
                  setFileStates([...fileStates, ...addedFiles]);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence> */}
        <div className="relative space-y-2">
          <div className="flex items-center justify-end space-x-[1px]">
            <Button
              className={cn(
                openImageInput && "bg-green-500/15",
                "group transition-all hover:bg-green-500/15 active:scale-95",
              )}
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setOpenImageInput((prev) => !prev);
                setAccourdionValue((prev) =>
                  prev === ""
                    ? "item-1"
                    : "" || prev === "item-1"
                      ? ""
                      : "item-1",
                );
              }}
              disabled={isLoading}
            >
              <ImagePlus
                className={cn(
                  openImageInput ? "text-green-500/70" : "text-foreground",
                  "h-5 w-5 group-hover:text-green-500/70",
                )}
              />
            </Button>
            <EmojiPicker
              onOpenEmojiPicker={setOpen}
              openEmojiPicker={open}
              isLoading={isLoading}
              handleEmojiClick={handleEmojiClick2}
              side="top"
              iconSize="w-5 h-5"
            />
          </div>
          <Button
            type="submit"
            className="w-full transition-none"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : <span>Post</span>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
