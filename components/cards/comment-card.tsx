"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CommentProps, PostProps } from "@/types/post";
import ProfileHover from "../shared/profile-hover";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { likeComment } from "@/lib/actions/comment.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CommentCardProps {
  comment: CommentProps;
  userId: string;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, userId }) => {
  const commentCreatedAt = new Date(comment.createdAt);
  const commentCreated = formatDistanceToNowStrict(commentCreatedAt);
  const [showFullContent, setShowFullContent] = useState(false);
  const router = useRouter();

  const contentToDisplay = showFullContent
    ? comment.text
    : comment.text.slice(0, 200);

  async function handleLike() {
    const data = {
      userId,
      commentId: comment.id,
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
    <div className="mb-5 w-full">
      <div className="flex items-center justify-between gap-10">
        <div className="relative flex">
          <div className="h-full w-9">
            <div className="absolute left-0">
              <ProfileHover
                authorId={comment.user.id}
                avatarUrl={comment.user.avatarUrl}
                coverUrl={comment.user.coverUrl}
                userJoined={comment.user.createdAt}
                username={comment.user.username}
                firstName={comment.user.studentData.firstName}
                middleName={comment.user.studentData.middleName}
                lastName={comment.user.studentData.lastName}
                department={comment.user.studentData.department}
                className="h-7 w-7"
              />
            </div>
          </div>
          <Card className="flex w-fit flex-col space-y-1 p-2">
            <div className="flex items-center">
              <Link
                href={`/u/${comment.user.id}`}
                className="text-sm font-semibold"
              >
                {comment.user.username}
              </Link>
              <Separator orientation="vertical" className="mx-2" />
              <p className="text-[10px] text-muted-foreground">
                {commentCreated}
              </p>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm font-light">
              {contentToDisplay}
              {comment.text.length > 200 && (
                <Button
                  variant="link"
                  onClick={() => setShowFullContent((prev) => !prev)}
                  className="-mt-5 ml-1 p-0 text-xs text-slate-200"
                >
                  {showFullContent ? "See Less" : "...See More"}
                </Button>
              )}
            </p>
          </Card>
        </div>
        <div className="mr-2 space-y-1">
          <Button variant="ghost" size="iconRound" onClick={() => handleLike()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </Button>
          <p className="text-center text-xs">{comment._count.commentLike}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
