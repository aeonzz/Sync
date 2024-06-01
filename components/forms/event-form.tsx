"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventValidation } from "@/lib/validations/event";
import { CalendarIcon, ImagePlus } from "lucide-react";
import { addDays, format, isBefore, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccessibilityType } from "@prisma/client";
import { SingleImageDropzone } from "./single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { useQueryClient } from "@tanstack/react-query";
import { DateRange, Matcher } from "react-day-picker";
import { useRouter } from "next/navigation";
import { EventProps } from "@/types/event";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { VenueProps } from "@/types/venue";

interface EventFormProps {
  currentUserId: string;
  formData?: EventProps;
  venues: VenueProps[] | undefined;
}

type DisabledRange = {
  from: Date;
  to: Date;
};

const EventForm: React.FC<EventFormProps> = ({
  currentUserId,
  formData,
  venues,
}) => {
  const [openImageInput, setOpenImageInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: formData?.reservation.startTime,
    to: formData?.reservation.endTime,
  });
  const [file, setFile] = useState<File>();
  const router = useRouter();
  const [disabledRanges, setDisabledRanges] = useState<DisabledRange[]>([]);

  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      name: formData ? formData.name : "",
      description: formData ? formData.description : "",
      location: formData ? formData.location : "",
    },
  });

  const selectedVenue = form.watch("venueId");
  const checkDateConflict = (selectedDates: DateRange) => {
    return disabledRanges.some((reservedDate) => {
      return (
        (selectedDates.from &&
          selectedDates.from >= reservedDate.from &&
          selectedDates.from &&
          selectedDates.from < reservedDate.to) ||
        (selectedDates.to &&
          selectedDates.to > reservedDate.from &&
          selectedDates.to <= reservedDate.to) ||
        (selectedDates.from &&
          selectedDates.from <= reservedDate.from &&
          selectedDates.to &&
          selectedDates.to >= reservedDate.to)
      );
    });
  };

  async function onSubmit(data: z.infer<typeof EventValidation>) {
    setIsLoading(true);

    const selectedDates = date;
    if (!selectedDates?.from || !selectedDates?.to) {
      toast.error("Date is required", {
        description: "Please select a valid date for your event.",
      });
      setIsLoading(false);
      return;
    }

    const isConflicting = checkDateConflict(selectedDates);
    if (isConflicting) {
      toast.error("Date conflict", {
        description: "The selected dates conflict with reserved dates.",
      });
      setIsLoading(false);
      return;
    }

    if (formData) {
      const { accessibility, ...restData } = data;
      const eventData = {
        ...restData,
        accessibility: accessibility as AccessibilityType,
        eventId: formData.id,
        startTime: selectedDates.from,
        endTime: selectedDates.to,
      };
      const response = await updateEvent(eventData);

      if (response.status === 200) {
        setIsLoading(false);
        router.push(`/e/${formData.id}/overview`);
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: [formData.id] });
        toast.success("Event Updated", {
          description: "Your event details have been successfully updated.",
        });
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description:
            "An error occurred while making the request. Please try again later",
        });
      }
    } else {
      let res;
      if (file) {
        try {
          res = await edgestore.publicImages.upload({
            file,
          });
        } catch (error) {
          setIsLoading(false);
          toast.error("Uh oh! Something went wrong.", {
            description: "Could not upload photo, Try again later.",
          });
          return;
        }
      }

      const { accessibility, ...restData } = data;

      const eventData = {
        ...restData,
        accessibility: accessibility as AccessibilityType,
        image: res?.url,
        userId: currentUserId,
        startTime: selectedDates.from,
        endTime: selectedDates.to,
      };

      const response = await createEvent(eventData);

      if (response.status === 200) {
        setIsLoading(false);
        router.push("/event");
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event Created", {
          description: "Waiting for Admin approval",
        });
      } else {
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description:
            "An error occurred while making the request. Please try again later",
        });
      }
    }
  }

  useEffect(() => {
    if (selectedVenue) {
      const venue = venues?.find((v) => v.id === selectedVenue);
      const reservations =
        venue?.events.map((event) => ({
          start: new Date(event.reservation.startTime),
          end: new Date(event.reservation.endTime),
        })) || [];

      setDisabledRanges(
        reservations.map((reservation) => ({
          from: reservation.start,
          to: reservation.end,
        })),
      );
    } else {
      setDisabledRanges([]);
    }
  }, [selectedVenue, venues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex w-full items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              {formData ? "Update Event" : "Create Event"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formData
                ? "Make changes to your event below."
                : "Get started with your event"}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {formData ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                className={cn(
                  openImageInput && "bg-green-500/15 text-green-500/70",
                  "group transition-all hover:bg-green-500/15 ",
                )}
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenImageInput((prev) => !prev);
                }}
                disabled={isLoading}
              >
                <ImagePlus
                  className={cn(
                    openImageInput ? "text-green-500/70" : "text-foreground",
                    "mr-1 h-5 w-5 group-hover:text-green-500/70",
                  )}
                />
                <span className="group-hover:text-green-500/70">Add Image</span>
              </Button>
            )}
            <Button
              className="flex-1"
              size="sm"
              type="submit"
              disabled={isLoading}
            >
              {formData ? "Update" : "Continue"}
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid w-full grid-cols-3 gap-3 gap-y-3">
          <div className="col-span-2 space-y-3">
            {openImageInput ? (
              <SingleImageDropzone
                width={730}
                height={400}
                disabled={isLoading}
                value={file}
                onChange={(file) => {
                  setFile(file);
                }}
              />
            ) : (
              <>
                <Card className="flex flex-col items-center justify-start py-3">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    disabled={disabledRanges}
                  />
                </Card>
                <Card className="flex h-14 items-center justify-between px-6 py-3">
                  <div>
                    {date?.from ? (
                      date.to ? (
                        <Badge variant="orange">
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </Badge>
                      ) : (
                        <Badge variant="orange">
                          {format(date.from, "LLL dd, y")}
                        </Badge>
                      )
                    ) : null}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-semibold">Reserved</p>
                    <div className="h-3 w-3 bg-red-900" />
                  </div>
                </Card>
              </>
            )}
          </div>
          <Card className="col-span-1 flex flex-col space-y-1 px-3 py-4">
            <h1 className="text-md font-semibold leading-none tracking-tight">
              Event Details
            </h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Event name"
                      autoComplete="off"
                      autoFocus
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Location"
                      autoComplete="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessibility"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Accessibility</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        className="text-muted-foreground"
                        disabled={isLoading}
                      >
                        <SelectValue placeholder="Accessibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={AccessibilityType.PUBLIC}
                        onClick={(e) => e.preventDefault()}
                      >
                        Public
                      </SelectItem>
                      <SelectItem
                        value={AccessibilityType.EXCLUSIVE}
                        onClick={(e) => e.preventDefault()}
                      >
                        Exclusive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Venue</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        className="text-muted-foreground"
                        disabled={isLoading}
                      >
                        <SelectValue placeholder="Venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {venues?.map((venue, index) => (
                        <SelectItem key={index} value={venue.id}>
                          {venue.name.charAt(0)}
                          {venue.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[200px]"
                      placeholder="Event description"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
