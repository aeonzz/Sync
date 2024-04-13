"use client";

import React, { useState } from "react";
import { UserProps } from "@/types/user";
import Link from "next/link";
import { followUser } from "@/lib/actions/user.actions";
import { Button } from "./button";
import { toast } from "sonner";
import Loader from "../loaders/loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import ReactorSkeleton from "../loaders/reactor-skeleton";
import ProfileHover from "../shared/profile-hover";

interface ReactorsProps {
  currentUserId: string;
  postId: string;
}

interface Reactor {
  data: {
    id: number;
    userId: string;
    postId: string;
    user: UserProps;
    isFollowedByCurrentUser: boolean;
  }[];
}

const Reactors: React.FC<ReactorsProps> = ({ currentUserId, postId }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: reactors, isLoading: queryLoading } = useQuery<Reactor>({
    queryFn: async () => {
      const response = await axios.get(`/api/post/reactors/${postId}`);
      return response.data;
    },
    queryKey: ["reactors", [postId]],
  });

  async function handleFollow(userId: string) {
    setIsLoading(true);
    const response = await followUser(currentUserId, userId);

    if (response.status === 200) {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["reactors"] });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <div>
      {queryLoading ? (
        <ReactorSkeleton />
      ) : (
        <>
          {reactors?.data.map((reactor, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between rounded-md p-2 hover:bg-card"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HoverCard openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Link
                        href={`/u/${reactor.userId}`}
                        className="group relative"
                      >
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
                    variant={
                      reactor.isFollowedByCurrentUser ? "secondary" : "default"
                    }
                    className="!w-24"
                    onClick={() => handleFollow(reactor.userId)}
                  >
                    {reactor.isFollowedByCurrentUser ? (
                      <span>Unfollow</span>
                    ) : (
                      <span>Follow</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Reactors;
