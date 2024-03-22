import PostCard from "@/components/cards/post-card";
import LoadMore from "@/components/ui/load-more";
import { getPosts } from "@/lib/actions/post.actions";
import { PostProps } from "@/types/post";
import { Session } from "next-auth";
import React from "react";
import NoPostMessage from "./no-post-message";

const Feed = async ({ session }: { session: Session | null }) => {
  const posts = await getPosts(1);

  return (
    <>
      {posts.data?.length === 0 ? (
        <NoPostMessage />
      ) : (
        <section className="w-[580px]">
          {posts.data?.map((post: PostProps) => (
            <PostCard key={post.postId} post={post} session={session} />
          ))}
          <LoadMore session={session} />
        </section>
      )}
    </>
  );
};

export default Feed;
