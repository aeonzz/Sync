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
import ReplyBox from "../ui/reply-box";
import { Badge } from "../ui/badge";
import ReplyCard from "./reply-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CommentCardProps {
  comment: CommentProps;
  userId: string;
  postId: string;
  postAuthor: string;
  className: string;
  avatarUrl: string | null;
  username: string | null;
}

const CommentCard: React.FC<CommentCardProps> = async ({
  comment,
  userId,
  postId,
  postAuthor,
  className,
  avatarUrl,
  username,
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
    <div className="mb-3">
      <div className={cn(className, "w-full space-y-1")}>
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
              <div className="flex items-center gap-2">
                <Link
                  href={`/u/${comment.user.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {comment.user.username}
                </Link>
                {postAuthor === comment.user.id && (
                  <Badge
                    variant="secondary"
                    className=" text-[10px] font-normal"
                  >
                    Author
                  </Badge>
                )}
                <Separator orientation="vertical" />
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
        <ReplyBox
          avatarUrl={avatarUrl}
          username={username}
          userId={userId}
          postId={postId}
          parentId={comment.id}
        />
      </div>
      {comment.replies.length !== 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-transparent">
            <AccordionTrigger className="ml-10 mt-1 !flex-none justify-start gap-1 py-0 text-xs text-muted-foreground">
              View {comment._count.replies} replies
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {comment.replies.map((reply, index) => (
                <ReplyCard
                  key={index}
                  reply={reply}
                  userId={userId}
                  postAuthor={postAuthor}
                  className={cn(index === 0 && "mt-3")}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default CommentCard;
