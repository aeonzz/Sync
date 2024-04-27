"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./input";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserProps } from "@/types/user";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import ReactorSkeleton from "../loaders/reactor-skeleton";
import FetchDataError from "./fetch-data-error";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import ConversationCard from "../cards/conversation-card";

const NewChat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchUsersResults, setSearchUsersResults] = useState<
    UserProps[] | null
  >([]);

  const {
    data,
    isLoading: queryLoading,
    isError,
  } = useQuery<UserProps[]>({
    queryFn: async () => {
      const response = await axios.get("/api/user/following");
      return response.data.users;
    },
    queryKey: ["add-message-users"],
  });

  console.log(data);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length) {
        setIsLoading(true);
        const response = await axios.get(`/api/search?q=${searchTerm}`);
        setSearchUsersResults(response.data.users);
        setIsLoading(false);
      } else {
        setSearchUsersResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <Dialog>
      <DialogTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-7 w-7 cursor-pointer fill-none stroke-foreground outline-none transition-transform duration-500 hover:rotate-90 active:scale-95 active:stroke-blue-200 active:duration-0"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            strokeWidth="1.8"
          ></path>
          <path d="M8 12H16" strokeWidth="1.5"></path>
          <path d="M12 16V8" strokeWidth="1.5"></path>
        </svg>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogClose className="absolute right-4 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <div className="flex items-center space-x-3">
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
              placeholder="Search users..."
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-7 rounded-none border-none bg-transparent pl-0 ring-offset-transparent transition focus-visible:ring-0 focus-visible:ring-transparent"
            />
          </div>
        </DialogHeader>
        <div className="space-y-2">
          {searchUsersResults && searchUsersResults.length > 0 ? (
            <>
              <h4 className="text-left text-base font-semibold">Users</h4>
              {searchUsersResults.map((user, index) => (
                <ConversationCard key={index} user={user} />
              ))}
            </>
          ) : (
            <>
              <h4 className="text-left text-base font-semibold">
                People you followed
              </h4>
              {queryLoading ? (
                <ReactorSkeleton />
              ) : isError ? (
                <FetchDataError />
              ) : data?.length === 0 ? (
                <p className="py-5 text-center text-sm text-muted-foreground">
                  Nothing to show here
                </p>
              ) : (
                <ScrollArea className="max-h-60">
                  {data?.map((user, index) => (
                    <ConversationCard key={index} user={user} />
                  ))}
                </ScrollArea>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChat;
