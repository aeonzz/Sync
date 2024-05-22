"use client";

import React, { useState } from "react";
import { EventProps } from "@/types/event";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DeletedContent from "../cards/deleted-content";
import NotFound from "@/app/not-found";
import Image from "next/image";
import Linkify from "linkify-react";
import { Button, buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash, X } from "lucide-react";
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
} from "../ui/alert-dialog";
import { deleteEvent } from "@/lib/actions/event.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

interface EventDetailsProps {
  eventId: string;
  currentUserId: string;
  eventDates:
    | {
        date: Date;
      }[]
    | null;
}

const options = {
  target: "_blank",
  className: "text-blue-500 hover:underline",
};

const EventDetails: React.FC<EventDetailsProps> = ({
  eventId,
  currentUserId,
  eventDates,
}) => {
  const router = useRouter();
  const [actionDropdown, setActionDropdown] = useState(false);
  console.log(actionDropdown)
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState<boolean>();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const event = useQuery<EventProps>({
    queryFn: async () => {
      const response = await axios.get(`/api/event/${eventId}`);
      return response.data.data;
    },
    queryKey: [eventId],
  });

  async function handleDeleteEvent() {
    setIsLoading(true);

    const response = await deleteEvent(eventId);

    if (response.status === 200) {
      setActionDropdown(false);
      router.push("/event");
      router.refresh();
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event Deleted", {
        description: "Your event has been successfully deleted.",
      });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  if (event.isLoading) {
    return <h1>Loading</h1>;
  }

  if (!event.data) {
    return <NotFound />;
  }

  return (
    <section className="h-full w-full overflow-hidden">
      {event.data.deleted ? (
        <DeletedContent />
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex-center flex justify-between py-6 pr-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {event.data.name}
            </h1>
            <div className="flex items-center space-x-1">
              <Badge
                variant="secondary"
                className="h-fit px-6 py-2 font-normal"
              >
                {event.data.eventStatus.charAt(0)}
                {event.data.eventStatus.slice(1).toLowerCase()}
              </Badge>
              <Dialog open={open} onOpenChange={setOpen}>
                <DropdownMenu
                  open={actionDropdown}
                  onOpenChange={setActionDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-[100px] p-1.5"
                  >
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Deleting this event will permanently remove it from
                            your calendar. Are you sure you want to proceed?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isLoading}
                            onClick={handleDeleteEvent}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                            You have unsaved changes. Are you sure you want to
                            leave?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Continue editing
                          </AlertDialogCancel>
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
                    <DialogDescription>
                      Get started with your event
                    </DialogDescription>
                  </DialogHeader>
                  <EventForm
                    currentUserId={currentUserId}
                    setOpen={setOpen}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    setIsDirty={setIsDirty}
                    eventDates={eventDates}
                    formData={event.data}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Separator />
          <div className="flex space-x-3 pt-6">
            <Image
              src={
                event.data.image
                  ? event.data.image
                  : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/Group%2052%20(1).png"
              }
              alt="Event Image"
              width={345}
              height={345}
              objectFit="contain"
              objectPosition="center"
              quality={100}
              placeholder={event.data.blurDataUrl ? "blur" : undefined}
              blurDataURL={
                event.data.blurDataUrl ? event.data.blurDataUrl : undefined
              }
              priority
              className="aspect-square h-[345px] rounded-md border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
            />
            <div className="space-y-1">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {event.data.name}
              </h3>
              <div className="flex">
                <Badge className="text-[10px] font-normal">
                  {event.data.accessibility}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Event Overview</p>
              <Linkify options={options}>
                <p className="whitespace-pre-wrap break-all text-sm">
                  {event.data.description}
                </p>
              </Linkify>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventDetails;
