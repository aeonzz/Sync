"use client";

import React from "react";
import { Card } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../loaders/loader";
import FetchDataError from "../ui/fetch-data-error";
import { EventProps } from "@/types/event";
import EventCard from "../cards/event-card";
import { ScrollArea } from "../ui/scroll-area";

interface ConfirmationsPageProps {
  currentUserId: string;
}

const ConfirmationsPage: React.FC<ConfirmationsPageProps> = ({
  currentUserId,
}) => {
  const { data, isLoading, isError } = useQuery<EventProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/event/confirmation");
      return response.data.data;
    },
    queryKey: ["confirmation-data"],
  });

  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader />
        </div>
      ) : isError ? (
        <FetchDataError />
      ) : data?.length === 0 ? (
        <div className="flex h-[98%] w-full items-center justify-center">
          <p className="text-sm font-semibold tracking-tight">
            No pending event confirmations
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-2">
            <h3 className="text-md font-semibold tracking-tight">
              Confirmations
            </h3>
            <p className="text-xs text-muted-foreground">
              Lists of pending events
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-150px)]">
            {data?.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                currentUserId={currentUserId}
              />
            ))}
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default ConfirmationsPage;
