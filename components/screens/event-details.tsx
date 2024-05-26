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
import { createAttendees, deleteEvent } from "@/lib/actions/event.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AccessibilityType, Venue } from "@prisma/client";
import Link from "next/link";
import { Card, CardHeader } from "../ui/card";

interface EventDetailsProps {
  eventId: string;
  currentUserId: string;
}

const options = {
  target: "_blank",
  className: "text-blue-500 hover:underline",
};

const EventDetails: React.FC<EventDetailsProps> = ({
  eventId,
  currentUserId,
}) => {
  const router = useRouter();
  const [actionDropdown, setActionDropdown] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
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

  async function joinEvent() {
    if (event.data?.eventAttendee.some((user) => user.id === currentUserId)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const response = await createAttendees(eventId, currentUserId);

    if (response.status === 200) {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: [eventId] });
      toast("hahahaha");
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
          <div className="flex-center flex justify-between py-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {event.data.name}
            </h1>
            <div className="flex items-center space-x-1">
              <Badge variant="blue" className="h-fit px-6 py-2 font-normal">
                {event.data.eventStatus.charAt(0)}
                {event.data.eventStatus.slice(1).toLowerCase()}
              </Badge>
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
                  {event.data.organizer.id === currentUserId && (
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      asChild
                    >
                      <Link href={`/e/create?edit=${eventId}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <AlertDialog
                    open={deleteAlertOpen}
                    onOpenChange={setDeleteAlertOpen}
                  >
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
            </div>
          </div>
          <Separator />
          <div className="flex space-x-3 pt-2">
            <div className="flex h-auto w-[345px] flex-col space-y-3">
              <Image
                src={
                  event.data.image
                    ? event.data.image
                    : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/Group%2052%20(1).png"
                }
                alt="Event Image"
                width={700}
                height={700}
                objectFit="contain"
                objectPosition="center"
                quality={100}
                placeholder={event.data.blurDataUrl ? "blur" : undefined}
                blurDataURL={
                  event.data.blurDataUrl ? event.data.blurDataUrl : undefined
                }
                priority
                className="h-[200px] w-full rounded-md border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
              />
              <div className="grid h-auto grid-cols-2 grid-rows-3 gap-3">
                <Card className="rounded-sm">
                  <div className="flex items-center space-x-2 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#ededed"}
                      fill={"none"}
                    >
                      <path
                        d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div>
                      <h4 className="scroll-m-20 whitespace-pre-wrap break-all text-sm font-semibold tracking-tight">
                        {event.data.location}
                      </h4>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>
                </Card>
                <Card className="rounded-sm">
                  <div className="flex items-center space-x-2 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#ededed"}
                      fill={"none"}
                    >
                      <path
                        d="M17 16V8C17 5.64298 17 4.46447 16.2678 3.73223C15.5355 3 14.357 3 12 3H8C5.64298 3 4.46447 3 3.73223 3.73223C3 4.46447 3 5.64298 3 8V16C3 18.357 3 19.5355 3.73223 20.2678C4.46447 21 5.64298 21 8 21H12C14.357 21 15.5355 21 16.2678 20.2678C17 19.5355 17 18.357 17 16Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M11 21H17C18.8856 21 19.8284 21 20.4142 20.4142C21 19.8284 21 18.8856 21 17V10C21 8.11438 21 7.17157 20.4142 6.58579C19.8284 6 18.8856 6 17 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M13 11V13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div>
                      <h4 className="scroll-m-20 whitespace-pre-wrap break-all text-sm font-semibold tracking-tight">
                        {event.data.venue.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">Venue</p>
                    </div>
                  </div>
                </Card>
                <Card className="col-span-2 rounded-sm">
                  <div className="flex items-center space-x-1 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#ededed"}
                      fill={"none"}
                    >
                      <path
                        d="M5.53327 17C4.11143 19.0062 3.75309 20.0652 4.15321 20.9156C4.19286 20.9999 4.23928 21.0812 4.29207 21.1589C4.86372 22 6.34111 22 9.2959 22H14.7041C17.6589 22 19.1363 22 19.7079 21.1589C19.7607 21.0812 19.8071 20.9999 19.8468 20.9156C20.2469 20.0652 19.8891 19.0062 18.4673 17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.9981 7H11.0019C8.13196 7 6.19701 10.0691 7.32753 12.828C7.48501 13.2124 7.84633 13.4615 8.24612 13.4615H8.9491C9.18605 13.4615 9.39259 13.6302 9.45006 13.8706L10.3551 17.6567C10.5438 18.4462 11.222 19 12 19C12.778 19 13.4562 18.4462 13.6449 17.6567L14.5499 13.8706C14.6074 13.6302 14.814 13.4615 15.0509 13.4615H15.7539C16.1537 13.4615 16.515 13.2124 16.6725 12.828C17.803 10.0691 15.868 7 12.9981 7Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14.5 4.5C14.5 5.88071 13.3807 7 12 7C10.6193 7 9.5 5.88071 9.5 4.5C9.5 3.11929 10.6193 2 12 2C13.3807 2 14.5 3.11929 14.5 4.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <div>
                      <h4 className="scroll-m-20 whitespace-pre-wrap break-all text-sm font-semibold tracking-tight">
                        {event.data.venue.capacity}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Venue Capacity
                      </p>
                    </div>
                  </div>
                </Card>
                <Button
                  className="col-span-2"
                  onClick={joinEvent}
                  disabled={isLoading}
                >
                  Join
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {event.data.name}
              </h3>
              <div className="flex">
                <Badge
                  className="text-[10px] font-normal"
                  variant={
                    event.data.accessibility === AccessibilityType.PUBLIC
                      ? "green"
                      : "yellow"
                  }
                >
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
