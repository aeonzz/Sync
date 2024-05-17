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

const EventPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <section className="my-4">
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
          <DialogContent>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <EventForm
              setOpen={setOpen}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default EventPage;
