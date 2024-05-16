"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { RoomValidation } from "@/lib/validations/chat";
import { Button } from "../ui/button";
import { createRoom } from "@/lib/actions/chat.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface RoomFormProps {
  setOpen: (state: boolean) => void;
  currentUserId: string;
}

const RoomForm: React.FC<RoomFormProps> = ({ setOpen, currentUserId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof RoomValidation>>({
    resolver: zodResolver(RoomValidation),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RoomValidation>) {
    setIsLoading(true);

    const response = await createRoom(data.name, currentUserId);

    if (response.status === 200) {
      setIsLoading(false);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      router.push(`/chat-rooms/${response.room?.id}`);
    } else {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description:
          "An error occurred while making the request. Please try again later",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Room Name"
                  autoComplete="off"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="sm"
          type="submit"
          className="self-end"
          disabled={isLoading}
        >
          Create
        </Button>
      </form>
    </Form>
  );
};

export default RoomForm;
