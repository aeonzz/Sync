"use client";

import { CommentProps } from "@/types/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CommentCard from "../cards/comment-card";
import { comment } from "postcss";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useMutationSuccess } from "@/context/store";
import { useRouter } from "next/navigation";

interface CommentsProps {
  userId: string;
  postAuthor: string;
  avatarUrl: string | null;
  username: string | null;
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({
  userId,
  postAuthor,
  avatarUrl,
  username,
  postId,
}) => {
  const { isMutate, setIsMutate } = useMutationSuccess();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      const response = await axios.get(`/api/post/${postId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    queryKey: ["comments", [postId]],
  });

  const handleRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["comments"] });
    setIsMutate(false);
  };

  useEffect(() => {
    if (isMutate) {
      handleRefetch();
    }
  }, [isMutate]);

  return (
    <div>
      {isLoading ? (
        <h1>loading</h1>
        ) : (
          <>
          {comments?.data.length > 0 ? (
            comments?.data.map((comment: CommentProps, index: number) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                userId={userId}
                postId={postId}
                avatarUrl={avatarUrl}
                username={username}
                postAuthor={postAuthor}
                className={cn(index === 0 && "mt-3")}
              />
            ))
          ) : (
            <div className="flex h-80 w-full items-center justify-center">
              <h4 className="text-sm">No comments yet</h4>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comments;
