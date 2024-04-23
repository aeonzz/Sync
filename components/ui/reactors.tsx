"use client";

import { UsersCardProps, UserProps } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactorSkeleton from "../loaders/reactor-skeleton";
import UserCard from "../cards/user-card";
import FetchDataError from "./fetch-data-error";

interface ReactorsProps {
  currentUserId: string;
  postId: string;
}

const Reactors: React.FC<ReactorsProps> = ({ currentUserId, postId }) => {
  const {
    data: reactors,
    isLoading: queryLoading,
    isError,
  } = useQuery<UsersCardProps[]>({
    queryFn: async () => {
      const response = await axios.get(`/api/post/reactors/${postId}`);
      return response.data.data;
    },
    queryKey: ["reactors", [postId]],
  });

  return (
    <div>
      {queryLoading ? (
        <ReactorSkeleton />
      ) : isError ? (
        <FetchDataError />
      ) : (
        <>
          {reactors?.map((reactor, index) => (
            <UserCard
              key={index}
              user={reactor}
              currentUserId={currentUserId}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Reactors;
