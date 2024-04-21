"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { UserProps } from "@/types/user";
import Loader from "../loaders/loader";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { followUser } from "@/lib/actions/user.actions";
import ProfileHoverSkeleton from "../loaders/profile-hover-skeleton";
import { NotificationType } from "@prisma/client";
import { createNotification } from "@/lib/actions/notification.actions";

interface ProfileHoverProps {
  userId: string;
  currentUserId: string;
  showFollowButton: boolean;
}

interface User {
  data: UserProps & { isFollowedByCurrentUser: boolean };
}

const ProfileHover: React.FC<ProfileHoverProps> = ({
  userId,
  currentUserId,
  showFollowButton,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<User>({
    queryFn: async () => {
      const response = await axios.get(`/api/user/${userId}`);
      return response.data;
    },
    queryKey: ["userProfile", [userId]],
  });

  if (isLoading) return <ProfileHoverSkeleton />;

  if (!data || isError) return null;

  async function handleFollow() {
    const response = await followUser(currentUserId, userId);

    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["followedPost"] });

      if (!data?.data.isFollowedByCurrentUser) {
        const notificationData = {
          type: NotificationType.FOLLOW,
          from: currentUserId,
          resourceId: `/u/${currentUserId}`,
          text: "",
          recipientId: userId,
        };

        await createNotification(notificationData);
      }
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  const profile = data?.data.avatarUrl ? data.data.avatarUrl : undefined;
  const initialLetter = data?.data.username?.charAt(0).toUpperCase();
  const authorCreatedAt = new Date(data.data.createdAt);
  const date = format(authorCreatedAt, "PP");
  const fullname = `${data?.data.studentData.firstName} ${data?.data.studentData.middleName.charAt(0).toUpperCase()} ${data?.data.studentData.lastName}`;

  return (
    <>
      <div className="relative h-16 w-full">
        <Image
          src={data.data.coverUrl}
          alt={data.data.coverUrl}
          fill
          objectFit="cover"
          objectPosition="center"
        />
        <Avatar className="absolute -bottom-8 left-3 h-16 w-16 border-2 border-popover">
          <AvatarImage src={profile} alt={profile} />
          <AvatarFallback>{initialLetter}</AvatarFallback>
        </Avatar>
      </div>
      <div className="relative w-full space-y-1 p-4 pt-8">
        {showFollowButton && (
          <div className="absolute right-2 top-2">
            {currentUserId !== userId && (
              <Button
                size="sm"
                variant={
                  data.data.isFollowedByCurrentUser ? "outline" : "default"
                }
                className="!w-24"
                onClick={handleFollow}
              >
                {data.data.isFollowedByCurrentUser ? (
                  <span>Unfollow</span>
                ) : (
                  <span>Follow</span>
                )}
              </Button>
            )}
          </div>
        )}
        <Link
          href={`/u/${userId}`}
          className="flex items-center text-xl font-semibold underline-offset-4 hover:underline"
        >
          {data.data.username}
        </Link>
        <h4 className="text-xs text-muted-foreground">{fullname}</h4>
        <h4 className="text-xs text-muted-foreground">
          {data.data.studentData.department}
        </h4>
        <div className="flex items-center pt-2">
          <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
          <span className="text-xs text-muted-foreground">
            {`Joined ${date}`}
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileHover;
