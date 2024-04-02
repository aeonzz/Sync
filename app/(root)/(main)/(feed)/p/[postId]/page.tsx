import PostCard from "@/components/cards/post-card";
import CommentBox from "@/components/ui/comments-box";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getPostById } from "@/lib/actions/post.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { PostProps } from "@/types/post";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface PostDetailsProps {
  params: {
    postId: string;
  };
}

const PostDetail: React.FC<PostDetailsProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const currentUser = await getUserById(session!.user.id);
  const post = await getPostById(params.postId);

  if (!post.data || post.error || !params.postId) {
    return <FetchDataError />;
  }

  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  if (!post.data.author.onboarded) {
    redirect("/onboarding");
  }

  return (
    <>
      <div className="min-h-[400px] w-[550px]">
        <PostCard post={post.data} session={session} />
      </div>
      <div className="relative flex-1">
        <div className="sticky top-[94px] h-[calc(100vh-82px)] w-full overflow-hidden rounded-md pl-2">
          <CommentBox
            avatarUrl={currentUser.data.avatarUrl}
            username={currentUser.data.username}
            userId={currentUser.data.id}
            session={session}
            comments={post.data.comment}
            postId={params.postId}
          />
        </div>
      </div>
    </>
  );
};

export default PostDetail;
