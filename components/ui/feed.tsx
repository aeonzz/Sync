"use client";

import { PostType } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "../cards/post-card";
import PostSkeleton from "../loaders/post-skeleton";
import FetchDataError from "./fetch-data-error";
import Loader from "../loaders/loader";

const Feed = () => {
  const { ref, inView } = useInView();

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
          <div>fuck</div>
        ) : null
      ) : (
        <div>
          {group.data.map((post: PostType) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>
      )}
    </div>
  ));

  useEffect(() => {
    // if the last element is in view and there is a next page, fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);
  
  return (
    <div className="w-[580px]">
      {status === 'pending' ? (
        <PostSkeleton />
      ) : status === "error" ? (
        <FetchDataError />
      ) : (
        content
      )}
      <div className='h-24 mt-10 flex justify-center' ref={ref}>
        {isFetchingNextPage ? <Loader /> : null}
      </div>
      {/* <div ref={ref}></div>  */}
    </div>
  );
};

export default Feed;
