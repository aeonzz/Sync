"use client"

import { Card } from "../ui/card";
import { ReplyProps } from "@/types/post";
import ProfileHover from "../shared/profile-hover";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { checkIfUserLikedComment } from "@/lib/actions/comment.actions";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import LikeButton from "../ui/like-button";
import CommentMenu from "../ui/comment-menu";

interface ReplyCardProps {
  reply: ReplyProps;
  userId: string;
  postId: string;
  avatarUrl: string | null;
  username: string | null;
  postAuthor: string;
  className: string;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  userId,
  postAuthor,
  postId,
  avatarUrl,
  username,
  className,
}) => {
  const replyCreatedAt = new Date(reply.createdAt);
  const replyCreated = formatDistanceToNowStrict(replyCreatedAt);

  return (
    <div className={cn(className, "mb-3")}>
      <div className="flex space-x-2">
        <div className="flex flex-col items-center justify-start gap-1">
          <ProfileHover
            authorId={reply.user.id}
            avatarUrl={reply.user.avatarUrl}
            coverUrl={reply.user.coverUrl}
            userJoined={reply.user.createdAt}
            username={reply.user.username}
            firstName={reply.user.studentData.firstName}
            middleName={reply.user.studentData.middleName}
            lastName={reply.user.studentData.lastName}
            department={reply.user.studentData.department}
            className="h-7 w-7"
          />
          <div className="h-full w-px bg-stone-800" />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Card className="flex w-fit flex-col space-y-1 p-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/u/${reply.user.id}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {reply.user.username}
                  </Link>
                  {postAuthor === reply.user.id && (
                    <Badge
                      variant="secondary"
                      className=" text-[10px] font-normal"
                    >
                      Author
                    </Badge>
                  )}
                  <Separator orientation="vertical" />
                  <p className="text-[10px] text-muted-foreground">
                    {replyCreated}
                  </p>
                </div>
                <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
                  {reply.text}
                </p>
              </Card>
              {userId === reply.user.id && (
                <CommentMenu
                  commentId={reply.id}
                  avatarUrl={avatarUrl}
                  username={username}
                  userId={userId}
                  postId={postId}
                  text={reply.text}
                />
              )}
            </div>
            <LikeButton
              userId={userId}
              commentId={reply.id}
              likeCount={reply._count.commentLike}
              likedBy={reply.commentLike}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
