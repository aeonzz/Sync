import PostCard from "@/components/cards/post-card";
import { getPosts } from "@/lib/actions/post.actions";
import { authOptions } from "@/lib/auth";
import { PostProps } from "@/types/post";
import { getServerSession } from "next-auth";
import React from "react";

const Event = async () => {
  const posts = await getPosts(1);
  const session = await getServerSession(authOptions)

  return (
    <>
      {posts.data?.length === 0 ? (
        <div>
          No post
        </div>
      ) : (
        <section className="min-h-[400px] w-[580px]">
          {posts.data?.map((post: PostProps) => (
            <PostCard key={post.postId} post={post} session={session} />
          ))}
        </section>
      )}
    </>
  );
};

export default Event;
