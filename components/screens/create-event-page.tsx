"use client";

import { useQuery } from "@tanstack/react-query";
import EventForm from "../forms/event-form";
import { Venue } from "@prisma/client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { EventProps } from "@/types/event";
import EventSkeleton from "../loaders/event-skeleton";
import FetchDataError from "../ui/fetch-data-error";
import NotFound from "@/app/not-found";

interface CreateEventPageProps {
  currentUserId: string;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({ currentUserId }) => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("edit");
  const getVenues = useQuery<Venue[]>({
    queryFn: async () => {
      const response = await axios.get("/api/event/venue");
      return response.data.data;
    },
    queryKey: ["venues"],
  });

  const getEvent = useQuery<EventProps>({
    queryFn: async () => {
      const response = await axios.get(`/api/event/${eventId}`);
      return response.data.data;
    },
    queryKey: [eventId],
  });

  if (eventId !== null && !getEvent.data && !getEvent.isLoading) {
    return <NotFound />;
  }

  return (
    <section className="h-full w-full pt-4">
      {getVenues.isLoading || getEvent.isLoading ? (
        <EventSkeleton />
      ) : getVenues.isError || getEvent.error ? (
        <FetchDataError />
      ) : (
        <EventForm
          currentUserId={currentUserId}
          venues={getVenues.data}
          formData={getEvent.data}
        />
      )}
    </section>
  );
};

export default CreateEventPage;
