"use client";

import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import { EventProps } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FetchDataError from "../ui/fetch-data-error";
import NoPostMessage from "../ui/no-post-message";
import EventCard from "../cards/event-card";
import EventSkeleton from "../loaders/event-skeleton";
import { UserRoleType, Venue } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserProps } from "@/types/user";

interface EventPageProps {
  currentUserData: UserProps;
}

const EventPage: React.FC<EventPageProps> = ({ currentUserData }) => {
  const getEvents = useQuery<EventProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/event");
      return response.data.data;
    },
    queryKey: ["events"],
  });

  return (
    <section className="my-4 space-y-3">
      <div className="flex w-full items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Events
        </h3>
        {currentUserData.role === UserRoleType.ADMIN ||
          (currentUserData.role === UserRoleType.SYSTEMADMIN && (
            <Link
              href="/e/create"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
              )}
            >
              Create Event
            </Link>
          ))}
      </div>
      <div className="space-y-3">
        {getEvents.isLoading ? (
          <EventSkeleton />
        ) : getEvents.isError ? (
          <FetchDataError />
        ) : getEvents.data?.length === 0 ? (
          <NoPostMessage />
        ) : (
          <>
            {getEvents.data?.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                currentUserId={currentUserData.id}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default EventPage;
