import { CommentProps } from "@/types/post";
import CommentForm from "../forms/comment-form";
import { Session } from "next-auth";
import CommentCard from "../cards/comment-card";
import { ScrollArea } from "./scroll-area";
import { checkIfUserLikedComment } from "@/lib/actions/comment.actions";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";

interface CommentBoxProps {
  avatarUrl: string | null;
  username: string | null;
  userId: string;
  postId: string;
  postAuthor: string;
  comments: CommentProps[] | null;
}

const CommentBox: React.FC<CommentBoxProps> = async ({
  avatarUrl,
  username,
  userId,
  postId,
  comments,
  postAuthor,
}) => {
  return (
    <div className="relative mt-4 flex flex-col space-y-2 ">
      <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
        Comments
      </h2>
      <CommentForm
        avatarUrl={avatarUrl}
        username={username}
        userId={userId}
        postId={postId}
      />
      <ScrollArea className="relative h-[calc(100vh-180px)]">
        <div className="absolute z-20 h-5 w-full bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 z-20 h-10 w-full bg-gradient-to-t from-background to-transparent" />
        {comments?.length !== 0 ? (
          comments?.map((comment, index) => (
            <CommentCard
              key={index}
              comment={comment}
              userId={userId}
              postId={postId}
              avatarUrl={avatarUrl}
              username={username}
              postAuthor={postAuthor}
              className={cn(index === 0 && "mt-3")}
            />
          ))
        ) : (
          <div className="flex h-80 w-full items-center justify-center">
            <h4 className="text-sm">No comments yet</h4>
          </div>
        )}
      </ScrollArea>
      <Separator className="border" />
    </div>
  );
};

export default CommentBox;
