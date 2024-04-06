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
      <div className="flex h-[54px] items-center space-x-2">
        <BackButton />
        <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Post
        </h2>
      </div>
      <PostCard post={post.data} session={session} />
    </>
  );
};

export default PostDetail;
