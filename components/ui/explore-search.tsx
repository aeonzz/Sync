"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card } from "./card";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FormSchema = z.object({
  search: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const ExploreSearch = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: "",
    },
  });

  console.log(form.watch("search"));

  function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <Card className="my-4 w-full">
      <div className="flex items-center px-5 pb-2 pt-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="group flex w-full items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <Input
              placeholder={open ? "" : "Search..."}
              readOnly
              className="rounded-none border-none bg-transparent pl-0 transition focus-visible:ring-0 focus-visible:ring-black"
            />
          </PopoverTrigger>
          <PopoverContent
            sideOffset={-40}
            className="flex w-[548px] flex-col items-center space-y-3 border-none bg-transparent p-0 shadow-none"
          >
            <Form {...form}>G
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="px-[54px]">
                      <FormControl>
                        <Input
                          placeholder="Search..."
                          autoComplete="off"
                          className="rounded-none border-none bg-transparent pl-0 ring-offset-card transition focus-visible:ring-0 focus-visible:ring-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="h-40 w-[85%] rounded-md border bg-popover"></div>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};

export default ExploreSearch;
