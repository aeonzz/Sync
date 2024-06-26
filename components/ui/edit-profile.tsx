"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import EditProfileForm from "../forms/edit-profile-form";
import { UserProps } from "@/types/user";
import { Session } from "next-auth";
import {
  checkIfCurrentUserFollowedUser,
  followUser,
} from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NotificationType } from "@prisma/client";
import { createNotification } from "@/lib/actions/notification.actions";

interface ProfileActionsProps {
  userData: UserProps;
  session: Session;
  paramsId: string;
  currentUser: UserProps;
  isAlreadyFollowed: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  userData,
  session,
  paramsId,
  currentUser,
  isAlreadyFollowed,
}) => {
  const [open, setOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(
    isAlreadyFollowed,
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleFollow() {
    setIsLoading(true);
    const response = await followUser(currentUser.id, paramsId);

    if (response.status === 200) {
      setIsLoading(false);
      setIsFollowed(response.data);
      router.refresh();

      if (!isFollowed) {
        const notificationData = {
          type: NotificationType.FOLLOW,
          from: currentUser.id,
          resourceId: `/u/${currentUser.id}`,
          text: "",
          recipientId: paramsId,
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
    <div className="absolute -bottom-12 right-0 flex items-center space-x-2">
      {currentUser.id !== paramsId && (
        <Button
          size="sm"
          onClick={handleFollow}
          variant={isFollowed ? "secondary" : "default"}
          disabled={isLoading}
          className="!w-24"
        >
          {isFollowed ? <span>Unfollow</span> : <span>Follow</span>}
        </Button>
      )}
      {currentUser.id === paramsId && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit profile
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              if (isLoading) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>
            <EditProfileForm
              userData={userData}
              setOpen={setOpen}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProfileActions;
