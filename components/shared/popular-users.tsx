"use client";

import { UserProps } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PopularUsers = () => {
  const { data, isLoading } = useQuery<UserProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/user/popular-users");
      return response.data.data;
    },
    refetchOnWindowFocus: false,
    queryKey: ["popular-users"],
  });

  console.log(data)

  return (
    <div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Popular users
      </h4>
      {data?.map((g) => (
        <h1>{g.username}</h1>
      ))}
    </div>
  );
};

export default PopularUsers;
