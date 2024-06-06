import NotFound from "@/app/not-found";
import PostCard from "@/components/cards/post-card";
import PostSkeleton from "@/components/loaders/post-skeleton";
import BackButton from "@/components/ui/back-button";
import { Card } from "@/components/ui/card";
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

  if (!session) {
    redirect("/login");
  }

  const currentUser = await getUserById(session.user.id);

  if (!currentUser.data || currentUser.error) {
    return <FetchDataError />;
  }

  const post = await getPostById(params.postId, currentUser.data.id);

  if (post.error) {
    return <FetchDataError />;
  }

  if (!post.data || !params.postId) {
    return <NotFound className="w-full" />;
  }

  if (!post.data.author.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="mt-3 flex flex-1 space-x-3 pr-4">
      <div className="min-h-[400px] w-[550px] space-y-3">
        <Card className="flex h-[54px] items-center space-x-2 px-2">
          <BackButton />
          <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
            Post
          </h2>
        </Card>
        <PostCard
          post={post.data}
          session={session}
          detailsView={true}
          currentUserData={currentUser.data}
        />
      </div>
      <div className="relative flex-1">
        <div className="sticky top-0 h-auto w-full rounded-md">
          <CommentBox
            avatarUrl={currentUser.data.avatarUrl}
            username={currentUser.data.username}
            userId={currentUser.data.id}
            postId={params.postId}
            postAuthor={post.data.author.id}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
