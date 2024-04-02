"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "../cards/post-card";
import FetchDataError from "./fetch-data-error";
import Loader from "../loaders/loader";
import { PostProps } from "@/types/post";
import { useMutationSuccess } from "@/context/store";
import { Session } from "next-auth";
import PostSkeleton from "../loaders/post-skeleton";
import NoPostMessage from "./no-post-message";

const Feed = ({ session }: { session: Session | null }) => {
  const { ref, inView } = useInView();
  const { isMutate, setIsMutate } = useMutationSuccess();

  const fetchPosts = async ({ pageParam = 0 }) => {
    const res = await axios.get(`/api/post?cursor=${pageParam}`);
    return res.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["post"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  const content = data?.pages.map((group, i) => (
    <div key={i}>
      {group.data.length === 0 ? (
        status === "success" ? (
          <NoPostMessage />
        ) : null
      ) : (
        <div>
          {group.data.map((post: PostProps) => (
            <PostCard key={post.postId} post={post} session={session} />
          ))}
        </div>
      )}
    </div>
  ));
  
  const handleRefetch = () => {
    refetch();
    setIsMutate(false);
  };

  useEffect(() => {
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <div>
      {status === "pending" ? (
        <PostSkeleton />
      ) : status === "error" ? (
        <FetchDataError />
      ) : (
        content
      )}
      <div className="mt-10 flex h-24 justify-center" ref={ref}>
        {isFetchingNextPage ? <Loader /> : null}
      </div>
      {/* <div ref={ref}></div>  */}
    </div>
  );
};

export default Feed;
