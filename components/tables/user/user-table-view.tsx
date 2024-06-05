"use client";

import React from "react";
import { UColumns } from "@/components/tables/user/u-column";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FetchDataError from "@/components/ui/fetch-data-error";
import Loader from "@/components/loaders/loader";
import { UDataTable } from "./u-data-table";

const UserTableView = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const response = await axios.get("/api/user");
      return response.data.data;
    },
    queryKey: ["user-table-data"],
  });


  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader />
        </div>
      ) : isError ? (
        <FetchDataError />
      ) : (
        <UDataTable columns={UColumns} data={data} />
      )}
    </>
  );
};

export default UserTableView;
