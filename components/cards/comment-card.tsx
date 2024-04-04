import { Card } from "../ui/card";
import { CommentProps, PostProps } from "@/types/post";
import ProfileHover from "../shared/profile-hover";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { checkIfUserLikedComment } from "@/lib/actions/comment.actions";
import LikeButton from "../ui/like-button";
import { cn } from "@/lib/utils";

interface CommentCardProps {
  comment: CommentProps;
  userId: string;
  className: string;
}

const CommentCard: React.FC<CommentCardProps> = async ({
  comment,
  userId,
  className,
}) => {
  const commentCreatedAt = new Date(comment.createdAt);
  const commentCreated = formatDistanceToNowStrict(commentCreatedAt);
  const checkIfUserLiked = await checkIfUserLikedComment(userId, comment.id);

  // useEffect(() => {
  //   const checkUserLike = async () => {
  //     const liked = await checkIfUserLikedComment(userId, comment.id);
  //     setUserHasLiked(liked)
  //   };
  //   checkUserLike();
  // }, [userId, comment.id]);


  return (
    <div className={cn(className, "mb-5 w-full")}>
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
                className="text-sm font-semibold hover:underline"
              >
                {comment.user.username}
              </Link>
              <Separator orientation="vertical" className="mx-2" />
              <p className="text-[10px] text-muted-foreground">
                {commentCreated}
              </p>
            </div>
            <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
              {comment.text}
            </p>
          </Card>
        </div>
        <LikeButton
          userId={userId}
          commentId={comment.id}
          likeCount={comment._count.commentLike}
          liked={checkIfUserLiked}
          likedBy={comment.commentLike}
        />
      </div>
    </div>
  );
};

export default CommentCard;
