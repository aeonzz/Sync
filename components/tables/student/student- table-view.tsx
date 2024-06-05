"use client";

import React from "react";
import { sColumns } from "@/components/tables/student/s-columns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FetchDataError from "@/components/ui/fetch-data-error";
import Loader from "@/components/loaders/loader";
import { SDataTable } from "./s-data-table";

const StudentTableView = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const response = await axios.get("/api/student");
      return response.data.data;
    },
    queryKey: ["student-data"],
  });

  console.log(data)

  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader />
        </div>
      ) : isError ? (
        <FetchDataError />
      ) : (
        <SDataTable columns={sColumns} data={data} />
      )}
    </>
  );
};

export default StudentTableView;
