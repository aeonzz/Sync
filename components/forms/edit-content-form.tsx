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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PostValidation } from "@/lib/validations/post";
import { cn } from "@/lib/utils";
import { Check, ImagePlus, Loader, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { UpdatePost } from "@/lib/actions/post.actions";
import { usePathname, useRouter } from "next/navigation";
import { PostProps } from "@/types/post";
import Image from "next/image";
import { appendImage, deleteImage } from "@/lib/actions/image.actions";
import { Card, CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import { useMutationSuccess } from "@/context/store";
import { FileState, MultiImageDropzone } from "./multi-image";
import { useEdgeStore } from "@/lib/edgestore";

interface EditContentFormProps {
  postId: string;
  content: string;
  setIsEditing: (state: boolean) => void;
  editData?: PostProps | null;
}
const EditContentForm: React.FC<EditContentFormProps> = ({
  postId,
  content,
  setIsEditing,
  editData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editImages, setEditImages] = useState(editData?.imageUrls);
  const { setIsMutate } = useMutationSuccess();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [openImageInput, setOpenImageInput] = useState(false);
  const [accordionValue, setAccourdionValue] = useState("item-1");
  const [isImageLoaded, setIsLoadedImage] = useState(false);
  const { edgestore } = useEdgeStore();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      content: content,
    },
  });
  const watchFormContent = form.watch("content");

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
    setIsLoading(true);

    const uploadNewImage = await Promise.all(
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

    const updateData = {
      ...data,
      postId,
      images: uploadNewImage,
    };

    const response = await UpdatePost(updateData);

    if (response.status === 200) {
      setIsMutate(true);
      setIsEditing(false);
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
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
      setIsMutate(true);
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

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
                {editImages && editImages.length !== 0 && (
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full overflow-hidden"
                  >
                    <CarouselContent className="-ml-[0.1px] p-1.5">
                      {editImages.map((image, index) => (
                        <CarouselItem
                          key={index}
                          className="pl-[0.1px] md:basis-1/3 lg:basis-1/5"
                        >
                          <div className="p-1">
                            <Card className="bg-background">
                              <CardContent className="relative flex aspect-square">
                                {isImageLoaded && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="group absolute -right-2 -top-2 z-10 h-7 w-7 rounded-full bg-destructive/50"
                                    onClick={(e) => {
                                      handleDeleteImage(e, image.id);
                                    }}
                                  >
                                    <X className="h-3 w-3 group-active:scale-95" />
                                  </Button>
                                )}
                                <Image
                                  src={image.url as string}
                                  alt={image.url as string}
                                  fill
                                  objectFit="cover"
                                  onLoad={() => setIsLoadedImage(true)}
                                  quality={1}
                                  className="rounded-md"
                                  placeholder="blur"
                                  blurDataURL={image.blurDataUrl}
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="item-2" className="border-none">
            <AccordionContent>
              <MultiImageDropzone
                className="bg-background"
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
        <div className="absolute -top-[73px] right-9 flex justify-end">
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
            {isLoading ? (
              <Loader2 className="animate-spin text-green-500/70" />
            ) : (
              <Check className="text-green-500/70" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditContentForm;
