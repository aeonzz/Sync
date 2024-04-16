"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { X } from "lucide-react";

interface ImageViewProps {
  openImageViewer: boolean;
  setOpenImageViewer: (state: boolean) => void;
  imageUrls: {
    id: number;
    url: string | null;
    postId: string;
    blurDataUrl: string;
  }[];
}

const ImageView: React.FC<ImageViewProps> = ({
  openImageViewer,
  setOpenImageViewer,
  imageUrls,
}) => {
  return (
    <Dialog open={openImageViewer} onOpenChange={setOpenImageViewer}>
      <DialogImage className="max-h-[80%] !w-fit !overflow-visible border-none">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <Carousel className="w-full">
          <CarouselContent className="flex items-center">
            {imageUrls.map((image) => (
              <CarouselItem
                key={image.id}
                className="flex h-full w-full items-center justify-center"
              >
                <div className="flex h-[500px] w-fit items-center">
                  <Image
                    className="object-cover object-center"
                    src={image.url ?? ""}
                    alt="post image"
                    width={400}
                    height={400}
                    quality={100}
                    placeholder="blur"
                    blurDataURL={image.blurDataUrl}
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogImage>
    </Dialog>
  );
};

export default ImageView;
