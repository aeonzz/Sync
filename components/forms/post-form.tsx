"use client";

import { PostValidation } from "@/lib/validations/post";
import { PostProps, PostType } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
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
import { Textarea } from "../ui/textarea";
import Loader from "../loaders/loader";
import { ImagePlus, SmilePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileState, MultiImageDropzone } from "./multi-image";
import { useEdgeStore } from "@/lib/edgestore";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useMutationSuccess, useThemeStore } from "@/context/store";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { appendImage, deleteImage } from "@/lib/actions/image.actions";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { UpdatePost } from "@/lib/actions/post.actions";

interface PostFormProps {
  onMutationSuccess: (state: boolean) => void;
  hasUserInput: (state: boolean) => void;
  hasUserImages: (state: boolean) => void;
  onLoading: (state: boolean) => void;
  editData?: PostProps | null;
}

const PostForm: React.FC<PostFormProps> = ({
  onMutationSuccess,
  hasUserInput,
  hasUserImages,
  onLoading,
  editData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [openImageInput, setOpenImageInput] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [accordionValue, setAccourdionValue] = useState("item-1");
  const [editImages, setEditImages] = useState(editData?.imageUrls);
  const { edgestore } = useEdgeStore();
  const pathname = usePathname();
  const router = useRouter();
  const { isDark } = useThemeStore();
  const { setIsMutate } = useMutationSuccess();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: editData?.content ? editData.content : "",
      content: editData?.content ? editData.content : "",
    },
  });

  const watchFormContent = form.watch("content");
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentContent = form.getValues("content");

    const newContent = currentContent + emojiData.emoji;

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

  const { mutate: createpost } = useMutation({
    mutationFn: (newPost: PostType) => {
      return axios.post("/api/post", newPost);
    },
    onError: () => {
      setIsLoading(false);
      onLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: "Could not create post, Try again later.",
      });
    },
    onSuccess: async (data) => {
      const postId = data.data.postId;

      await Promise.all(
        imageUrls.map(async (url) => {
          const data = {
            url,
            postId,
          };
          await appendImage(data);
        }),
      );
      onMutationSuccess(false);
      toast("Posted.");
      router.refresh();
      setIsMutate(true);
    },
  });

  async function onSubmit(data: z.infer<typeof PostValidation>) {
    setOpenEmojiPicker(false);
    onLoading(true);
    setIsLoading(true);
    const gg = await Promise.all(
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

          setImageUrls((prevUrls) => [...prevUrls, res.url]);
          return res.url;
        } catch (err) {
          updateFileProgress(fileState.key, "ERROR");
        }
      }),
    );

    if (editData) {
      const updateData = {
        ...data,
        postId: editData.postId,
        path: pathname,
      };
      const response = await UpdatePost(updateData);

      if (response?.status === 200) {
        if (gg.length > 0 && editData) {
          await Promise.all(
            gg.map(async (url) => {
              if (url) {
                const data = {
                  url,
                  postId: editData.postId,
                };
                await appendImage(data);
              }
            }),
          );
        }
        onMutationSuccess(false);
        setIsLoading(false);
        setIsMutate(true);
        router.refresh()
      } else {
        toast.error("Uh oh! Something went wrong.", {
          description:
            "An error occurred while making the request. Please try again later",
        });
      }
    } else {
      createpost({
        ...data,
      });
    }
  }

  async function handleDeleteImage(
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) {
    e.preventDefault();

    const response = await deleteImage(id);

    if (response.status === 200) {
      setEditImages(editImages?.filter((image) => image.id !== id));
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  useEffect(() => {
    hasUserInput(form.formState.isDirty);
    hasUserImages(imageUrls.length !== 0);
  }, [form.formState.isDirty, imageUrls]);

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
                    watchFormContent.length >= 90
                      ? "text-md h-[150px]"
                      : "h-[80px] text-xl",
                    "h-150px mb-5 resize-none border-none bg-transparent placeholder:font-medium",
                  )}
                  disabled={isLoading}
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
          {editImages && editImages.length !== 0 && (
            <AccordionItem value="item-1" className="border-none">
              <AccordionContent>
                <ScrollArea className="h-[125px] rounded-md">
                  <div
                    className={cn(
                      editImages.length === 1 && "grid-cols-1",
                      editImages.length === 2 && "grid-cols-2",
                      editImages.length === 3 && "grid-cols-2",
                      //@ts-ignore
                      editImages.length >= 4 && "grid-cols-4",
                      "grid min-h-[200px] w-full grid-flow-row gap-2",
                    )}
                  >
                    {editImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative col-span-1 aspect-square rounded-md bg-secondary"
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="group absolute right-0 top-0 z-10 rounded-full bg-background/50"
                          onClick={(e) => {
                            handleDeleteImage(e, image.id);
                          }}
                        >
                          <X className="h-5 w-5 group-active:scale-95" />
                        </Button>
                        <Image
                          src={image.url as string}
                          alt={image.url as string}
                          fill
                          objectFit="cover"
                          priority
                          className="rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="item-2" className="border-none">
            <AccordionContent className="h-[225px]">
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
                setAccourdionValue((prev) =>
                  prev === "item-1"
                    ? "item-2"
                    : "item-1" || prev === ""
                      ? "item-1"
                      : "item-2",
                );
              }}
              disabled={isLoading}
            >
              <ImagePlus
                className={cn(
                  openImageInput ? "text-green-500/70" : "text-slate-500",
                  "group-hover:text-green-500/70",
                )}
              />
            </Button>
            <Button
              className={cn(
                openEmojiPicker && "bg-yellow-500/15",
                "group rounded-full transition-all hover:bg-yellow-500/15 active:scale-95",
              )}
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setOpenEmojiPicker((prev) => !prev);
              }}
              disabled={isLoading}
            >
              <SmilePlus
                className={cn(
                  openEmojiPicker ? "text-yellow-500/70" : "text-slate-500",
                  "group-hover:text-yellow-500/70",
                )}
              />
            </Button>
            <div className="absolute -right-[70%] -top-[360px]">
              <EmojiPicker
                open={openEmojiPicker}
                theme={isDark ? Theme.LIGHT : Theme.DARK}
                className="z-[100] !h-[400px] !w-full !rounded-lg !border-none !bg-card p-3 pb-6 shadow-md"
                lazyLoadEmojis={true}
                searchDisabled={true}
                onEmojiClick={handleEmojiClick}
                previewConfig={{
                  showPreview: false,
                }}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full transition-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>{editData ? <p>Conifrm</p> : <p>Post</p>}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
