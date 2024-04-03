import PostCard from "@/components/cards/post-card";
import { authOptions } from "@/lib/auth";
import { PostProps } from "@/types/post";
import { getServerSession } from "next-auth";
import React from "react";

const Event = async () => {
  const session = await getServerSession(authOptions)

  return (
    <>
    </>
  );
};

export default Event;
