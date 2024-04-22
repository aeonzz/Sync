"use client";

import { UserProps } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactorSkeleton from "../loaders/reactor-skeleton";
import UserCard from "../cards/user-card";

interface ReactorsProps {
  currentUserId: string;
  postId: string;
}

interface Reactor {
  data: {
    id: number;
    userId: string;
    user: UserProps;
    isFollowedByCurrentUser: boolean;
  }[];
}

const Reactors: React.FC<ReactorsProps> = ({ currentUserId, postId }) => {
  const { data: reactors, isLoading: queryLoading } = useQuery<Reactor>({
    queryFn: async () => {
      const response = await axios.get(`/api/post/reactors/${postId}`);
      return response.data;
    },
    queryKey: ["reactors", [postId]],
  });

  return (
    <div>
      {queryLoading ? (
        <ReactorSkeleton />
      ) : (
        <>
          {reactors?.data.map((reactor, index) => (
            <UserCard
              key={index}
              reactor={reactor}
              currentUserId={currentUserId}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Reactors;
