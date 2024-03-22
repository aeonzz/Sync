"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProfileHover from "../shared/profile-hover";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { Separator } from "../ui/separator";
import Loader from "../loaders/loader";
import Linkify from "linkify-react";
import { PostProps } from "@/types/post";
import { cn } from "@/lib/utils";
import Image from "next/image";
import FetchDataError from "../ui/fetch-data-error";
import { useRouter } from "next/router";
import { Session } from "next-auth";

interface PostCardProps {
  post: PostProps;
  session: Session | null;
}

const options = {
  target: "_blank",
  className: "text-blue-500 hover:underline",
};

const PostCard: React.FC<PostCardProps> = ({ post, session }) => {
  const [actionDropdown, setActionDropdown] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const postedAt = new Date(post.createdAt);

  const contentToDisplay = showFullContent
    ? post.content
    : post.content.slice(0, 500);

  const toggleContentVisibility = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <Card className="mb-4 min-h-[200px]">
      <CardHeader className="flex-row items-center justify-between">
        <div className="relative flex items-center space-x-2">
          <ProfileHover post={post} />
          <div className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-1 font-semibold hover:underline"
            >
              {post.author.username}
              {/* {post.author.role === "SYSTEMADMIN" && (
                <BadgeCheck className="h-4 w-4 text-red-500" />
              )}
              {post.author.role === "ADMIN" && (
                <BadgeCheck className="h-4 w-4 text-primary" />
              )} */}
            </Link>
            <div className="flex items-center">
              <p className="text-xs font-light text-muted-foreground">
                {formatDistanceToNow(postedAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenu
          open={actionDropdown}
          onOpenChange={setActionDropdown}
          modal={false}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[80px] p-1.5">
            {session?.user.id === post.author.id && (
              <>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem
                      className="text-xs"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit post</DialogTitle>
                    </DialogHeader>
                    <Separator />
                  </DialogContent>
                </Dialog>
                {/* <DropdownMenuSeparator /> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-xs text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Are you absolutely sure?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the post from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => {}}
                        disabled={isLoading}
                      >
                        {isLoading && <Loader />}
                        Continue
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Linkify options={options}>
          <p
            className={cn(
              post.content.length < 40 &&
                post.imageUrls?.length === 0 &&
                "text-2xl",
              "whitespace-pre-wrap break-words",
            )}
          >
            {contentToDisplay}
            {post.content.length > 500 && (
              <Button
                variant="link"
                onClick={toggleContentVisibility}
                className="-mt-5 ml-1 p-0 text-slate-200"
              >
                {showFullContent ? "See Less" : "...See More"}
              </Button>
            )}
          </p>
        </Linkify>
        <Link href={`/post/${post.postId}`}>
          <div className="relative mt-5 flex w-full overflow-hidden rounded-md">
            <div
              className={cn(
                post.imageUrls?.length === 1 ? "grid-cols-1" : "grid-cols-2",
                "grid w-full flex-1",
              )}
            >
              {post.imageUrls?.slice(0, 4).map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    post.imageUrls?.length === 3 && index === 0 && "col-span-2",
                    post.imageUrls?.length === 1 ? "h-[400px]" : "h-[250px]",
                    "relative w-full",
                  )}
                >
                  <div
                    className={cn(
                      index === 3 && post.imageUrls
                        ? post.imageUrls.length >= 5 && "bg-black/40"
                        : null,
                      "absolute flex h-full w-full items-center justify-center rounded-md duration-300 hover:bg-black/20",
                    )}
                  >
                    {index === 3 && post.imageUrls
                      ? post.imageUrls?.length >= 5 && <p>More...</p>
                      : null}
                  </div>
                  {image.url && (
                    <Image
                      className="h-full w-full object-cover object-center"
                      src={image.url}
                      alt="post image"
                      width={1000}
                      height={1000}
                      quality={100}
                      // placeholder="blur"
                      // blurDataURL=""
                      priority
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default PostCard;
