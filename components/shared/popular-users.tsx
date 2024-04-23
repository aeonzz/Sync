"use client";

import { UserProps, UsersCardProps } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactorSkeleton from "../loaders/reactor-skeleton";
import FetchDataError from "../ui/fetch-data-error";
import UserCard from "../cards/user-card";
import React from "react";

interface PopularUserProps {
  currentUserId: string;
}

const PopularUsers: React.FC<PopularUserProps> = ({ currentUserId }) => {
  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery<UsersCardProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/user/popular-users");
      return response.data.data;
    },
    refetchOnWindowFocus: false,
    queryKey: ["popular-users"],
  });

  return (
    <div className="flex flex-col space-y-3">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Popular users
      </h4>
      {queryLoading ? (
        <ReactorSkeleton />
      ) : (
        <div>
          {data?.map((user, index) => (
            <UserCard
              key={index}
              user={user}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularUsers;
