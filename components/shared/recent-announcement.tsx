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

const RecentAnnouncement = () => {
  const { data, isLoading, isError } = useQuery<PostProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/announcement/latest");
      return response.data.data;
    },
    queryKey: ["new-announcement"],
  });

  if (isLoading) {
    return <h1>fukc this</h1>;
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
                <CardTitle>Latest Announcement</CardTitle>
                <Link
                  href="/announcement"
                  className={cn(buttonVariants({ variant: "link" }), "h-fit py-0")}
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
                    className="aspect-square h-[120px] rounded-sm border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
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
