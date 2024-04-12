"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "./scroll-area";
import { UserProps } from "@/types/user";
import Link from "next/link";
import {
  checkIfCurrentUserFollowedUser,
  followUser,
} from "@/lib/actions/user.actions";
import { Button } from "./button";
import { toast } from "sonner";
import ProfileHover from "../shared/profile-hover";
import Loader from "../loaders/loader";
import { useRouter } from "next/navigation";

interface FfProps {
  authorId: string;
  currentUserId: string;
  avatarUrl: string | null;
  coverUrl: string;
  userJoined: Date;
  username: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
}

const Ff: React.FC<FfProps> = ({
  authorId,
  currentUserId,
  avatarUrl,
  coverUrl,
  userJoined,
  username,
  firstName,
  middleName,
  lastName,
  department,
}) => {
  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log(isFollowed);

  async function handleFollow() {
    setIsLoading(true);
    const response = await followUser(currentUserId, authorId);

    if (response.status === 200) {
      setIsLoading(false);
      setIsFollowed(response.data ?? null);
      router.refresh();
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  useEffect(() => {
    const isAlreadyFollowed = async () => {
      const response = await checkIfCurrentUserFollowedUser(
        currentUserId,
        authorId,
      );
      setIsFollowed(response);
    };
    isAlreadyFollowed();
  }, [currentUserId, authorId, isFollowed, setIsFollowed]);

  return (
    <div className="flex w-full items-center justify-between rounded-md p-2 hover:bg-card">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-2">
          <ProfileHover
            authorId={authorId}
            currentUserId={currentUserId}
            avatarUrl={avatarUrl}
            coverUrl={coverUrl}
            userJoined={userJoined}
            username={username}
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
            department={department}
            side="left"
            align="start"
            sideOffset={20}
          />
          <Link
            href={`/p/${authorId}`}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            {username}
          </Link>
        </div>
        {/* {isFollowed === null ? (
          <Loader />
        ) : ( */}
        {currentUserId !== authorId && (
          <Button
            size="sm"
            onClick={handleFollow}
            variant={isFollowed ? "secondary" : "default"}
            disabled={isLoading}
            className="!w-24"
          >
            {isFollowed === null ? (
              <Loader />
            ) : (
              <>{isFollowed ? <span>Unfollow</span> : <span>Follow</span>}</>
            )}
          </Button>
        )}
        {/* )} */}
      </div>
    </div>
  );
};

export default Ff;
