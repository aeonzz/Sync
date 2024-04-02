import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CommentProps, PostProps } from "@/types/post";
import ProfileHover from "../shared/profile-hover";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "../ui/separator";

interface CommentCardProps {
  comment: CommentProps;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const commentCreatedAt = new Date(comment.createdAt);
  const commentCreated = formatDistanceToNow(commentCreatedAt, {
    addSuffix: true,
  });
  return (
    <div className="relative mb-3 flex">
      <div className="h-full w-12">
        <div className="absolute left-0">
          <ProfileHover
            authorId={comment.user.id}
            avatarUrl={comment.user.avatarUrl}
            coverUrl={comment.user.coverUrl}
            userJoined={comment.user.createdAt}
            username={comment.user.username}
            firstName={comment.user.StudentData.firstName}
            middleName={comment.user.StudentData.middleName}
            lastName={comment.user.StudentData.lastName}
            department={comment.user.StudentData.department}
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
          <p className="text-[10px] text-muted-foreground">{commentCreated}</p>
        </div>
        <p className="text-sm font-light">{comment.text}</p>
      </Card>
    </div>
  );
};

export default CommentCard;
