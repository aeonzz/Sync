"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Image as ImageIcon } from "lucide-react";
import BannerUploadForm from "../forms/banner-upload-form";
import { getBanner } from "@/lib/actions/banner.actions";
import { Card } from "./card";
import { useEffect, useState } from "react";
import { BannerType } from "@/types/banner";
import Image from "next/image";
import { ScrollArea } from "./scroll-area";

const Banners = () => {
  const [banners, setBanners] = useState<BannerType[]>();

  const gg = (url: string) => {
    
  };

  useEffect(() => {
    const getBanners = async () => {
      const response = await getBanner();
      const bannersData = response.data;
      if (bannersData !== null) {
        setBanners(bannersData);
      } else {
        setBanners([]);
      }
    };
    getBanners();
  }, []);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant="orange"
          size="sm"
          className="absolute -bottom-11 right-0 border"
        >
          <ImageIcon className="mr-2 h-5 w-5" />
          Banners
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ScrollArea className="h-40">
          <div className="grid w-full grid-flow-row grid-cols-2 gap-2 ">
            {banners?.map((banner, index) => (
              <Card
                className="relative col-span-1 aspect-video overflow-hidden rounded-sm"
                key={index}
                onClick={() => gg(banner.bannerUrl)}
              >
                <div className="absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:bg-background/40"></div>
                <Image src={banner.bannerUrl} alt={banner.bannerUrl} fill />
              </Card>
            ))}
          </div>
        </ScrollArea>
        {/* <BannerUploadForm /> */}
      </PopoverContent>
    </Popover>
  );
};

export default Banners;
