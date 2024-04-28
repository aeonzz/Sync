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
import { UserProps, UsersCardProps } from "@/types/user";
import { followUser } from "@/lib/actions/user.actions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NotificationType } from "@prisma/client";
import { createNotification } from "@/lib/actions/notification.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserCardProps {
  user: UsersCardProps;
  currentUserId: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUserId }) => {
  const queryClient = useQueryClient();
  const [hoverText, setHoverText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleFollow(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    setIsLoading(true);
    const response = await followUser(currentUserId, user.user.id);

    if (response.status === 200) {
      setOpen(false);
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["reactors"] });
      queryClient.invalidateQueries({ queryKey: ["popular-users"] });
      queryClient.invalidateQueries({ queryKey: ["add-message-users"] });

      if (!user.isFollowedByCurrentUser) {
        const notificationData = {
          type: NotificationType.FOLLOW,
          from: currentUserId,
          resourceId: `/u/${currentUserId}`,
          text: "",
          recipientId: user.user.id,
        };

        await createNotification(notificationData);
      }
    } else {
      setIsLoading(false);
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
              <Link href={`/u/${user.user.id}`} className="group relative">
                <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                <Avatar>
                  <AvatarImage
                    src={user.user.avatarUrl ? user.user.avatarUrl : undefined}
                    className="object-cover"
                    alt={user.user.avatarUrl ? user.user.avatarUrl : undefined}
                  />
                  <AvatarFallback>
                    {user.user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="min-h-32 w-[250px]"
              hideWhenDetached={true}
            >
              <ProfileHover
                userId={user.user.id}
                showFollowButton={false}
                currentUserId={currentUserId}
              />
            </HoverCardContent>
          </HoverCard>
          <div>
            <Link
              href={`/u/${user.user.id}`}
              className="flex items-center gap-1 text-sm hover:underline"
            >
              {user.user.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {user.user._count.following} followers
            </p>
          </div>
        </div>
        {currentUserId !== user.user.id && (
          <Button
            size="sm"
            variant={user.isFollowedByCurrentUser ? "outline" : "default"}
            className="!w-24"
            onClick={(e) => {
              user.isFollowedByCurrentUser ? setOpen(true) : handleFollow(e);
            }}
            onMouseEnter={() => setHoverText(user.isFollowedByCurrentUser ? true : false)}
            onMouseLeave={() => setHoverText(false)}
          >
            {hoverText ? (
              <p className="text-red-500">Unfollow</p>
            ) : (
              <>{user.isFollowedByCurrentUser ? <p>Following</p> : <p>Follow</p>}</>
            )}
          </Button>
        )}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unfollow user?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unfollow this user? This action cannot
                be undone and you will no longer see their posts or updates in
                your feed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={(e) => handleFollow(e)}
              >
                Unfollow
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserCard;
