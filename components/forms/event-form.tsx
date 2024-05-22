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
import { format } from "date-fns";
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
import { AccessibilityType } from "@prisma/client";
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
import { Matcher } from "react-day-picker";
import { useRouter } from "next/navigation";
import { EventProps } from "@/types/event";

interface EventFormProps {
  currentUserId: string;
  setOpen: (state: boolean) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setIsDirty: (state: boolean) => void;
  formData?: EventProps;
  eventDates:
    | {
        date: Date;
      }[]
    | null;
  setActionDropdown?: (state: boolean) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  currentUserId,
  setOpen,
  isLoading,
  setIsLoading,
  setIsDirty,
  eventDates,
  formData,
  setActionDropdown,
}) => {
  const [openImageInput, setOpenImageInput] = useState(false);
  const [accordionValue, setAccourdionValue] = useState("");
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const disabledDays = eventDates
    ? eventDates.map((date) => new Date(date.date))
    : undefined;
  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      name: formData ? formData.name : "",
      description: formData ? formData.description : "",
      date: formData ? new Date(formData.date) : undefined,
      location: formData ? formData.location : "",
      accessibility: formData ? formData.accessibility : undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof EventValidation>) {
    setIsLoading(true);

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
        className="flex w-full flex-col space-y-3"
      >
        <div className="flex items-end space-x-2">
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
        </div>
        <div className="flex items-end space-x-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>Date of the Event</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="secondary"
                        disabled={isLoading}
                        className={cn(
                          "w-auto py-2 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={disabledDays}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                  defaultValue={
                    formData ? formData.accessibility : AccessibilityType.PUBLIC
                  }
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
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event description"
                  className="resize-none"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={accordionValue}
          onValueChange={setAccourdionValue}
        >
          <AccordionItem value="item-1">
            <AccordionContent>
              <SingleImageDropzone
                width={150}
                height={150}
                disabled={isLoading}
                value={file}
                onChange={(file) => {
                  setFile(file);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-5 flex items-center justify-between">
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
                  setAccourdionValue((prev) =>
                    prev === ""
                      ? "item-1"
                      : "" || prev === "item-1"
                        ? ""
                        : "item-1",
                  );
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
              {FormData ? "Update" : "Continue"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
