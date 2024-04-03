"use client";

import { likeComment } from "@/lib/actions/comment.actions";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  userId: string;
  commentId: number;
  likeCount: number;
  liked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  userId,
  commentId,
  likeCount,
  liked,
}) => {
  const router = useRouter();

  async function handleLike() {
    const data = {
      userId,
      commentId,
    };

    const response = await likeComment(data);

    if (response.status === 200) {
      router.refresh();
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <div className="mr-2 space-y-1">
      <Button variant="ghost" size="iconRound" onClick={() => handleLike()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={cn(liked && "fill-red-500 stroke-red-500", "h-6 w-6")}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </Button>
      <p className="text-center text-xs">{likeCount}</p>
    </div>
  );
};

export default LikeButton;
