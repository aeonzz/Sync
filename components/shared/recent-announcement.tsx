"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FetchDataError from "../ui/fetch-data-error";
import { PostProps } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { differenceInHours, format, parseISO } from "date-fns";

const RecentAnnouncement = () => {
  const { data, isLoading, isError } = useQuery<PostProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/announcement/latest");
      return response.data.data;
    },
    queryKey: ["new-announcement"],
  });

  const shouldRenderBadge = (createdAt: Date) => {
    const now = new Date();
    const parseCreatedAt = format(createdAt, "yyyy-MM-dd HH:mm:ss");
    const createdAtDate = parseISO(parseCreatedAt);
    const diffHours = differenceInHours(now, createdAtDate);
    return diffHours <= 48;
  };

  if (isLoading) {
    return (
      <div className="h-[212px] w-full space-y-5 rounded-md border p-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex h-32 w-full space-x-2 rounded-md border p-2">
          <Skeleton className="h-full w-[120px] rounded-lg" />
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-3 w-[335px]" />
            <Skeleton className="h-3 w-[335px]" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <FetchDataError />;
  }

  return (
    <>
      {data
        ? data.map((announcement) => (
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex space-x-3">
                  <CardTitle>Latest Announcement</CardTitle>
                  {shouldRenderBadge(announcement.createdAt) && (
                    <Badge>New</Badge>
                  )}
                </div>
                <Link
                  href="/announcement"
                  className={cn(
                    buttonVariants({ variant: "link", size: "sm" }),
                    "h-fit py-0",
                  )}
                >
                  View all
                </Link>
              </CardHeader>
              <Link href={`/f/${announcement.postId}`}>
                <CardContent className="group m-2 mt-0 flex items-center space-x-2 rounded-xl bg-background p-2">
                  <Image
                    src={
                      announcement.imageUrls.length > 0 &&
                      announcement.imageUrls[0].url
                        ? announcement.imageUrls[0].url
                        : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/Group%2052%20(1).png"
                    }
                    width={120}
                    height={120}
                    alt="announcement-image"
                    objectFit="contain"
                    objectPosition="center"
                    quality={100}
                    placeholder={
                      announcement.imageUrls.length > 0 &&
                      announcement.imageUrls[0].blurDataUrl
                        ? "blur"
                        : undefined
                    }
                    blurDataURL={
                      announcement.imageUrls.length > 0 &&
                      announcement.imageUrls[0].blurDataUrl
                        ? announcement.imageUrls[0].blurDataUrl
                        : undefined
                    }
                    className="aspect-square h-[120px] rounded-lg border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
                  />
                  <CardDescription className="whitespace-pre-wrap break-words text-xs">
                    {announcement.content.slice(0, 320)}
                    {announcement.content.length > 320 && "..."}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))
        : null}
    </>
  );
};

export default RecentAnnouncement;
