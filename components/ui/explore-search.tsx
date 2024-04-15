"use client";

import { Input } from "@/components/ui/input";
import { Card } from "./card";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import Loader from "../loaders/loader";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Link from "next/link";
import { UserProps } from "@/types/user";
import { X } from "lucide-react";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostProps } from "@/types/post";

const ExploreSearch = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchUsersResults, setSearchUsersResults] = useState<
    UserProps[] | null
  >([]);
  const [searchPostsResults, setSearchPostsResults] = useState<
    PostProps[] | null
  >([]);

  console.log(searchPostsResults);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.length) {
        setIsLoading(true);
        const response = await axios.get(`/api/search?q=${searchTerm}`);
        setSearchUsersResults(response.data.users);
        setSearchPostsResults(response.data.posts);
        setIsLoading(false);
      } else {
        setSearchUsersResults([]);
        setSearchPostsResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
              value={searchTerm}
              readOnly
              className="rounded-none border-none bg-transparent pl-0 transition focus-visible:ring-0 focus-visible:ring-black"
            />
          </PopoverTrigger>
          <PopoverContent
            sideOffset={-40}
            className="flex w-[548px] flex-col items-center space-y-4  border-none bg-transparent p-0 shadow-none"
          >
            <div className="flex w-full items-center pl-[54px] pr-5">
              <Input
                placeholder="Search..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-none border-none bg-transparent pl-0 ring-offset-card transition focus-visible:ring-0 focus-visible:ring-transparent"
              />
              <Button
                onClick={() => setSearchTerm("")}
                disabled={searchTerm.length === 0}
                variant="ghost"
                size="iconRound"
              >
                <X />
              </Button>
            </div>
            <div className="min-h-14 w-[85%] rounded-md border bg-popover p-1">
              <div className="h-auto w-full">
                <Tabs defaultValue="user" className="w-full">
                  <TabsList className="w-full bg-transparent">
                    <TabsTrigger
                      value="user"
                      className="flex-1 data-[state=active]:bg-primary"
                    >
                      Users
                    </TabsTrigger>
                    <TabsTrigger
                      value="post"
                      className="flex-1 data-[state=active]:bg-primary"
                    >
                      Posts
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="user"
                    className="flex flex-col items-center justify-center"
                  >
                    {!isLoading && searchUsersResults?.length === 0 && (
                      <div className="py-3">
                        <h4 className="w-full text-sm">No results</h4>
                      </div>
                    )}
                    {isLoading && (
                      <div className="py-5">
                        <Loader className="!bg-primary" />
                      </div>
                    )}
                    <div className="max-h-[420px] w-full flex-col items-center justify-center overflow-y-scroll">
                      {searchUsersResults?.map((user) => (
                        <Link
                          href={`/u/${user.id}`}
                          className="flex h-14 w-full items-center rounded-sm px-2 hover:bg-accent/50"
                        >
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage
                                src={
                                  user.avatarUrl ? user.avatarUrl : undefined
                                }
                                className="object-cover"
                                alt={
                                  user.avatarUrl ? user.avatarUrl : undefined
                                }
                              />
                              <AvatarFallback>
                                {user.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="flex items-center gap-1 hover:underline">
                                {user.username}
                              </p>
                              <p className="text-xs text-muted-foreground">{`${user.studentData.firstName} ${user.studentData.middleName.charAt(0).toUpperCase()} ${user.studentData.lastName}`}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="post">
                    {!isLoading && searchPostsResults?.length === 0 && (
                      <div className="py-3">
                        <h4 className="w-full text-sm">No results</h4>
                      </div>
                    )}
                    {isLoading && (
                      <div className="py-5">
                        <Loader className="!bg-primary" />
                      </div>
                    )}
                    {searchPostsResults?.map((post) => <p>{post.content}</p>)}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};

export default ExploreSearch;
