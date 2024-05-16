"use client";

import { UserProps } from "@/types/user";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { inviteUser } from "@/lib/actions/chat.actions";
import { toast } from "sonner";

interface InviteUserCardProps {
  user: UserProps;
  roomId: string;
}

const InviteUserCard: React.FC<InviteUserCardProps> = ({ user, roomId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setISAdded] = useState(false);

  async function handleInviteUser() {
    setIsLoading(true);

    const response = await inviteUser(roomId, user.id);

    if (response.status === 200) {
      setIsLoading(false);
      setISAdded(true);
    } else if (response.status === 208) {
      setIsLoading(false);
      toast.warning("User Already Exists!", {
        description: "User already in room.",
      });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage
            src={user.avatarUrl ?? undefined}
            className="object-cover"
            alt={user.avatarUrl ?? undefined}
          />
          <AvatarFallback>
            {user.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm">{user.username}</p>
          <p className="text-xs text-muted-foreground">{`${user.studentData.firstName} ${user.studentData.middleName.charAt(0).toUpperCase()} ${user.studentData.lastName}`}</p>
        </div>
      </div>
      <Button
        variant={isAdded ? "default" : "outline"}
        size="sm"
        disabled={isLoading}
        onClick={handleInviteUser}
      >
        {isAdded ? (
          <p>Added</p>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"none"}
              className="mr-2 text-primary"
            >
              <path
                d="M12 8V16M16 12L8 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Add
          </>
        )}
      </Button>
    </div>
  );
};

export default InviteUserCard;
