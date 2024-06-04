"use client";

import React, { useState } from "react";
import { EventProps } from "@/types/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DeletedContent from "../cards/deleted-content";
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
import { notFound, useRouter } from "next/navigation";
import {
  AccessibilityType,
  DepartmentType,
  EventStatusType,
  Venue,
  YearLevel,
} from "@prisma/client";
import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import EventDetailsSkeleton from "../loaders/event-details-skeleton";
import { UserProps } from "@/types/user";
import Loader from "../loaders/loader";
import { ScrollArea } from "../ui/scroll-area";
import ProfileHover from "../shared/profile-hover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface GuestPageProps {
  eventId: string;
  currentUserData: UserProps;
}

interface EventData {
  event: EventProps;
  isJoined: boolean;
}

const GuestPage: React.FC<GuestPageProps> = ({ eventId, currentUserData }) => {
  const router = useRouter();
  const [actionDropdown, setActionDropdown] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const event = useQuery<EventData>({
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
    return <EventDetailsSkeleton />;
  }

  if (!event.data?.event) {
    notFound();
  }

  return (
    <section className="h-full w-full overflow-hidden">
      {event.data?.event.deleted ? (
        <DeletedContent />
      ) : (
        <div className="flex flex-col space-y-3">
          <div className="flex-center flex justify-between py-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {event.data?.event.name}
            </h1>
            <div className="flex items-center space-x-1">
              <Badge
                variant={
                  event.data.event.eventStatus === EventStatusType.UPCOMING
                    ? "sky"
                    : event.data.event.eventStatus === EventStatusType.CANCELLED
                      ? "destructive"
                      : event.data.event.eventStatus === EventStatusType.ONGOING
                        ? "green"
                        : "orange"
                }
                className="h-fit px-6 py-2 font-normal"
              >
                {event.data?.event.eventStatus.charAt(0)}
                {event.data?.event.eventStatus.slice(1).toLowerCase()}
              </Badge>
              {currentUserData.id === event.data?.event.organizer.id && (
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
                    {event.data?.event.organizer.id === currentUserData.id && (
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
              )}
            </div>
          </div>
          <Separator />
          <div className="pace-x-3 w-full space-y-2 pt-2">
            <h1 className="text-xl font-semibold leading-none tracking-tight">
              Event Attendees
            </h1>
            <ScrollArea className="h-[calc(100vh-200px)] border-t">
              {event.data.event.eventAttendee.map((attendee, index) => (
                <div
                  key={index}
                  className="mb-2 flex items-center justify-between border-b p-3"
                >
                  <div className="flex items-center space-x-40">
                    <div className="flex space-x-3">
                      <HoverCard openDelay={200} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <Link
                            href={`/u/${attendee.user.id}`}
                            className="group relative"
                          >
                            <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                            <Avatar>
                              <AvatarImage
                                src={attendee.user.avatarUrl ?? undefined}
                                className="object-cover"
                                alt={attendee.user.avatarUrl ?? undefined}
                              />
                              <AvatarFallback>
                                {attendee.user.username
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="min-h-32 w-[250px]"
                          hideWhenDetached={true}
                        >
                          <ProfileHover
                            userId={attendee.user.id}
                            showFollowButton={false}
                            currentUserId={currentUserData.id}
                          />
                        </HoverCardContent>
                      </HoverCard>
                      <div className="flex flex-col space-y-2">
                        <Link
                          href={`/u/${attendee.user.id}`}
                          className="flex items-center gap-1 font-semibold leading-3 hover:underline"
                        >
                          {attendee.user.username}
                        </Link>
                        <p className="text-xs text-muted-foreground">{`${attendee.user.studentData.firstName} ${attendee.user.studentData.middleName.charAt(0).toUpperCase()} ${attendee.user.studentData.lastName}`}</p>
                      </div>
                    </div>
                    <p className="text-xs font-light text-muted-foreground">
                      {formatDistanceToNow(new Date(attendee.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Badge variant="outline">
                      {attendee.user.studentData.yearLevel === YearLevel.first
                        ? "1"
                        : attendee.user.studentData.yearLevel ===
                            YearLevel.second
                          ? "2"
                          : attendee.user.studentData.yearLevel ===
                              YearLevel.third
                            ? "3"
                            : "4"}
                      {attendee.user.studentData.section}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={cn(
                        attendee.user.studentData.department ===
                          DepartmentType.BSNAME
                          ? "text-sky-600"
                          : attendee.user.studentData.department ===
                              DepartmentType.BSIT
                            ? "text-blue-600"
                            : attendee.user.studentData.department ===
                                DepartmentType.BSESM
                              ? "text-yellow-600"
                              : attendee.user.studentData.department ===
                                  DepartmentType.BSTCM
                                ? "text-green-600"
                                : "text-orange-600",
                        "w-24",
                      )}
                    >
                      {attendee.user.studentData.department}
                    </Badge>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </section>
  );
};

export default GuestPage;
