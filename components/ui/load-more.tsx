"use client";

import { getPosts } from "@/lib/actions/post.actions";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "../cards/post-card";
import { PostProps } from "@/types/post";
import { Session } from "next-auth";
import { Skeleton } from "./skeleton";
import NoPostMessage from "./no-post-message";

interface LoadMoreProps {
  session: Session | null;
}

const LoadMore: React.FC<LoadMoreProps> = ({ session }) => {
  const { ref, inView } = useInView();
  const [data, setData] = useState<PostProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>();
  console.log(hasNextPage);

  useEffect(() => {
    if (inView) {
      getPosts(page + 1).then((res) => {
        if (res.status === 200 && res.data) {
          setData([...data, ...res.data]);
          setHasNextPage(res.hasMore);
          setPage(page + 1);
        }
      });
    }
  }, [inView, page]);

  return (
    <div className="w-[580px]">
      {data.map((post) => (
        <PostCard key={post.postId} post={post} session={session} />
      ))}
      {hasNextPage === false ? (
        <NoPostMessage />
      ) : (
        <div ref={ref} className="mt-4 flex w-full flex-col gap-4 px-1">
          <div className=" h-[450px] w-full px-5 py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex flex-col">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-1 h-3 w-10" />
              </div>
            </div>
            <div className="mt-[30px] flex flex-col gap-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[70%]" />
              <Skeleton className="h-5 w-[50%]" />
            </div>
            <div className="flex h-44 w-full gap-2">
              <Skeleton className="mt-[20px] flex-1" />
              <Skeleton className="mt-[20px] flex-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadMore;
