import { CommentProps } from "@/types/post";
import CommentForm from "../forms/comment-form";
import { Session } from "next-auth";
import CommentCard from "../cards/comment-card";
import { ScrollArea } from "./scroll-area";
import { checkIfUserLikedComment } from "@/lib/actions/comment.actions";

interface CommentBoxProps {
  avatarUrl: string | null;
  username: string | null;
  userId: string;
  session: Session | null;
  postId: string;
  comments: CommentProps[] | null;
}

const CommentBox: React.FC<CommentBoxProps> = async ({
  avatarUrl,
  username,
  userId,
  session,
  postId,
  comments,
}) => {

  return (
    <div className="relative mt-4 flex flex-col space-y-4">
      <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
        Comments
      </h2>
      <ScrollArea className="h-[calc(100vh-180px)] max-h-[538px]">
        {comments?.length !== 0 ? (
          comments?.map((comment, index) => (
            <CommentCard key={index} comment={comment} userId={session!.user.id} />
          ))
        ) : (
          <div className="flex h-80 w-full items-center justify-center">
            <h4 className="text-sm">No comments</h4>
          </div>
        )}
      </ScrollArea>
      <CommentForm
        avatarUrl={avatarUrl}
        username={username}
        userId={userId}
        session={session}
        postId={postId}
      />
    </div>
  );
};

export default CommentBox;
