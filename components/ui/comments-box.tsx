

import { CommentProps } from "@/types/post";
import CommentForm from "../forms/comment-form";
import { Session } from "next-auth";
import CommentCard from "../cards/comment-card";
import { ScrollArea } from "./scroll-area";

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
    <div className="flex flex-col space-y-3 relative mt-4">
      <h3 className="font-semibold text-lg">Comments</h3>
      <ScrollArea className="h-[calc(100vh-230px)] max-h-[508px]">
        {comments?.length !== 0 &&
          comments?.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))}
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
