"use client";

import { EventProps } from "@/types/event";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import ProfileHover from "../shared/profile-hover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import {
  AccessibilityType,
  ApprovalStatusType,
  EventStatusType,
} from "@prisma/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { deleteEvent, updateApprovalStatus } from "@/lib/actions/event.actions";
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
import { usePathname, useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventProps;
  currentUserId: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUserId }) => {
  const eventCreatedAt = new Date(event.createdAt);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [alertOpen, setAlertOpen] = useState(false);
  const pathname = usePathname();

  async function handleDeleteEvent() {
    setIsLoading(true);

    const response = await deleteEvent(event.id);

    if (response.status === 200) {
      setIsLoading(false);
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event Cancelled", {
        description: "Cancelled Event approval successfuly",
      });
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  async function handleApproval(status: ApprovalStatusType) {
    setIsLoading(true);

    const response = await updateApprovalStatus(event.id, status);

    if (response.status === 200) {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["confirmation-data"] });
      {
        status === ApprovalStatusType.APPROVED
          ? toast.success("Success", {
              description: "Event successfuly approved",
            })
          : toast.success("Success", {
              description: "Event successfuly rejected",
            });
      }
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <div className="relative mb-3 flex flex-col space-y-2">
      {pathname.startsWith("/dashboard") ? null : (
        <>
          {event.approvalStatus === ApprovalStatusType.PENDING && (
            <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center space-y-1 rounded-md border bg-background/90">
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Waiting for Approval
              </h3>
              {event.organizer.id === currentUserId && (
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isLoading}>
                        Back
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
              )}
            </div>
          )}
        </>
      )}
      <Link href={`/e/${event.id}/overview`} className="group">
        <Card
          className={cn(
            pathname.startsWith("/dashboard") && "bg-background",
            "flex h-full items-center space-x-3 p-3 transition-colors hover:bg-input",
          )}
        >
          <Image
            src={
              event.image
                ? event.image
                : "https://jolfgowviyxdrvtelayh.supabase.co/storage/v1/object/public/static%20images/Group%2052%20(1).png"
            }
            alt="Event Image"
            width={120}
            height={120}
            objectFit="contain"
            objectPosition="center"
            quality={100}
            placeholder={event.blurDataUrl ? "blur" : undefined}
            blurDataURL={event.blurDataUrl ? event.blurDataUrl : undefined}
            priority
            className="aspect-square h-[120px] rounded-sm border bg-stone-800 object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.01]"
          />
          <div className="flex h-[120px] w-full flex-col">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="scroll-m-20 whitespace-pre-wrap break-all text-2xl font-semibold tracking-tight">
                  {event.name.slice(0, 15)}
                  {event.description.length >= 15 && "..."}
                </h3>
                <Badge variant="secondary" className="text-[10px] font-normal">
                  {formatDistanceToNow(eventCreatedAt, { addSuffix: true })}
                </Badge>
              </div>
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link
                    href={`/u/${event.organizer.id}`}
                    className="group relative"
                  >
                    <div className="absolute z-10 rounded-full bg-card/30 opacity-0 transition group-hover:opacity-100" />
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={event.organizer.avatarUrl ?? undefined}
                        className="object-cover"
                        alt={event.organizer.avatarUrl ?? undefined}
                      />
                      <AvatarFallback>
                        {event.organizer.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent
                  className="min-h-32 w-[250px]"
                  hideWhenDetached={true}
                >
                  <ProfileHover
                    userId={event.organizer.id}
                    showFollowButton={false}
                    currentUserId={currentUserId}
                  />
                </HoverCardContent>
              </HoverCard>
            </div>
            <p className="h-40 overflow-hidden whitespace-pre-wrap break-all text-xs text-muted-foreground">
              {event.description.slice(0, 170)}
              {event.description.length > 170 && "..."}
            </p>
            <div className="h-full space-x-1">
              <Badge
                className="text-[10px] font-normal"
                variant={
                  event.accessibility === AccessibilityType.PUBLIC
                    ? "green"
                    : "yellow"
                }
              >
                {event.accessibility}
              </Badge>
              <Badge
                className="text-[10px] font-normal"
                variant={
                  event.eventStatus === EventStatusType.UPCOMING
                    ? "sky"
                    : event.eventStatus === EventStatusType.CANCELLED
                      ? "destructive"
                      : event.eventStatus === EventStatusType.ONGOING
                        ? "green"
                        : "orange"
                }
              >
                {event.eventStatus}
              </Badge>
              {event.reservation.startTime ? (
                event.reservation.endTime ? (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    {format(event.reservation.startTime, "PP")} -{" "}
                    {format(event.reservation.endTime, "PP")}
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    {format(event.reservation.endTime, "PP")}
                  </Badge>
                )
              ) : null}
            </div>
          </div>
        </Card>
      </Link>
      {pathname.startsWith("/dashboard") && (
        <div className="h-10 w-full space-x-2">
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => handleApproval(ApprovalStatusType.APPROVED)}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={() => handleApproval(ApprovalStatusType.REJECTED)}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
