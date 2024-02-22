import { PostType } from "@/types/post";
import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import ProfileHover from "../shared/profile-hover";
import { format } from "date-fns";

interface PostCardProps {
  post: PostType;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const authorCreatedAt = new Date(post.author.createdAt);
  return (
    <Card className="mb-7 h-[630px]">
      <CardHeader className="border">
        <ProfileHover
          username={post.author.username}
          date={format(authorCreatedAt, "PP")}
        />
      </CardHeader>
    </Card>
  );
};

export default PostCard;
