import NotFound from "@/app/not-found";
import PostCard from "@/components/cards/post-card";
import BackButton from "@/components/ui/back-button";
import CommentBox from "@/components/ui/comments-box";
import FetchDataError from "@/components/ui/fetch-data-error";
import { getPostById } from "@/lib/actions/post.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface PostDetailsProps {
  params: {
    postId: string;
  };
}

const PostDetails: React.FC<PostDetailsProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const currentUser = await getUserById(session!.user.id);
  const post = await getPostById(params.postId);

  if (!post.data) {
    return <NotFound className="w-full" />;
  }

  if (!currentUser.data || currentUser.error || post.error || !params.postId) {
    return <FetchDataError />;
  }

  if (!post.data.author.onboarded) {
    redirect("/onboarding");
  }
  return (
    <div className="flex flex-1 space-x-4">
      <div className="min-h-[400px] w-[550px]">
        <div className="flex h-[54px] items-center space-x-2">
          <BackButton />
          <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
            Post
          </h2>
        </div>
        <PostCard post={post.data} session={session} />
      </div>
      <div className="relative flex-1">
        <div className="sticky top-0 h-auto w-full overflow-hidden rounded-md">
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
    </div>
  );
};

export default PostDetails;
