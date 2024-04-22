"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileHover from "../shared/profile-hover";
import { Button } from "../ui/button";
import { UserProps } from "@/types/user";
import { followUser } from "@/lib/actions/user.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NotificationType } from "@prisma/client";
import { createNotification } from "@/lib/actions/notification.actions";

interface UserCardProps {
  reactor: {
    id: number;
    userId: string;
    user: UserProps;
    isFollowedByCurrentUser: boolean;
  };
  currentUserId: string;
}

const UserCard: React.FC<UserCardProps> = ({
  reactor,
  currentUserId,
}) => {
  const queryClient = useQueryClient();
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(
    reactor.isFollowedByCurrentUser,
  );

  async function handleFollow() {
    const response = await followUser(currentUserId, reactor.userId);

    if (response.status === 200) {
      setIsFollowed(response.data);
      queryClient.invalidateQueries({ queryKey: ["reactors"] });

      if (!isFollowed) {
        const notificationData = {
          type: NotificationType.FOLLOW,
          from: currentUserId,
          resourceId: `/u/${currentUserId}`,
          text: "",
          recipientId: reactor.userId,
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

  return (
    <div className="flex w-full items-center justify-between rounded-md p-2 hover:bg-card">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Link href={`/u/${reactor.userId}`} className="group relative">
                <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                <Avatar>
                  <AvatarImage
                    src={
                      reactor.user.avatarUrl
                        ? reactor.user.avatarUrl
                        : undefined
                    }
                    className="object-cover"
                    alt={
                      reactor.user.avatarUrl
                        ? reactor.user.avatarUrl
                        : undefined
                    }
                  />
                  <AvatarFallback>
                    {reactor.user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="min-h-32 w-[250px]"
              hideWhenDetached={true}
            >
              <ProfileHover
                userId={reactor.userId}
                showFollowButton={false}
                currentUserId={currentUserId}
              />
            </HoverCardContent>
          </HoverCard>
          <Link
            href={`/u/${reactor.userId}`}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {reactor.user.username}
          </Link>
        </div>
        {currentUserId !== reactor.userId && (
          <Button
            size="sm"
            variant={isFollowed ? "secondary" : "default"}
            className="!w-24"
            onClick={() => handleFollow()}
          >
            {isFollowed ? <span>Unfollow</span> : <span>Follow</span>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
