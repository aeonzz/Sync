"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventForm from "../forms/event-form";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EventProps } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FetchDataError from "../ui/fetch-data-error";
import NoPostMessage from "../ui/no-post-message";
import EventCard from "../cards/event-card";
import { format } from "date-fns";

interface EventPageProps {
  currentUserId: string;
  eventDates:
    | {
        date: Date;
      }[]
    | null;
}

const EventPage: React.FC<EventPageProps> = ({ currentUserId, eventDates }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState<boolean>();
  const [alertOpen, setAlertOpen] = useState(false);

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              if (isDirty) {
                e.preventDefault();
                if (!isLoading) {
                  setAlertOpen(true);
                }
              }
            }}
          >
            {isDirty ? (
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You have unsaved changes. Are you sure you want to leave?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue editing</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setOpen(false)}>
                      Close
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>Get started with your event</DialogDescription>
            </DialogHeader>
            <EventForm
              currentUserId={currentUserId}
              setOpen={setOpen}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setIsDirty={setIsDirty}
              eventDates={eventDates}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {getEvents.isLoading ? (
          <h1>loading</h1>
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
                currentUserId={currentUserId}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default EventPage;
