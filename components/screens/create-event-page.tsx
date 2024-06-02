"use client";

import { useQuery } from "@tanstack/react-query";
import EventForm from "../forms/event-form";
import axios from "axios";
import { notFound, useSearchParams } from "next/navigation";
import { EventProps } from "@/types/event";
import EventSkeleton from "../loaders/event-skeleton";
import FetchDataError from "../ui/fetch-data-error";
import NotFound from "@/app/not-found";
import { VenueProps } from "@/types/venue";
import EventFormSkeleton from "../loaders/event-form-skeleton";

interface CreateEventPageProps {
  currentUserId: string;
}

interface EventData {
  event: EventProps;
  isJoined: boolean;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({ currentUserId }) => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("edit");
  const getVenues = useQuery<VenueProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/event/venue");
      return response.data.data;
    },
    queryKey: ["venues"],
  });

  const getEvent = useQuery<EventData>({
    queryFn: async () => {
      const response = await axios.get(`/api/event/${eventId}`);
      return response.data.data;
    },
    queryKey: [eventId],
  });

  if (eventId !== null && !getEvent.data && !getEvent.isLoading) {
    notFound();
  }

  return (
    <section className="h-full w-full pt-4">
      {getVenues.isLoading || getEvent.isLoading ? (
        <EventFormSkeleton />
      ) : getVenues.isError || getEvent.error ? (
        <FetchDataError />
      ) : (
        <EventForm
          currentUserId={currentUserId}
          venues={getVenues.data}
          formData={getEvent.data?.event}
        />
      )}
    </section>
  );
};

export default CreateEventPage;
