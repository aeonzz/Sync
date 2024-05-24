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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ImagePlus } from "lucide-react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import Loader from "../loaders/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccessibilityType, Venue } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SingleImageDropzone } from "./single-image";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { useQueryClient } from "@tanstack/react-query";
import { DateRange, Matcher } from "react-day-picker";
import { useRouter } from "next/navigation";
import { EventProps } from "@/types/event";
import { Card } from "../ui/card";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";

interface EventFormProps {
  currentUserId: string;
  setOpen: (state: boolean) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setIsDirty: (state: boolean) => void;
  formData?: EventProps;
  setActionDropdown?: (state: boolean) => void;
  venues: Venue[] | undefined;
}

const EventForm: React.FC<EventFormProps> = ({
  currentUserId,
  setOpen,
  isLoading,
  setIsLoading,
  setIsDirty,
  formData,
  setActionDropdown,
  venues,
}) => {
  const [openImageInput, setOpenImageInput] = useState(false);
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [file, setFile] = useState<File>();
  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      name: formData ? formData.name : "",
      description: formData ? formData.description : "",
      location: formData ? formData.location : "",
    },
  });

  async function onSubmit(data: z.infer<typeof EventValidation>) {
    setIsLoading(true);

    if (!date?.from || !date?.to) {
      toast.error("Date is required", {
        description: "Please select a valid date for your event.",
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
      };
      const response = await updateEvent(eventData);

      if (response.status === 200) {
        setIsLoading(false);
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: [formData.id] });
        toast.success("Event Updated", {
          description: "Your event details have been successfully updated.",
        });
        setActionDropdown?.(false);
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
        startTime: date.from,
        endTime: date.to,
      };

      const response = await createEvent(eventData);

      if (response.status === 200) {
        setIsLoading(false);
        setOpen(false);
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
    setIsDirty(form.formState.isDirty);
  }, [form.formState.isDirty, file]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full grid-cols-3 gap-y-3"
      >
        <div className="col-span-1 flex flex-col space-y-3">
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={formData && formData.accessibility}
                >
                  <FormControl>
                    <SelectTrigger
                      className="text-muted-foreground"
                      disabled={isLoading}
                    >
                      <SelectValue placeholder="Accessibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AccessibilityType.PUBLIC}>
                      Public
                    </SelectItem>
                    <SelectItem value={AccessibilityType.EXCLUSIVE}>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={formData && formData.venue.name}
                >
                  <FormControl>
                    <SelectTrigger
                      className="text-muted-foreground"
                      disabled={isLoading}
                      defaultValue={formData && formData.venue.name}
                    >
                      <SelectValue
                        placeholder="Venue"
                        defaultValue={formData && formData.venue.name}
                      />
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
                    placeholder="Event description"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 px-3">
          <div>
            {openImageInput ? (
              <div className="mt-14 flex w-full items-center justify-center">
                <SingleImageDropzone
                  width={500}
                  height={300}
                  disabled={isLoading}
                  value={file}
                  onChange={(file) => {
                    setFile(file);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="flex h-7 items-center justify-between">
                  <FormLabel>Event Date</FormLabel>
                  <>
                    {date?.from ? (
                      date.to ? (
                        <Badge variant="secondary">
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {format(date.from, "LLL dd, y")}
                        </Badge>
                      )
                    ) : null}
                  </>
                </div>
                <Card className="flex flex-col items-center justify-start py-3">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </Card>
              </>
            )}
          </div>
        </div>
        <div className="col-span-3 flex items-center justify-between">
          <div className="flex-1">
            {!formData && (
              <Button
                className={cn(
                  openImageInput && "bg-green-500/15",
                  "group transition-all hover:bg-green-500/15 active:scale-95",
                )}
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenImageInput((prev) => !prev);
                }}
                disabled={isLoading}
              >
                <ImagePlus
                  className={cn(
                    openImageInput ? "text-green-500/70" : "text-foreground",
                    "h-5 w-5 group-hover:text-green-500/70",
                  )}
                />
              </Button>
            )}
          </div>
          <div className="flex w-fit space-x-1">
            <Button
              disabled={isLoading}
              size="sm"
              variant="ghost"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
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
      </form>
    </Form>
  );
};

export default EventForm;
