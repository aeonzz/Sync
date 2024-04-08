import { Card } from "../ui/card";
import { CommentProps, PostProps } from "@/types/post";
import ProfileHover from "../shared/profile-hover";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import {
  checkIfUserLikedComment,
  deleteComment,
} from "@/lib/actions/comment.actions";
import LikeButton from "../ui/like-button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import ReplyCard from "./reply-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CommentForm from "../forms/comment-form";
import CommentMenu from "../ui/comment-menu";

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

  return (
    <div className={cn(className, "mb-3")}>
      <div className="flex space-x-2">
        <div className="flex flex-col items-center justify-start gap-1">
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
          <div className="h-[calc(100%-45px)] w-px bg-stone-800" />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
                  <p className="text-[10px] text-muted-foreground">
                    {commentCreated}
                  </p>
                </div>
                <p className="whitespace-pre-wrap break-words break-all text-sm font-light">
                  {comment.text}
                </p>
              </Card>
              {userId === comment.user.id && (
                <CommentMenu
                  commentId={comment.id}
                  avatarUrl={avatarUrl}
                  username={username}
                  userId={userId}
                  postId={postId}
                  text={comment.text}
                />
              )}
            </div>
            <LikeButton
              userId={userId}
              commentId={comment.id}
              likeCount={comment._count.commentLike}
              liked={checkIfUserLiked}
              likedBy={comment.commentLike}
            />
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-transparent">
              <AccordionTrigger className="mt-1 !flex-none justify-start gap-1 py-0 pl-3 text-xs text-muted-foreground">
                {comment.replies.length > 0 ? (
                  <p>View {comment._count.replies} replies</p>
                ) : (
                  "Reply"
                )}
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
                <CommentForm
                  avatarUrl={avatarUrl}
                  username={username}
                  userId={userId}
                  postId={postId}
                  parentId={comment.id}
                  className="mt-2 pr-4"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
