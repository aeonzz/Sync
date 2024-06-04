"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { EventProps } from "@/types/event";
import FetchDataError from "../ui/fetch-data-error";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

const RecentEvents = () => {
  const { data, isLoading, isError } = useQuery<EventProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/event/latest");
      return response.data.data;
    },
    queryKey: ["recent-events"],
  });

  if (isLoading) {
    return (
      <div className="h-[212px] w-full space-y-5 rounded-md border p-4"></div>
    );
  }

  if (isError || !data) {
    return <FetchDataError />;
  }

  return (
    <Card className="w-[523px]">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent Events</CardTitle>
        <Link
          href="/event"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "h-fit py-0",
          )}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="group m-2 mt-0 flex items-center space-x-2 rounded-xl bg-background p-2">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {data.map((event, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-1">
                <div className="p-1">
                  <Card>
                    <Link href={`/e/${event.id}/overview`}>
                      <CardContent className="flex aspect-square flex-col p-0">
                        <Image
                          src={
                            event.image
                              ? event.image
                              : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/Group%2052%20(1).png"
                          }
                          width={300}
                          height={300}
                          alt="announcement-image"
                          objectFit="contain"
                          objectPosition="center"
                          quality={100}
                          placeholder={event.blurDataUrl ? "blur" : undefined}
                          blurDataURL={
                            event.blurDataUrl ? event.blurDataUrl : undefined
                          }
                          className="h-[120px] w-full rounded-t-lg border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
                        />
                        <CardDescription className="whitespace-pre-wrap break-words p-2 text-xs">
                          {event.description.slice(0, 150)}
                          {event.description.length > 150 && "..."}
                        </CardDescription>
                      </CardContent>
                    </Link>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
