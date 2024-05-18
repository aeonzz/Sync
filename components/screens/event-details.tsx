"use client";

import React from "react";
import BackButton from "../ui/back-button";
import { EventProps } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DeletedContent from "../cards/deleted-content";
import NotFound from "@/app/not-found";
import { Card, CardHeader } from "../ui/card";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import Linkify from "linkify-react";

interface EventDetailsProps {
  eventId: string;
}

const options = {
  target: "_blank",
  className: "text-blue-500 hover:underline",
};

const EventDetails: React.FC<EventDetailsProps> = ({ eventId }) => {
  const event = useQuery<EventProps>({
    queryFn: async () => {
      const response = await axios.get(`/api/event/${eventId}`);
      return response.data.data;
    },
    queryKey: [eventId],
  });

  if (event.isLoading) {
    return <h1>Loading</h1>;
  }

  if (!event.data) {
    return <NotFound />;
  }

  return (
    <section className="h-full overflow-hidden">
      <div className="flex h-[54px] items-center space-x-2">
        <BackButton />
        <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          Event
        </h2>
      </div>
      {event.data.deleted ? (
        <DeletedContent />
      ) : (
        <div className="space-y-3">
          <Image
            src={
              event.data.image
                ? event.data.image
                : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/Group%2052%20(1).png"
            }
            alt="Event Image"
            width={550}
            height={200}
            objectFit="contain"
            objectPosition="center"
            quality={100}
            placeholder={event.data.blurDataUrl ? "blur" : undefined}
            blurDataURL={
              event.data.blurDataUrl ? event.data.blurDataUrl : undefined
            }
            priority
            className="h-[200px] rounded-md border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
          />
          <div className="space-y-1">
            <h1 className=" scroll-m-20 whitespace-pre-wrap break-all text-4xl font-extrabold tracking-tight">
              {event.data.name}
            </h1>
            <p className="text-xs text-muted-foreground">Event Description</p>
            <Linkify options={options}>
              <p className="text-sm whitespace-pre-wrap break-all">{event.data.description}</p>
            </Linkify>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventDetails;
