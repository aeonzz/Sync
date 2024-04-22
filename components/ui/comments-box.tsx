import { CommentProps } from "@/types/post";
import CommentForm from "../forms/comment-form";
import CommentCard from "../cards/comment-card";
import { ScrollArea } from "./scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";
import Comments from "./comments";

interface CommentBoxProps {
  avatarUrl: string | null;
  username: string | null;
  userId: string;
  postId: string;
  postAuthor: string;
}

const CommentBox: React.FC<CommentBoxProps> = async ({
  avatarUrl,
  username,
  userId,
  postId,
  postAuthor,
}) => {
  return (
    <div className="relative mt-4 flex flex-col space-y-2 bg-background">
      <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
        Comments
      </h2>
      <CommentForm
        avatarUrl={avatarUrl}
        username={username}
        userId={userId}
        postId={postId}
        postAuthor={postAuthor}
      />
      <ScrollArea className="relative h-[calc(100vh-180px)]">
        <div className="absolute z-20 h-5 w-full bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 z-20 h-5 w-full bg-gradient-to-t from-background to-transparent" />
        <Comments
          userId={userId}
          avatarUrl={avatarUrl}
          username={username}
          postAuthor={postAuthor}
          postId={postId}
        />
      </ScrollArea>
      <Separator className="border" />
    </div>
  );
};

export default CommentBox;
